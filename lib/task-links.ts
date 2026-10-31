import {requirementReferences} from './traceability.ts';
// These are literal source references, including targets absent from current workbooks.
// A missing reference remains visible but never creates a requirement or a target record.
export function taskRequirementLinks(task:any){const explicit=task.links??[];const recorded=requirementReferences(['Task','Notes'].map(k=>String(task.values?.[k]??'')).join('\n')).map(id=>({set:(id.includes('-SEC-')||id.startsWith('SEC-EXT-'))?'security':'icvsp',id,recorded:true}));return [...explicit,...recorded.filter(r=>!explicit.some((e:any)=>e.set===r.set&&e.id===r.id))];}
