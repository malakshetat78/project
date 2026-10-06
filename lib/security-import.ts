import { readBook } from './workbook.ts';
import { readStoredWorkbook,WorkbookConflict } from './persistence.ts';
import { REQUIREMENT_SETS } from './requirement-sets.ts';
// Approved attachment fingerprint: payload stays outside source code and deployment archives.
export const SECURITY_IMPORT_SHA256='6e22e19182c9765503a6874a538f59bb4e99436ef070bfe9a6a697f9eddbb6da';
export async function importSecurityWorkbook(bucket:any,bytes:Uint8Array){
 const digest=await crypto.subtle.digest('SHA-256',new Uint8Array(bytes).buffer);
 const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
 if(hash!==SECURITY_IMPORT_SHA256)throw Error('Select the provided ICVSP_Security_V-Cycle(2).xlsx file. No existing workbook has been changed.');
 const book=readBook(bytes);
 if(book.sheets.length!==10||book.columns.length!==14||book.records.length!==37)throw Error('The Security workbook structure does not match the inspected source.');
 const key=REQUIREMENT_SETS.security.key;
 if(await bucket.get(key))throw new WorkbookConflict('Security Requirements are already imported. Existing data will not be overwritten.');
 const saved=await bucket.put(key,bytes,{onlyIf:{etagDoesNotMatch:'*'},httpMetadata:{contentType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}});
 if(!saved)throw new WorkbookConflict('Security Requirements were imported by another session. Refresh to load them.');
 const persisted=await readStoredWorkbook(bucket,'security');
 if(persisted.storage.sha256!==hash||persisted.etag!==saved.etag)throw Error('The imported R2 workbook could not be verified. Refresh to inspect storage.');
 return {...persisted.data,version:persisted.etag,receipt:{operation:'import',verified:true,id:'37 Security Requirements',...persisted.storage},sync:{automatic:true,mode:'persistent-workbook',storage:persisted.storage}};
}
