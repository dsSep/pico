// Run against a local preview with its D1 migration applied.
import assert from 'node:assert/strict';
const base=process.env.PICO_DEMO_TEST_URL||'http://127.0.0.1:5173';
const session=crypto.randomUUID();
const event={scenario_id:'inspect',event_type:'started',session_id:session,run_id:crypto.randomUUID(),duration_ms:0};
async function send(body=event,headers={}){return fetch(base+'/api/events',{method:'POST',headers:{Origin:base,'Content-Type':'application/json',...headers},body:JSON.stringify(body)});}
assert.equal((await fetch(base)).status,200);
assert.equal((await send()).status,204);
assert.equal((await send(event,{Origin:'https://invalid.example'})).status,403);
assert.equal((await send({...event,prompt:'never store this'})).status,400);
assert.equal((await send({...event,duration_ms:-1})).status,400);
assert.equal((await send({value:'x'.repeat(1500)})).status,413);
assert.equal((await fetch(base+'/api/events')).status,405);
assert.equal((await fetch(base+'/admin')).status,404);
for(let i=0;i<29;i++)assert.equal((await send()).status,204);
assert.equal((await send()).status,429);
console.log('PASS: page, D1 inserts, schema/origin/size checks, write quota, no public read/admin routes');
