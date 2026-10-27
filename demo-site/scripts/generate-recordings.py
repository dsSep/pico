"""Run the real Pico harness with scripted test-model decisions; export no private runs."""
import json
import sys
import tempfile
import subprocess
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from pico import Pico, FakeModelClient, SessionStore, WorkspaceContext

def tool(name, **args):
    return '<tool>' + json.dumps({'name': name, 'args': args}) + '</tool>'

scenarios = [
 ('inspect', 'Repository Inspection', 'Map a small repository and explain its entry point.', [tool('list_files'), tool('read_file',path='README.md'), tool('read_file',path='calculator.py'), '<final>This fixture contains a calculator module and a regression test. calculator.py exposes add(a, b). The harness listed the workspace and read both files before returning this scripted conclusion.</final>'], False),
 ('tests', 'Test Failure Investigation', 'Inspect the failing test and propose a minimal fix.', [tool('read_file',path='failure.txt'),tool('read_file',path='calculator.py'),tool('read_file',path='test_calculator.py'),'<final>The recorded assertion expects add(2, 3) == 5, but calculator.py returns a - b. Proposed fix: return a + b. This read-only investigation does not apply or verify the change. failure.txt is an explicitly supplied test fixture, not a shell execution result.</final>'], False),
 ('permissions', 'Permission & Failure Handling', 'Try a write in read-only mode, then inspect an unavailable file.', [tool('write_file',path='calculator.py',content='blocked'),tool('read_file',path='missing.py'),'<final>The harness denied write_file in read-only mode and returned a validation error for missing.py. The original file remains unchanged. Tool errors are observations: the scripted model can still return a final answer.</final>'], True),
]
rows=[]
temp_root=Path(__file__).resolve().parents[1]/'.sites-runtime/fixtures'
temp_root.mkdir(parents=True,exist_ok=True)
for sid,title,prompt,outputs,readonly in scenarios:
    with tempfile.TemporaryDirectory(prefix='pico-demo-',dir=temp_root) as directory:
        root=Path(directory)
        # Prefix refresh re-detects Git roots: make this a real isolated fixture repo.
        subprocess.run(['git','init','--quiet',str(root)],check=True)
        files={'README.md':'# Calculator fixture\nA tiny repository for inspecting the Pico harness.\n','calculator.py':'def add(a, b):\n    return a - b\n','test_calculator.py':'from calculator import add\n\ndef test_add():\n    assert add(2, 3) == 5\n','failure.txt':'TEST FIXTURE: illustrative assertion output\nassert add(2, 3) == 5\nE assert -1 == 5\n'}
        for name,content in files.items(): (root/name).write_text(content,encoding='utf-8')
        workspace=WorkspaceContext.build(root,repo_root_override=root)
        workspace.status='clean fixture'
        workspace.recent_commits=[]
        agent=Pico(FakeModelClient(outputs),workspace,SessionStore(root/'.pico/sessions'),approval_policy='never',read_only=readonly,max_steps=6)
        answer=agent.ask(prompt)
        run=agent.current_run_dir
        def clean(value):
            if isinstance(value,dict): return {k:clean(v) for k,v in value.items()}
            if isinstance(value,list): return [clean(v) for v in value]
            if isinstance(value,str): return value.replace(str(root),'/fixture').replace(str(root).replace('\\','/'),'/fixture')
            return value
        events=[clean(json.loads(line)) for line in (run/'trace.jsonl').read_text().splitlines()]
        rows.append({'id':sid,'title':title,'prompt':prompt,'mode':'Test Fixture / Recorded Run','provenance':'Existing Pico runtime + FakeModelClient; scripted decisions, real tool validation/execution. No live LLM.','files':files,'events':events,'report':clean(json.loads((run/'report.json').read_text())),'state':clean(json.loads((run/'task_state.json').read_text())),'answer':answer})
target=Path(__file__).resolve().parents[1]/'data/recordings.json'
target.parent.mkdir(exist_ok=True)
target.write_text(json.dumps(rows,indent=2),encoding='utf-8')
print('Exported three sanitized fixture recordings:',target)
