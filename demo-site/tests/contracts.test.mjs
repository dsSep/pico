import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateEvent, nodeForEvent} from '../lib/contracts.mjs';
test('reject arbitrary prompts and unbounded events',()=>{
 assert.equal(validateEvent({prompt:'secret'}),null);
 assert.equal(validateEvent({scenario_id:'inspect',event_type:'started',session_id:'a'.repeat(36),run_id:'b'.repeat(36),duration_ms:0,extra:'secret'}),null);
});
test('accept only the minimal event schema',()=>{
 assert.ok(validateEvent({scenario_id:'inspect',event_type:'started',session_id:'a'.repeat(36),run_id:'b'.repeat(36),duration_ms:0}));
});
test('trace nodes follow actual event kinds',()=>{
 assert.equal(nodeForEvent({event:'model_parsed'}),'Model');
 assert.equal(nodeForEvent({event:'model_parsed',kind:'tool'}),'Tool decision');
 assert.equal(nodeForEvent({event:'prompt_built'},[{event:'tool_executed'}]),'Model continuation');
 assert.equal(nodeForEvent({event:'tool_executed',tool_error_code:'approval_denied'}),'Permission check');
 assert.equal(nodeForEvent({event:'run_finished'}),'Final result');
});
