export function validateEvent(v){
 const allowed=['scenario_id','event_type','session_id','run_id','duration_ms'];
 if(!v||typeof v!=='object'||Object.keys(v).some(k=>!allowed.includes(k)))return null;
 if(!['inspect','tests','permissions'].includes(v.scenario_id)||!['started','completed','aborted'].includes(v.event_type))return null;
 if(![v.session_id,v.run_id].every(x=>typeof x==='string'&&/^[a-zA-Z0-9-]{36}$/.test(x)))return null;
 if(!Number.isInteger(v.duration_ms)||v.duration_ms<0||v.duration_ms>3600000)return null;
 return v;
}
export function nodeForEvent(e,previous=[]){
 if(e.event==='run_finished')return 'Final result';
 if(e.event==='model_parsed')return e.kind==='tool'?'Tool decision':'Model';
 if(e.event==='model_requested')return e.tool_steps>0?'Model continuation':'Model';
 if(e.event==='prompt_built')return previous.some(x=>x.event==='tool_executed')?'Model continuation':'Model';
 if(e.event==='tool_executed')return e.tool_error_code==='approval_denied'||e.security_event_type?'Permission check':'Tool execution';
 if(e.event==='checkpoint_created')return 'Observation';
 if(e.event==='run_started')return 'User request';
 return 'Pico harness';
}
