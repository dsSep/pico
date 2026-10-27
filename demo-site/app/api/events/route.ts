import {env} from 'cloudflare:workers';
import {validateEvent} from '../../../lib/contracts.mjs';
export async function POST(request:Request){
 const origin=request.headers.get('origin');
 if(origin!==new URL(request.url).origin)return new Response('Forbidden',{status:403});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return new Response('JSON required',{status:415});
 const reader=request.body?.getReader();let size=0;const chunks:Uint8Array[]=[];
 if(!reader)return new Response('Invalid event',{status:400});
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>1024){await reader.cancel();return new Response('Too large',{status:413});}chunks.push(value);}
 let data;try{const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}data=validateEvent(JSON.parse(new TextDecoder().decode(bytes)));}catch{return new Response('Invalid JSON',{status:400});}
 if(!data)return new Response('Invalid event',{status:400});
 if(!env.DB)return new Response('Analytics unavailable',{status:503});
 try{
 const now=Date.now();
 // Insert and quota check are one atomic SQLite statement; no read/write race.
 const result=await env.DB.prepare(`INSERT INTO demo_events SELECT ?,?,?,?,?,?,?,?,? WHERE (SELECT count(*) FROM demo_events WHERE session_id=? AND created_at>?)<30 AND (SELECT count(*) FROM demo_events WHERE created_at>?)<1000`).bind(crypto.randomUUID(),data.session_id,data.event_type,data.scenario_id,data.run_id,'replay',data.event_type,data.duration_ms,now,data.session_id,now-60000,now-60000).run();
 if(!result.meta.changes)return new Response('Rate limit reached',{status:429});
 await env.DB.prepare('DELETE FROM demo_events WHERE created_at < ?').bind(now-30*86400000).run();
 return new Response(null,{status:204});
 }catch{return new Response('Analytics unavailable',{status:503});}
}
