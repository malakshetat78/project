import { env } from 'cloudflare:workers';
import { readStoredWorkbook } from '../../lib/persistence';

const escape=(s:any)=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
// A read-only evidence page: no put(), changeBook(), export, or client state.
export async function GET(request:Request) {
  try {
    const c=await readStoredWorkbook((env as any).BUCKET);
    const id=new URL(request.url).searchParams.get('id')??'';
    const active=c.data.records.find((r:any)=>r.values.ID===id);
    const deleted=c.data.deleted.find((r:any)=>r.values.ID===id);
    const evidence={...c.storage,activeCount:c.data.records.length,deletedCount:c.data.deleted.length,sheets:c.data.sheets.length,fields:c.data.columns.length,id,state:active?'Active':deleted?'Recycle Bin':'Not found',requirement:active?.values??deleted?.values??null};
    return new Response('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Live R2 workbook verification</title></head><body style="font:16px system-ui;color:#14233d;background:#f5f7fb;padding:32px;max-width:1000px;margin:auto"><a href="/">Back to requirements</a><h1>Live R2 workbook verification</h1><p>This page independently reads the exact stored workbook. It does not save or export a file.</p><form><label>Requirement ID <input name="id" value="'+escape(id)+'"></label> <button>Read live workbook</button></form><h2>'+escape(id)+' — '+escape(evidence.state)+'</h2><pre style="background:white;border:1px solid #ccd5e3;border-radius:8px;padding:20px;white-space:pre-wrap;overflow-wrap:anywhere">'+escape(JSON.stringify(evidence,null,2))+'</pre></body></html>',{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store, max-age=0','CDN-Cache-Control':'no-store','Cloudflare-CDN-Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'"}});
  } catch(e) { return new Response('Live storage read failed: '+(e as Error).message,{status:503,headers:{'Cache-Control':'no-store'}}); }
}
