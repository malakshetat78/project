import {getChatGPTUser} from './chatgpt-auth';
// These identity headers are trusted only behind Sites' documented authentication gateway.
// Independent Worker hosting must supply a verified identity provider instead of trusting headers.
export async function projectUser(request:Request){if(!new URL(request.url).hostname.endsWith('.chatgpt.site'))return null;return getChatGPTUser();}
