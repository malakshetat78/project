// Short-lived owner-configured service access applies only to the baked-in import.
// It grants no task CRUD, requirement or project-settings permissions.
export async function ownerImportAccess(authorization:string|null,configuration:any,revision:string){
 const token=String(configuration.TASK_IMPORT_TOKEN??'');const expires=Date.parse(String(configuration.TASK_IMPORT_EXPIRES_AT??''));
 if(token.length<40||!Number.isFinite(expires)||expires<=Date.now()||expires>Date.now()+60*60*1000||configuration.TASK_IMPORT_REVISION!==revision)return false;
 const provided=authorization?.startsWith('Bearer ')?authorization.slice(7):'';
 if(!provided||provided.length>512)return false;
 const digest=async(s:string)=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)));
 const [a,b]=await Promise.all([digest(token),digest(provided)]);let difference=0;for(let i=0;i<a.length;i++)difference|=a[i]^b[i];return difference===0;
}
