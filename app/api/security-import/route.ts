import {projectUser} from '../../project-auth';
import {permissionFor,requireAdmin} from '../../../lib/permissions';
import { env } from 'cloudflare:workers';
import {importSecurityWorkbook} from '../../../lib/security-import';
import {WorkbookConflict} from '../../../lib/persistence';
export async function POST(request:Request){try{
 requireAdmin(permissionFor(await projectUser(request),(env as any).ADMIN_EMAILS??''));
 if((env as any).WORKBOOK_READ_ONLY==='true')throw Error('Workbook writes are paused for deployment migration.');
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Invalid request origin.'},{status:403});
 const reader=request.body?.getReader();if(!reader)throw Error('Select the provided Security workbook.');
 const chunks:Uint8Array[]=[];let size=0;
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>5*1024*1024){await reader.cancel();throw Error('Workbook exceeds the 5 MB import limit.');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 return Response.json(await importSecurityWorkbook((env as any).BUCKET,bytes),{headers:{'Cache-Control':'no-store'}});
 }catch(e){return Response.json({error:(e as Error).message},{status:e instanceof WorkbookConflict?409:/Admin sign-in|You may update|Members may update/.test((e as Error).message)?403:400,headers:{'Cache-Control':'no-store'}});}}
