import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const result=spawnSync(process.execPath,['scripts/run-framework.mjs','build'],{stdio:'inherit',env:{...process.env,DEPLOY_TARGET:'cloudflare'}});
if(result.error)throw result.error;
if(result.status)process.exit(result.status);
const config=JSON.parse(fs.readFileSync('dist/server/wrangler.json','utf8'));
if(config.r2_buckets?.length!==1||config.r2_buckets[0].binding!=='BUCKET'||config.r2_buckets[0].bucket_name!=='icvsp-requirements-workbook')throw Error('Cloudflare build must have exactly one production R2 binding.');
if(config.services?.length||config.d1_databases?.length)throw Error('Unexpected deployment services/database bindings.');
console.log('Cloudflare build verified: one BUCKET binding, existing frontend/API, no Sites services.');
