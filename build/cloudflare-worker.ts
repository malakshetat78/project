// Same Vinext application and API, without Sites connector/auth middleware.
import handler from 'vinext/server/fetch-handler';
import {appResponse} from '../lib/app-response';
export default {async fetch(request:Request,env:any,ctx:any){return appResponse(request,await handler.fetch(request,env,ctx));}};
