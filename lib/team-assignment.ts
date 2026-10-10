// Team membership is saved planning data; workbook Lead remains unchanged.
export function resolveTaskTeam(task:any,teams:any[]){
 const explicit=task.extra?.team;
 if(explicit)return {id:teams.some(t=>t.id===explicit)?explicit:'',origin:teams.some(t=>t.id===explicit)?'Explicit task assignment':'Missing assigned team'};
 const lead=String(task.values.Lead??'').trim();
 if(!lead||['TBD','All 6'].includes(lead))return {id:'',origin:'Shared or unset owner'};
 const matches=teams.filter(t=>t.members.includes(lead));
 return matches.length===1?{id:matches[0].id,origin:'Owner membership'}:{id:'',origin:matches.length?'Owner belongs to multiple teams':'Owner has no team'};
}
export function withTeamAssignments(timeline:any,teams:any[]){return {...timeline,tasks:timeline.tasks.map((t:any)=>({...t,teamAssignment:resolveTaskTeam(t,teams)}))};}
