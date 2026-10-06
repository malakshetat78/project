// One-time hosting migration of both live workbooks. Never part of normal saves or CI.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {readBook} from '../lib/workbook.ts';
import {REQUIREMENT_SETS} from '../lib/requirement-sets.ts';
const source=new URL(process.argv[2]??'').origin;
if(!process.env.CLOUDFLARE_API_TOKEN||!process.env.CLOUDFLARE_ACCOUNT_ID)throw Error('Configure destination Cloudflare credentials securely before migration.');
const workdir=fs.mkdtempSync(path.join(os.tmpdir(),'icvsp-migration-'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const run=args=>spawnSync('pnpm',['exec','wrangler','r2','object',...args,'--remote'],{encoding:'utf8',env:process.env,maxBuffer:4*1024*1024});
const readSource=async(set)=>{const response=await fetch(source+'/api/workbook?set='+set,{cache:'no-store'});if(!response.ok)throw Error('Source workbook read failed: HTTP '+response.status);const d=await response.json();if(d.missing)throw Error('Import '+set+' in the existing application before migrating both sources.');if(d.sync?.storage?.key!==REQUIREMENT_SETS[set].key||d.sync.readOnly!==true)throw Error('Pause source writes first (WORKBOOK_READ_ONLY=true on the old backend).');return d;};
try {
 // Freeze and validate both source versions before writing either destination.
 const plans=[];
 for(const [set,config] of Object.entries(REQUIREMENT_SETS)){
  const before=await readSource(set),destination='icvsp-requirements-workbook/'+config.key;
  const response=await fetch(source+'/api/workbook?set='+set+'&download=1',{cache:'no-store'});
  if(!response.ok)throw Error('Source workbook bytes unavailable: HTTP '+response.status);
  const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length>32*1024*1024)throw Error('Workbook exceeds migration size limit.');
  if(sha(bytes)!==before.sync.storage.sha256)throw Error('Source changed during migration; no write made.');
  const book=readBook(bytes);if(book.sheets.length!==(set==='security'?10:8)||book.columns.length!==(set==='security'?14:16))throw Error('Unexpected source workbook structure.');
  if((await readSource(set)).version!==before.version)throw Error('Source changed; no write made.');
  const live=path.join(workdir,set+'-live.xlsx'),existing=path.join(workdir,set+'-destination.xlsx');fs.writeFileSync(live,bytes,{mode:0o600});
  const inspect=run(['get',destination,'--file',existing]);let absent=false;
  if(inspect.status===0){if(sha(fs.readFileSync(existing))!==sha(bytes))throw Error('Destination already contains different '+set+' data. Refusing overwrite.');}
  else {if(!((inspect.stdout??'')+(inspect.stderr??'')).includes('The specified key does not exist.'))throw Error('Cannot establish that destination object is absent. Check account/bucket permissions.');absent=true;}
  plans.push({set,destination,before,bytes,live,existing,absent});
 }
 for(const p of plans){
  if((await readSource(p.set)).version!==p.before.version)throw Error('Source changed; keep the old backend paused.');
  if(p.absent){const upload=run(['put',p.destination,'--file',p.live,'--content-type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);if(upload.status!==0)throw Error('Destination upload failed for '+p.set+'.');}
  const verify=run(['get',p.destination,'--file',p.existing]);if(verify.status!==0||sha(fs.readFileSync(p.existing))!==sha(p.bytes))throw Error('Destination byte verification failed. Do not cut over.');
  console.log('Verified '+p.set+' workbook; key '+REQUIREMENT_SETS[p.set].key+'; SHA-256 '+sha(p.bytes));
 }
 for(const p of plans)if((await readSource(p.set)).version!==p.before.version)throw Error('Source changed. Do not cut over.');
 console.log('Both current live sources verified. Keep old backend read-only after cutover.');
} finally {fs.rmSync(workdir,{recursive:true,force:true});}
