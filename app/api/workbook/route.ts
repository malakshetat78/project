import { env } from 'cloudflare:workers';
import { readBook,changeBook } from '../../../lib/workbook';
const key='workbook/ICVSP_V-Cycle_Reviewed_Updated.xlsx';
async function current(){
 const bucket=(env as any).BUCKET;if(!bucket)throw Error('Workbook storage unavailable. Please try again later.');
 let obj=await bucket.get(key);
 if(!obj){const previous=await bucket.get('workbook/current.xlsx');if(previous){await bucket.put(key,await previous.arrayBuffer(),{onlyIf:{etagDoesNotMatch:'*'},httpMetadata:{contentType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}});obj=await bucket.get(key);}}
 if(!obj)throw Error('Persistent workbook is not initialized. An administrator must migrate the existing Excel file into storage during setup.');
 return {bucket,bytes:new Uint8Array(await obj.arrayBuffer()),etag:obj.etag};
}
export async function GET(request:Request){try{const c=await current();if(new URL(request.url).searchParams.has('download'))return new Response(c.bytes,{headers:{'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','Content-Disposition':'attachment; filename="ICVSP_V-Cycle_Reviewed_Updated.xlsx"','Cache-Control':'no-store'}});return Response.json({...readBook(c.bytes).data,version:c.etag,sync:{mode:'persistent-workbook',automatic:true}},{headers:{'Cache-Control':'no-store'}})}catch(e){return Response.json({error:(e as Error).message},{status:503})}}
export async function POST(request:Request){try{
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Invalid request origin.'},{status:403});
 const raw=await request.text();if(raw.length>100000)return Response.json({error:'Requirement data exceeds the 100 KB limit.'},{status:413});
 const body:any=JSON.parse(raw);if(!['add','edit','delete','restore'].includes(body.op))return Response.json({error:'Unsupported workbook action.'},{status:400});
 const c=await current();if(body.version!==c.etag)return Response.json({error:'Excel changed in another session. Refresh before saving; your draft has been preserved.'},{status:409});
 const updated=changeBook(c.bytes,body);
 await c.bucket.put('workbook/backups/'+Date.now()+'-'+crypto.randomUUID()+'.xlsx',c.bytes);
 const saved=await c.bucket.put(key,updated,{onlyIf:{etagMatches:c.etag},httpMetadata:{contentType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}});
 if(!saved)return Response.json({error:'Another workbook change was saved first. Refresh and try again; your draft has been preserved.'},{status:409});
 // Return only data reread from the persisted workbook, never an optimistic client copy.
 const persisted=await current();return Response.json({...readBook(persisted.bytes).data,version:persisted.etag,sync:{mode:'persistent-workbook',automatic:true}},{headers:{'Cache-Control':'no-store'}});
 }catch(e){console.error('Workbook write failed',e);return Response.json({error:(e as Error).message},{status:400})}}
