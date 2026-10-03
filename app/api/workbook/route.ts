import { env } from 'cloudflare:workers';
import { readStoredWorkbook,saveStoredWorkbook,WorkbookConflict } from '../../../lib/persistence';
const headers={'Cache-Control':'no-store, max-age=0','CDN-Cache-Control':'no-store','Cloudflare-CDN-Cache-Control':'no-store'};
export async function GET(request:Request){try{const c=await readStoredWorkbook((env as any).BUCKET);if(new URL(request.url).searchParams.has('download'))return new Response(c.bytes,{headers:{...headers,'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','Content-Disposition':'attachment; filename="ICVSP_V-Cycle_Reviewed_Updated.xlsx"'}});return Response.json({...c.data,version:c.etag,sync:{mode:'persistent-workbook',automatic:true,readOnly:(env as any).WORKBOOK_READ_ONLY==='true',storage:c.storage}},{headers})}catch(e){return Response.json({error:(e as Error).message},{status:503,headers})}}
export async function POST(request:Request){try{
 if((env as any).WORKBOOK_READ_ONLY==='true')return Response.json({error:'Workbook changes are temporarily paused for deployment migration. Your draft has been preserved.'},{status:423,headers});
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Invalid request origin.'},{status:403});
 const raw=await request.text();if(raw.length>100000)return Response.json({error:'Requirement data exceeds the 100 KB limit.'},{status:413});
 const body:any=JSON.parse(raw);if(!['add','edit','delete','restore','purge','empty'].includes(body.op))return Response.json({error:'Unsupported workbook action.'},{status:400});
 return Response.json(await saveStoredWorkbook((env as any).BUCKET,body),{headers});
 }catch(e){console.error('Workbook write failed',e);return Response.json({error:(e as Error).message},{status:e instanceof WorkbookConflict?409:400,headers})}}
