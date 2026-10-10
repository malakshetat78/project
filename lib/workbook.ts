import { unzipSync, zipSync, strFromU8, strToU8 } from 'fflate';
import { XMLParser } from 'fast-xml-parser';
const parser = new XMLParser({ignoreAttributes:false,attributeNamePrefix:'@',parseTagValue:false,trimValues:false,removeNSPrefix:true});
const arr=(x:any)=>x==null?[]:Array.isArray(x)?x:[x];
const esc=(v:any)=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const normalize=(xml:string)=>{
 const match=xml.match(/xmlns:([A-Za-z0-9_]+)="http:\/\/schemas.openxmlformats.org\/spreadsheetml\/2006\/main"/);
 if(!match)return xml;
 const prefix=match[1];return xml.replace(new RegExp('(<\\/?)(?:'+prefix+'):','g'),'$1').replace(match[0],xml.includes('xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"')?match[0]:match[0]+' xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"');
};
export function readSheets(bytes:Uint8Array){
 const files=unzipSync(bytes), wb=parser.parse(strFromU8(files['xl/workbook.xml'])).workbook;
 const rels=arr(parser.parse(strFromU8(files['xl/_rels/workbook.xml.rels'])).Relationships.Relationship);
 const text=(x:any):string=>typeof x==='string'?x:x?.['#text']??arr(x?.r).map((r:any)=>text(r.t)).join('');
 const strings=files['xl/sharedStrings.xml']?arr(parser.parse(strFromU8(files['xl/sharedStrings.xml'])).sst.si).map((s:any)=>s.t!==undefined?text(s.t):arr(s.r).map((r:any)=>text(r.t)).join('')):[];
 const sheets=arr(wb.sheets.sheet).map((s:any)=>{
  const target=rels.find((r:any)=>r['@Id']===s['@id'])['@Target']; const path=target.startsWith('/')?target.slice(1):'xl/'+target;
  const xml=strFromU8(files[path]);const root=parser.parse(xml).worksheet;
  const rows=arr(root.sheetData?.row).map((r:any)=>{const cells:any={};for(const c of arr(r.c)){const letter=c['@r'].replace(/\d/g,'');cells[letter]=c['@t']==='s'?strings[Number(c.v)]:c['@t']==='inlineStr'?text(c.is?.t):String(c.v??'');}return {row:Number(r['@r']),cells}});
  return {name:s['@name'],path,rows,xml};
 });
 return {files,sheets,wb};
}
export function readBook(bytes:Uint8Array){
 const {files,sheets}=readSheets(bytes);
 const req=sheets.find((s:any)=>s.name==='Requirements');if(!req)throw Error('Workbook must contain its existing Requirements sheet.');
 const header=req.rows.find((r:any)=>r.cells.A==='ID');if(!header)throw Error('The Requirements header could not be found.');
 const columns=Object.entries(header.cells).map(([letter,name])=>({letter,name:String(name)}));
 if(!columns.some((c:any)=>c.name==='Requirement'))throw Error('Requirement column is missing.');
 const records=req.rows.filter((r:any)=>r.row>header.row&&r.cells.A).map((r:any)=>({row:r.row,values:Object.fromEntries(columns.map((c:any)=>[c.name,r.cells[c.letter]??'']))}));
 const metadata=files['customXml/icvsp-workspace.xml']?JSON.parse(parser.parse(strFromU8(files['customXml/icvsp-workspace.xml'])).workspace.data):files['icvsp/recycle.json']?JSON.parse(strFromU8(files['icvsp/recycle.json'])):{deleted:[],activity:[]};
 const data={columns,records,deleted:metadata.deleted,activity:metadata.activity,sheets:sheets.map((s:any)=>({name:s.name,rows:s.rows})),filename:'ICVSP_V-Cycle_Reviewed_Updated.xlsx'};
 return {files,sheets,req,header,columns,records,metadata,data};
}
export function changeBook(bytes:Uint8Array,action:any){
 const b=readBook(bytes), {files,req,records,metadata,columns}=b;
 req.xml=normalize(req.xml);let xml=req.xml;const now=new Date().toISOString();let id=action.id;
 const find=()=>{const r=records.find((r:any)=>r.values.ID===id);if(!r)throw Error('Requirement no longer exists. Refresh and try again.');return r};
 const rowXml=(r:number,values:any,original='')=>{
  const start=original.match(/<row\b[^>]*>/)?.[0]??req.xml.match(/<row\b[^>]*r="2"[^>]*>/)?.[0]?.replace(/r="2"/,'r="'+r+'"')??'<row r="'+r+'">';
  return start+columns.map((c:any)=>{
   const cell=[...original.matchAll(/<c\b[^>]*\/>|<c\b[^>]*>[\s\S]*?<\/c>/g)].map(m=>m[0]).find(x=>new RegExp('\\br="'+c.letter+r+'"').test(x));
   const old=records.find((x:any)=>x.row===r);
   if(cell&&old?.values[c.name]===values[c.name])return cell;
   const template=cell??req.xml.match(new RegExp('<c\\b[^>]*r="'+c.letter+'2"[^>]*>'))?.[0];
   const style=template?.match(/\bs="(\d+)"/)?.[1];
   return '<c r="'+c.letter+r+'"'+(style?' s="'+style+'"':'')+' t="inlineStr"><is><t xml:space="preserve">'+esc(values[c.name])+'</t></is></c>';
  }).join('')+'</row>';
 };
 const replace=(r:number,s:string)=>{const re=new RegExp('<row\\b[^>]*r="'+r+'"[^>]*>[\\s\\S]*?</row>');if(re.test(xml))xml=xml.replace(re,()=>s);else xml=xml.replace('</sheetData>',s+'</sheetData>')};
 if(action.op==='delete'){const r=find();const original=xml.match(new RegExp('<row\\b[^>]*r="'+r.row+'"[^>]*>[\\s\\S]*?</row>'))?.[0];metadata.deleted.push({...r,original,deletedAt:now});replace(r.row,'<row r="'+r.row+'"/>');}
 else if(action.op==='purge'||action.op==='empty'){
  if(action.confirmed!==true)throw Error('Explicit permanent deletion confirmation is required.');
  const targets=action.op==='purge'?[id]:action.ids;
  if(!Array.isArray(targets)||!targets.length||targets.some((v:any)=>typeof v!=='string')||new Set(targets).size!==targets.length)throw Error('Select deleted requirements to permanently delete.');
  const deletedIds=metadata.deleted.map((r:any)=>r.values.ID);
  if(targets.some((v:string)=>!deletedIds.includes(v)))throw Error('Deleted requirement not found. Refresh before confirming.');
  if(action.op==='empty'&&(targets.length!==deletedIds.length||deletedIds.some((v:string)=>!targets.includes(v))))throw Error('The Recycle Bin changed. Refresh and confirm the current count.');
  metadata.deleted=metadata.deleted.filter((r:any)=>!targets.includes(r.values.ID));
 }
 else if(action.op==='restore'){const i=metadata.deleted.findIndex((r:any)=>r.values.ID===id);if(i<0)throw Error('Deleted requirement not found.');if(records.some((r:any)=>r.values.ID===id))throw Error('This ID already exists.');const r=metadata.deleted[i];xml=xml.replace(new RegExp('<row\\b[^>]*r="'+r.row+'"[^>]*/>'),()=>r.original||rowXml(r.row,r.values));metadata.deleted.splice(i,1);}
 else if(action.op==='add'||action.op==='edit'){
  const values:Record<string,string>=Object.fromEntries(columns.map((c:any)=>[c.name,String(action.values?.[c.name]??'')]));values.ID=values.ID.trim();id=values.ID;
  if(id.length>120||Object.values(values).some(v=>v.length>32767))throw Error('ID must be under 120 characters and Excel fields under 32,768 characters.');
  if(Object.values(values).some(v=>/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v)))throw Error('Unsupported control characters in requirement data.');
  if(!id?.trim()||!values.Requirement?.trim())throw Error('ID and Requirement are required.');
  if(action.op==='edit'&&id!==action.id)throw Error('Existing IDs are preserved to protect traceability.');
  if(action.op==='add'&&[...records,...metadata.deleted].some((r:any)=>r.values.ID===id))throw Error('ID already exists, including in the Recycle Bin.');
  const r=action.op==='edit'?find():{row:Math.max(...req.rows.map((r:any)=>r.row),...metadata.deleted.map((r:any)=>r.row))+1};
  const original=xml.match(new RegExp('<row\\b[^>]*r="'+r.row+'"[^>]*>[\\s\\S]*?</row>'))?.[0];replace(r.row,rowXml(r.row,values,original));
 }else throw Error('Unknown action.');
 if(action.op!=='purge'&&action.op!=='empty') files[req.path]=strToU8(xml.replace(/(<dimension\b[^>]*ref=")[^"]+/, '$1A1:'+columns[columns.length-1]!.letter+Math.max(...req.rows.map((r:any)=>r.row),action.op==='add'?Math.max(...req.rows.map((r:any)=>r.row))+1:0)));
 const active=readBook(zipSync(files)).records;
 // Update existing summary formulas to include appended rows; refresh cached values.
 const summary=(action.op==='purge'||action.op==='empty')?null:b.sheets.find((s:any)=>s.name==='Summary');if(summary){let s=normalize(summary.xml);const end=Math.max(...active.map((r:any)=>r.row),38);s=s.replace(/(Requirements!\$?[A-P]\$?2:\$?[A-P]\$?)\d+/g,(_m:string,p:string)=>p+end);s=s.replace(/<c\b([^>]*)>([\s\S]*?)<\/c>/g,(whole:string,attrs:string,inside:string)=>{const f=inside.match(/<f[^>]*>([\s\S]*?)<\/f>/)?.[1];if(!f)return whole;let n:number|undefined;const criteria=arr([...f.matchAll(/Requirements!\$?([A-P])\$?2:\$?[A-P]\$?\d+,\s*(?:&quot;|")([^<]*?)(?:&quot;|")/g)]);if(/COUNTIF/.test(f)&&criteria.length){n=active.filter((r:any)=>criteria.every((m:any)=>{const name=columns.find((c:any)=>c.letter===m[1])?.name;return name&&r.values[name]===m[2]})).length;}if(n===undefined&&/COUNTA\(Requirements!/.test(f))n=active.length;if(n===undefined)return whole;return '<c'+attrs+'>'+(/<v(?:\s[^>]*)?>/.test(inside)?inside.replace(/<v(?:\s[^>]*)?>[^<]*<\/v>/,'<v>'+n+'</v>'):inside+'<v>'+n+'</v>')+'</c>'});files[summary.path]=strToU8(s);}
 // Refresh only existing formula cells identified by actual Traceability headers.
 const trace=(action.op==='purge'||action.op==='empty')?null:b.sheets.find((s:any)=>s.name==='Traceability');
 if(trace){let x=normalize(trace.xml);const headers=trace.rows[0]?.cells??{};
  const idColumn=Object.keys(headers).find(k=>headers[k]==='Requirement');
  for(const row of trace.rows.filter((r:any)=>r.row>1)){
   const r=active.find((r:any)=>r.values.ID===row.cells[idColumn??'']);
   for(const [letter,heading] of Object.entries(headers)){
    const field=heading==='Requirement (short)'?'Requirement':heading==='Status'||heading==='Status (from Requirements)'?'Status':null;
    if(!field)continue;
    const re=new RegExp('<c\\b[^>]*r="'+letter+row.row+'"[^>]*>[\\s\\S]*?</c>');
    x=x.replace(re,(cell:string)=>cell.includes('<f')?cell.replace(/ t="[^"]*"/,'').replace(/^<c /,'<c t="str" ').replace(/<v>[\s\S]*?<\/v>/,'<v>'+esc(r?.values[field]??'')+'</v>'):cell);
   }
  }
  files[trace.path]=strToU8(x);
 }
 metadata.activity.unshift({op:action.op,id,count:action.op==='empty'?action.ids.length:undefined,at:now});metadata.activity=metadata.activity.slice(0,100);files['customXml/icvsp-workspace.xml']=strToU8('<?xml version="1.0" encoding="UTF-8"?><icvsp:workspace xmlns:icvsp="urn:icvsp:requirements"><icvsp:data>'+esc(JSON.stringify(metadata))+'</icvsp:data></icvsp:workspace>');delete files['icvsp/recycle.json'];
 let relationships=strFromU8(files['xl/_rels/workbook.xml.rels']);if(!relationships.includes('icvsp-workspace.xml')){const rootPrefix=relationships.match(/<([\w]+:)?Relationships\b/)?.[1]??'';relationships=relationships.replace('</'+rootPrefix+'Relationships>','<'+rootPrefix+'Relationship Id="rIdIcvspWorkspace" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml" Target="../customXml/icvsp-workspace.xml"/></'+rootPrefix+'Relationships>');files['xl/_rels/workbook.xml.rels']=strToU8(relationships);}
 let types=strFromU8(files['[Content_Types].xml']);if(!types.includes('/customXml/icvsp-workspace.xml')){const prefix=types.match(/<([\w]+:)?Types\b/)?.[1]??'';types=types.replace('</'+prefix+'Types>','<'+prefix+'Override PartName="/customXml/icvsp-workspace.xml" ContentType="application/xml"/></'+prefix+'Types>');files['[Content_Types].xml']=strToU8(types);}
 let wb=normalize(strFromU8(files['xl/workbook.xml']));wb=wb.replace(/<calcPr\b[^>]*\/?\s*>/,'<calcPr calcId="191029" fullCalcOnLoad="1" forceFullCalc="1"/>');files['xl/workbook.xml']=strToU8(wb);
 return zipSync(files);
}
