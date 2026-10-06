import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {zipSync,unzipSync,strFromU8,strToU8} from 'fflate';
import {syntheticBook} from './synthetic-fixture.mjs';
import {readBook} from '../lib/workbook.ts';
import {readStoredWorkbook,saveStoredWorkbook} from '../lib/persistence.ts';
import {REQUIREMENT_SETS,requirementSet} from '../lib/requirement-sets.ts';
import {importSecurityWorkbook} from '../lib/security-import.ts';
function securityFixture(){
 const files=unzipSync(syntheticBook());
 let req=strFromU8(files['xl/worksheets/sheet6.xml']);
 // Synthetic values only; exercise a different column count and header set.
 const book=readBook(syntheticBook());req=strFromU8(files[book.req.path]);
 req=req.replace(/<c\b[^>]*r="[OP]\d+"[^>]*>[\s\S]*?<\/c>/g,'').replaceAll('Evidence','Evidence / notes').replaceAll('Owner (WP)','Owner').replaceAll('Priority','Scope');
 files[book.req.path]=strToU8(req);return zipSync(files);
}
class Bucket{
 objects=new Map([[REQUIREMENT_SETS.icvsp.key,syntheticBook()],[REQUIREMENT_SETS.security.key,securityFixture()]]);writes=[];
 etag(b){return createHash('sha256').update(b).digest('hex');}
 async get(key){const bytes=this.objects.get(key);return bytes?{etag:this.etag(bytes),arrayBuffer:async()=>new Uint8Array(bytes).buffer}:null;}
 async put(key,bytes,options){const old=this.objects.get(key);if(options?.onlyIf?.etagDoesNotMatch==='*'&&old)return null;if(options?.onlyIf?.etagMatches&&(!old||this.etag(old)!==options.onlyIf.etagMatches))return null;this.objects.set(key,new Uint8Array(bytes));this.writes.push(key);return {etag:this.etag(bytes)};}
}
test('both sets independently read/add/edit/delete/restore/purge without changing the other workbook',async()=>{
 const bucket=new Bucket();assert.throws(()=>requirementSet('../../other'),/Unknown/);
 for(const set of ['icvsp','security']){
  const other=set==='icvsp'?'security':'icvsp';const untouched=new Uint8Array(bucket.objects.get(REQUIREMENT_SETS[other].key));
  let state=await readStoredWorkbook(bucket,set);const before=state.data;
  const values=Object.fromEntries(state.data.columns.map(c=>[c.name,'']));Object.assign(values,{ID:'TEST-SAME-ID',Type:'FR',Requirement:'Added '+set});
  async function save(action){const r=await saveStoredWorkbook(bucket,{...action,set,version:state.etag});state=await readStoredWorkbook(bucket,set);assert.equal(r.receipt.verified,true);assert.equal(r.receipt.key,REQUIREMENT_SETS[set].key);assert.deepEqual(bucket.objects.get(REQUIREMENT_SETS[other].key),untouched);}
  await save({op:'add',values});assert.deepEqual(state.data.records.find(r=>r.values.ID===values.ID).values,values);
  values.Requirement='Edited '+set;await save({op:'edit',id:values.ID,values});await save({op:'delete',id:values.ID});assert.deepEqual(state.data.deleted.find(r=>r.values.ID===values.ID).values,values);
  await save({op:'restore',id:values.ID});assert.deepEqual(state.data.records.find(r=>r.values.ID===values.ID).values,values);
  await save({op:'delete',id:values.ID});await save({op:'purge',id:values.ID,confirmed:true});
  assert.equal(state.data.deleted.some(r=>r.values.ID===values.ID),false);await assert.rejects(()=>save({op:'restore',id:values.ID}),/not found/);
  assert.deepEqual(state.data.records,before.records);assert.deepEqual(state.data.columns,before.columns);
 }
});
test('actual supplied security workbook imports unchanged once and preserves 10 sheets, 14 fields and links', {skip:!process.env.ICVSP_SECURITY_TEST_WORKBOOK},async()=>{
 const bucket=new Bucket();bucket.objects.delete(REQUIREMENT_SETS.security.key);
 const original=new Uint8Array(fs.readFileSync(process.env.ICVSP_SECURITY_TEST_WORKBOOK));const icvsp=new Uint8Array(bucket.objects.get(REQUIREMENT_SETS.icvsp.key));
 const result=await importSecurityWorkbook(bucket,original);assert.equal(result.receipt.verified,true);assert.equal(result.records.length,37);assert.equal(result.columns.length,14);assert.equal(result.sheets.length,10);assert.deepEqual(bucket.objects.get(REQUIREMENT_SETS.security.key),original);assert.deepEqual(bucket.objects.get(REQUIREMENT_SETS.icvsp.key),icvsp);
 await assert.rejects(()=>importSecurityWorkbook(bucket,original),/already imported/);await assert.rejects(()=>importSecurityWorkbook(bucket,syntheticBook()),/provided/);
 const before=readBook(original);let state=await readStoredWorkbook(bucket,'security');const values={...before.records[0].values,ID:'TEST-SEC-FILE',Requirement:'Disposable fixture CRUD test'};
 for(const action of [{op:'add',values},{op:'edit',id:values.ID,values:{...values,Requirement:'Edited'}},{op:'delete',id:values.ID},{op:'restore',id:values.ID},{op:'delete',id:values.ID},{op:'purge',id:values.ID,confirmed:true}]){await saveStoredWorkbook(bucket,{...action,set:'security',version:state.etag});state=await readStoredWorkbook(bucket,'security');assert.deepEqual(bucket.objects.get(REQUIREMENT_SETS.icvsp.key),icvsp);}
 const after=readBook(state.bytes);assert.deepEqual(after.records,before.records);assert.deepEqual(after.columns,before.columns);
 for(const sheet of before.sheets.filter(s=>!['Requirements','Summary','Traceability'].includes(s.name)))assert.deepEqual(after.files[sheet.path],before.files[sheet.path]);
 assert.equal(after.columns.at(-1).letter,'N');assert.equal(after.columns.some(c=>c.name==='Priority'),false);
});
