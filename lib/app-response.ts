// Workbook responses already bypass caches. Also prevent stale app HTML after a release.
export function appResponse(request:Request,response:Response){
 if(new URL(request.url).pathname!=='/')return response;
 const headers=new Headers(response.headers);
 for(const key of ['Cache-Control','CDN-Cache-Control','Cloudflare-CDN-Cache-Control'])headers.set(key,'no-store, max-age=0');
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
