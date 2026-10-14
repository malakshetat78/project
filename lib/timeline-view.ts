export const DAY=86400000;
export const dayStamp=(date:string)=>Date.parse(date+'T00:00:00Z');
export const isoDay=(stamp:number)=>new Date(stamp).toISOString().slice(0,10);
export function weekStart(date:string){const d=new Date(dayStamp(date));return isoDay(d.getTime()-((d.getUTCDay()+6)%7)*DAY);}
export function shiftMonth(date:string,n=0){const d=new Date(dayStamp(date));return isoDay(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+n,1));}
export function timelineWindow({tasks,anchor,view,fit,from='',until='',today}:{tasks:any[];anchor:string;view:'week'|'month';fit:boolean;from?:string;until?:string;today:string}){
 const dates=tasks.flatMap(t=>[t.start,t.end]).filter(Boolean).sort();
 let start=fit?(view==='week'?weekStart(dates[0]||today):shiftMonth(dates[0]||today)):(view==='week'?weekStart(anchor):shiftMonth(anchor));
 if(from)start=from;
 let end=fit?isoDay(dayStamp(dates.at(-1)||today)+DAY):view==='week'?isoDay(dayStamp(start)+84*DAY):shiftMonth(start,6);
 if(until)end=isoDay(dayStamp(until)+DAY);
 return {start,end,valid:end>start,days:Math.max(1,Math.round((dayStamp(end)-dayStamp(start))/DAY))};
}
export function timelinePeriods(start:string,end:string,view:'week'|'month'){
 const result:{start:string;end:string;label:string}[]=[];let s=start;
 while(s<end&&result.length<1000){const e=view==='week'?isoDay(dayStamp(s)+7*DAY):shiftMonth(s,1);result.push({start:s,end:e,label:new Date(dayStamp(s)).toLocaleDateString('en-GB',view==='week'?{day:'numeric',month:'short',timeZone:'UTC'}:{month:'short',year:'numeric',timeZone:'UTC'})});s=e;}
 return result;
}
export function taskPriority(task:any){return task.extra?.priority||task.jira?.Priority||'';}
export function milestoneLayout(milestones:any[],start:string,end:string,width:number){
 const days=Math.max(1,(dayStamp(end)-dayStamp(start))/DAY),lanes:number[]=[];
 const entries=milestones.map((m,index)=>({m,index,date:/^\d{5}$/.test(m['Date / Window'])?isoDay(Date.UTC(1899,11,30)+Number(m['Date / Window'])*DAY):''})).filter(n=>n.date&&n.date>=start&&n.date<end).sort((a,b)=>a.date.localeCompare(b.date));
 const markers=entries.map(n=>{const x=(dayStamp(n.date)-dayStamp(start))/DAY/days*width;const labelWidth=Math.min(190,width-x,Math.max(80,String(n.m['Milestone / Decision']).length*5.3+18));let lane=lanes.findIndex(last=>last+8<=x);if(lane<0)lane=lanes.length;lanes[lane]=x+labelWidth;return {...n,x,width:labelWidth,lane};});
 return {markers,height:Math.max(65,lanes.length*21+23)};
}
