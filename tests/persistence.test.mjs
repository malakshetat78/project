import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {syntheticBook} from './synthetic-fixture.mjs';
import {readBook} from '../lib/workbook.ts';
import {WORKBOOK_KEY,readStoredWorkbook,saveStoredWorkbook} from '../lib/persistence.ts';

class TestBucket {
  objects=new Map([[WORKBOOK_KEY,syntheticBook()]]); reads=[]; writes=[]; fail=false; reject=false; discard=false;
  etag(bytes){return createHash('sha256').update(bytes).digest('hex');}
  async get(key){this.reads.push(key);const bytes=this.objects.get(key);return bytes?{etag:this.etag(bytes),uploaded:new Date('2026-10-03T00:00:00Z'),arrayBuffer:async()=>new Uint8Array(bytes).buffer}:null;}
  async put(key,bytes,options){this.writes.push(key);if(key===WORKBOOK_KEY){if(this.fail)throw Error('R2 write unavailable');if(this.reject||options.onlyIf.etagMatches!==this.etag(this.objects.get(key)))return null;}if(!this.discard||key!==WORKBOOK_KEY)this.objects.set(key,new Uint8Array(bytes));return {etag:this.etag(bytes)};}
}
test('all four saves overwrite the exact live key, await storage and independently reread it without export',async()=>{
 const bucket=new TestBucket();const values={...readBook(syntheticBook()).records[0].values,ID:'TEST-PERSISTENCE',Requirement:'Saved automatically'};
 let version=(await readStoredWorkbook(bucket)).etag;
 for(const action of [{op:'add',values},{op:'edit',id:values.ID,values:{...values,Requirement:'Edited automatically'}},{op:'delete',id:values.ID},{op:'restore',id:values.ID}]){
  const before=version;const result=await saveStoredWorkbook(bucket,{...action,version});version=result.version;
  assert.notEqual(version,before);assert.equal(result.receipt.verified,true);assert.equal(result.receipt.key,WORKBOOK_KEY);assert.equal(bucket.reads.at(-1),WORKBOOK_KEY);
  const independent=readBook(bucket.objects.get(WORKBOOK_KEY));const list=action.op==='delete'?independent.data.deleted:independent.records;
  assert.equal(list.find(r=>r.values.ID===values.ID).values.Requirement,action.op==='add'?values.Requirement:'Edited automatically');
  assert.equal(independent.sheets.length,8);assert.equal(independent.columns.length,16);
 }
 assert.equal(bucket.writes.filter(k=>k===WORKBOOK_KEY).length,4);
 assert.equal([...bucket.objects.keys()].filter(k=>!k.startsWith('workbook/backups/')).length,1);
});
test('stale versions, conditional write races, thrown failures and lost writes cannot report success',async()=>{
 const values={...readBook(syntheticBook()).records[0].values,ID:'TEST-FAIL',Requirement:'Failure verification'};
 for(const mode of ['stale','reject','fail','discard']){
  const bucket=new TestBucket();const version=(await readStoredWorkbook(bucket)).etag;bucket[mode]=true;
  await assert.rejects(()=>saveStoredWorkbook(bucket,{op:'add',values,version:mode==='stale'?'old-version':version}));
  assert.equal(readBook(bucket.objects.get(WORKBOOK_KEY)).records.some(r=>r.values.ID===values.ID),false);
 }
});
test('missing live object fails rather than selecting a backup or creating another live workbook',async()=>{
 const bucket=new TestBucket();bucket.objects.delete(WORKBOOK_KEY);bucket.objects.set('workbook/current.xlsx',syntheticBook());
 await assert.rejects(()=>readStoredWorkbook(bucket),/live workbook is missing/);assert.equal(bucket.writes.length,0);
});
