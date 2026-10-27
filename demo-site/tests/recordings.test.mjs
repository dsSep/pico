import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const raw=readFileSync(new URL('../data/recordings.json',import.meta.url),'utf8');
const runs=JSON.parse(raw);
test('three recordings have truthful tool evidence and final reports',()=>{
 assert.equal(runs.length,3);
 for(const r of runs){
  assert.match(r.mode,/Test Fixture/);
  assert.equal(r.events.at(-1).event,'run_finished');
  assert.equal(r.events.at(-1).final_answer,r.answer);
  assert.equal(r.events.filter(e=>e.event==='tool_executed').length,r.state.tool_steps);
 }
 assert.equal(runs[0].events.filter(e=>e.event==='tool_executed'&&e.tool_error_code).length,0);
 assert.equal(runs[1].events.filter(e=>e.event==='tool_executed'&&e.tool_error_code).length,0);
 assert.ok(runs[2].events.some(e=>e.tool_error_code==='approval_denied'));
 assert.ok(runs[2].events.some(e=>e.tool_error_code==='invalid_arguments'));
});
test('export contains no local account paths or private project docs',()=>{
 assert.doesNotMatch(raw,/C:\\\\|PICO_OPENAI_API_KEY|right.codes|pico-demo-/i);
 for(const r of runs)assert.equal(r.files['calculator.py'],'def add(a, b):\n    return a - b\n');
});

