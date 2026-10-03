import assert from 'node:assert/strict';
import {WORKBOOK_KEY} from '../lib/persistence.ts';
const origin=new URL(process.argv[2]??process.env.APP_PUBLIC_URL??'').origin;
if(new URL(origin).hostname.endsWith('.chatgpt.site'))throw Error('Acceptance must use the new deployment, outside ChatGPT Sites.');
const html=await fetch(origin,{cache:'no-store'});assert.equal(html.ok,true,'Public frontend must load');assert.match(await html.text(),/ICVSP/);
const read=async()=>{const response=await fetch(origin+'/api/workbook',{cache:'no-store'});assert.equal(response.ok,true,'Public backend must read the migrated workbook');const d=await response.json();assert.equal(d.sync.storage.key,WORKBOOK_KEY);assert.equal(d.sheets.length,8);assert.equal(d.columns.length,16);assert.match(d.sync.storage.sha256,/^[a-f0-9]{64}$/);return d;};
let data=await read();console.log('Public read verified: '+origin+'; workbook key '+WORKBOOK_KEY+'; active requirements '+data.records.length);
if(!process.argv.includes('--crud'))process.exit(0);
const id='TEST-DEPLOY-'+Date.now()+'-'+crypto.randomUUID().slice(0,8);
const values=Object.fromEntries(data.columns.map(c=>[c.name,'']));Object.assign(values,{ID:id,Type:'FR',Requirement:'Disposable GitHub deployment acceptance test',Status:'Planned'});
let active=false;
async function save(action){const previous=data.sync.storage;const response=await fetch(origin+'/api/workbook',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...action,version:data.version})});const result=await response.json();assert.equal(response.ok,true,result.error);assert.equal(result.receipt?.verified,true);assert.equal(result.receipt.key,WORKBOOK_KEY);data=await read();assert.notEqual(data.sync.storage.etag,previous.etag);assert.notEqual(data.sync.storage.sha256,previous.sha256);console.log(action.op+' verified by fresh live workbook read; ETag '+data.version);}
try {
 await save({op:'add',values});active=true;assert.deepEqual(data.records.find(r=>r.values.ID===id).values,values);
 values.Requirement='Edited deployment acceptance test';values.Status='Partial';await save({op:'edit',id,values});assert.deepEqual(data.records.find(r=>r.values.ID===id).values,values);
 await save({op:'delete',id});active=false;assert.equal(data.records.some(r=>r.values.ID===id),false);assert.deepEqual(data.deleted.find(r=>r.values.ID===id).values,values);
 await save({op:'restore',id});active=true;assert.deepEqual(data.records.find(r=>r.values.ID===id).values,values);
 const newSession=await read();assert.deepEqual(newSession.records.find(r=>r.values.ID===id).values,values);console.log('All four live CRUD checks and independent read passed. Export was not used.');
} finally {
 data=await read();active=data.records.some(r=>r.values.ID===id);
 if(active){await save({op:'delete',id});console.log('Disposable test moved to Recycle Bin.');}
}
