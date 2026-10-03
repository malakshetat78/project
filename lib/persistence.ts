import { readBook, changeBook } from './workbook.ts';

export const WORKBOOK_KEY = 'workbook/ICVSP_V-Cycle_Reviewed_Updated.xlsx';
export class WorkbookConflict extends Error {}

// R2 is the sole authority. No browser state, export, seed, or session copy is read here.
export async function readStoredWorkbook(bucket:any) {
  if (!bucket) throw Error('Workbook storage unavailable. Please try again later.');
  const object = await bucket.get(WORKBOOK_KEY);
  if (!object) throw Error('The live workbook is missing. An administrator must initialize persistent storage once.');
  const bytes = new Uint8Array(await object.arrayBuffer());
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const sha256 = Array.from(new Uint8Array(digest), b=>b.toString(16).padStart(2,'0')).join('');
  return {bytes, data:readBook(bytes).data, etag:object.etag, storage:{key:WORKBOOK_KEY,etag:object.etag,sha256,bytes:bytes.length,uploaded:object.uploaded?.toISOString()??null,readAt:new Date().toISOString()}};
}

export async function saveStoredWorkbook(bucket:any, action:any) {
  const before = await readStoredWorkbook(bucket);
  if (action.version !== before.etag) throw new WorkbookConflict('Excel changed in another session. Refresh before saving; your draft has been preserved.');
  const updated = changeBook(before.bytes, action);
  const expected = readBook(updated).data;
  const id = action.op === 'add' ? String(action.values.ID).trim() : action.id;
  await bucket.put('workbook/backups/'+Date.now()+'-'+crypto.randomUUID()+'.xlsx', before.bytes);
  const saved = await bucket.put(WORKBOOK_KEY, updated, {onlyIf:{etagMatches:before.etag},httpMetadata:{contentType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}});
  if (!saved) throw new WorkbookConflict('Another workbook change was saved first. Refresh and try again; your draft has been preserved.');
  // An awaited put is necessary, but not sufficient to display a successful save.
  // Independently GET the exact live object and compare its serialized contents.
  const persisted = await readStoredWorkbook(bucket);
  if (persisted.etag !== saved.etag) throw new WorkbookConflict('The workbook changed again while verifying your save. Refresh to inspect the current data.');
  const collection = action.op === 'delete' ? 'deleted' : 'records';
  const actualRow = persisted.data[collection].find((r:any)=>r.values.ID===id);
  const expectedRow = expected[collection].find((r:any)=>r.values.ID===id);
  if (!actualRow || !expectedRow || JSON.stringify(actualRow.values)!==JSON.stringify(expectedRow.values)
      || persisted.bytes.length!==updated.length || persisted.bytes.some((b,i)=>b!==updated[i])
      || (action.op==='delete' && persisted.data.records.some((r:any)=>r.values.ID===id))
      || (action.op==='restore' && persisted.data.deleted.some((r:any)=>r.values.ID===id))) {
    throw Error('The R2 workbook could not be verified after writing. Refresh to inspect storage; no successful save has been confirmed.');
  }
  return {...persisted.data,version:persisted.etag,sync:{mode:'persistent-workbook',automatic:true,storage:persisted.storage},receipt:{operation:action.op,id,verified:true,beforeEtag:before.etag,...persisted.storage}};
}
