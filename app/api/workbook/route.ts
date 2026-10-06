import { env } from 'cloudflare:workers';
import { readStoredWorkbook,saveStoredWorkbook,WorkbookConflict,WorkbookMissing } from '../../../lib/persistence';
import { REQUIREMENT_SETS,requirementSet } from '../../../lib/requirement-sets';
const headers={'Cache-Control':'no-store, max-age=0','CDN-Cache-Control':'no-store','Cloudflare-CDN-Cache-Control':'no-store'};
async function counts(){const entries=await Promise.all(Object.entries(REQUIREMENT_SETS).map(async([set,config])=>{try{const c=await readStoredWorkbook((env as any).BUCKET,set);return [set,{label:config.label,active:c.data.records.length,deleted:c.data.deleted.length,available:true}];}catch(e){if(!(e instanceof WorkbookMissing))throw e;return [set,{label:config.label,active:0,deleted:0,available:false}];}}));return Object.fromEntries(entries);}
export async function GET(request:Request){try{
 const url=new URL(request.url),set=requirementSet(url.searchParams.get('set'));
 let c;try{c=await readStoredWorkbook((env as any).BUCKET,set);}catch(e){if(set==='security'&&e instanceof WorkbookMissing)return Response.json({set,label:REQUIREMENT_SETS[set].label,missing:true,records:[],deleted:[],columns:[],sheets:[],activity:[],counts:await counts()},{headers});throw e;}
 if(url.searchParams.has('download'))return new Response(c.bytes,{headers:{...headers,'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','Content-Disposition':'attachment; filename="'+c.data.filename+'"'}});
 return Response.json({...c.data,counts:await counts(),version:c.etag,sync:{mode:'persistent-workbook',automatic:true,readOnly:(env as any).WORKBOOK_READ_ONLY==='true',storage:c.storage}},{headers});
 }catch(e){return Response.json({error:(e as Error).message},{status:503,headers})}}
export async function POST(request:Request){try{
 if((env as any).WORKBOOK_READ_ONLY==='true')return Response.json({error:'Workbook changes are temporarily paused for deployment migration. Your draft has been preserved.'},{status:423,headers});
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Invalid request origin.'},{status:403,headers});
 const raw=await request.text();if(raw.length>100000)return Response.json({error:'Requirement data exceeds the 100 KB limit.'},{status:413,headers});
 const body:any=JSON.parse(raw);requirementSet(body.set);if(!['add','edit','delete','restore','purge','empty'].includes(body.op))throw Error('Unsupported workbook action.');
 const result=await saveStoredWorkbook((env as any).BUCKET,body);
 return Response.json({...result,counts:await counts()},{headers});
 }catch(e){console.error('Workbook write failed',e);return Response.json({error:(e as Error).message},{status:e instanceof WorkbookConflict?409:400,headers})}}
