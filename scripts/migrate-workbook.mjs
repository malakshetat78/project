// One-time hosting migration. Never run as part of Add/Edit/Delete/Restore or CI.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {readBook} from '../lib/workbook.ts';
import {WORKBOOK_KEY} from '../lib/persistence.ts';
const source=new URL(process.argv[2]??'').origin;
if(!process.env.CLOUDFLARE_API_TOKEN||!process.env.CLOUDFLARE_ACCOUNT_ID)throw Error('Configure destination Cloudflare credentials securely before migration.');
const destination='icvsp-requirements-workbook/'+WORKBOOK_KEY;
const workdir=fs.mkdtempSync(path.join(os.tmpdir(),'icvsp-migration-'));
const live=path.join(workdir,'live.xlsx'),existing=path.join(workdir,'destination.xlsx');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const run=args=>spawnSync('pnpm',['exec','wrangler','r2','object',...args,'--remote'],{encoding:'utf8',env:process.env,maxBuffer:4*1024*1024});
const readSource=async()=>{const response=await fetch(source+'/api/workbook',{cache:'no-store'});if(!response.ok)throw Error('Source workbook read failed: HTTP '+response.status);const d=await response.json();if(d.sync?.storage?.key!==WORKBOOK_KEY||d.sync.readOnly!==true)throw Error('Pause source writes first (WORKBOOK_READ_ONLY=true on a backend with the migration guard).');return d;};
try {
 const before=await readSource();
 const response=await fetch(source+'/api/workbook?download=1',{cache:'no-store'});
 if(!response.ok)throw Error('Source workbook bytes unavailable: HTTP '+response.status);
 const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length>32*1024*1024)throw Error('Workbook exceeds migration size limit.');
 if(sha(bytes)!==before.sync.storage.sha256)throw Error('Source workbook changed during migration; no write made.');
 const book=readBook(bytes);if(book.sheets.length!==8||book.columns.length!==16)throw Error('Unexpected source workbook structure.');
 if((await readSource()).version!==before.version)throw Error('Source workbook changed; no write made.');
 fs.writeFileSync(live,bytes,{mode:0o600});
 const inspect=run(['get',destination,'--file',existing]);
 if(inspect.status===0){if(sha(fs.readFileSync(existing))===sha(bytes)){console.log('Destination already contains the identical workbook; no overwrite performed.');process.exitCode=0;}else throw Error('Destination already contains different data. Refusing to overwrite an existing live workbook.');}
 else {
  if(!((inspect.stdout??'')+(inspect.stderr??'')).includes('The specified key does not exist.'))throw Error('Cannot establish that destination object is absent. Check account, bucket and permissions.');
  const upload=run(['put',destination,'--file',live,'--content-type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);
  if(upload.status!==0)throw Error('Destination workbook upload failed.');
  const verify=run(['get',destination,'--file',existing]);if(verify.status!==0||sha(fs.readFileSync(existing))!==sha(bytes))throw Error('Destination byte-for-byte verification failed. Keep source paused and investigate.');
  if((await readSource()).version!==before.version)throw Error('Source changed during migration. Do not cut over to the destination.');
  console.log('Migrated and verified exact workbook bytes; key '+WORKBOOK_KEY+'; SHA-256 '+sha(bytes)+'; '+book.records.length+' active records; eight sheets and sixteen fields.');
 }
} finally {fs.rmSync(workdir,{recursive:true,force:true});}
