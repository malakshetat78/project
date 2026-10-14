import {env} from 'cloudflare:workers';
import {projectUser} from '../../project-auth';
import {permissionFor,requireAdmin} from '../../../lib/permissions';
import {readStoredTimeline} from '../../../lib/timeline';
import {planTaskUpsert,saveTaskUpsert} from '../../../lib/task-upsert';
import {TASK_UPDATE} from '../../../lib/task-update-targets';
import {WorkbookConflict} from '../../../lib/persistence';
const headers={'Cache-Control':'no-store'};
export async function GET(){try{const current=await readStoredTimeline((env as any).BUCKET);return Response.json({revision:TASK_UPDATE.revision,version:current.etag,report:planTaskUpsert(current.bytes,TASK_UPDATE.tasks)},{headers});}catch(e){return Response.json({error:(e as Error).message},{status:503,headers});}}
export async function POST(request:Request){try{const permission=permissionFor(await projectUser(request),(env as any).ADMIN_EMAILS??'');requireAdmin(permission);if((env as any).WORKBOOK_READ_ONLY==='true')return Response.json({error:'Writes are paused.'},{status:423,headers});if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Invalid request origin.'},{status:403,headers});const raw=await request.text();if(raw.length>1000)throw Error('Update request is too large.');const action=JSON.parse(raw);if(action.revision!==TASK_UPDATE.revision)throw Error('Refresh the update preview.');return Response.json(await saveTaskUpsert((env as any).BUCKET,action.version,TASK_UPDATE.tasks,permission.email),{headers});}catch(e){return Response.json({error:(e as Error).message},{status:e instanceof WorkbookConflict?409:/Admin sign-in/.test((e as Error).message)?403:400,headers});}}
