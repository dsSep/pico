// Presentation translations only. Original recordings and event identifiers stay intact.
export const labels = {
 Overview:'项目概览',Playground:'交互体验',Architecture:'系统架构',Observability:'运行观测',
 'User request':'用户请求','Pico harness':'Pico 执行框架',Model:'模型',
 'Tool decision':'工具决策','Permission check':'权限检查','Tool execution':'工具执行',
 Observation:'结果反馈','Model continuation':'模型继续执行','Final result':'最终结果',
 run_started:'运行开始',prompt_built:'构建上下文',model_requested:'请求模型',
 model_parsed:'解析模型响应',tool_executed:'工具调用结束',checkpoint_created:'保存检查点',run_finished:'运行结束',
 completed:'已完成',running:'运行中',stopped:'已停止',failed:'失败',
 final_answer_returned:'返回最终答案',step_limit_reached:'达到步骤上限',retry_limit_reached:'达到重试上限',
 approval_denied:'权限拒绝',invalid_arguments:'参数校验失败',read_only_block:'只读模式拦截',
};
export function zh(value){return labels[value]||value;}
export const scenarioText={
 inspect:{title:'仓库结构分析',prompt:'梳理示例仓库的文件结构，并说明代码入口。',answer:'这个示例仓库包含计算器模块和回归测试。calculator.py 提供 add(a, b) 函数。Pico 执行框架先列出工作区文件，再读取 README.md 和源代码，最后返回这段由测试模型预设的总结。'},
 tests:{title:'测试失败排查',prompt:'查看失败记录和相关代码，提出最小修复建议。',answer:'记录中的断言要求 add(2, 3) 等于 5，但 calculator.py 实际执行的是 a - b。建议将其改为 return a + b。本次是只读排查，没有应用修复，也没有运行测试验证。failure.txt 是明确标注的测试夹具，并非本次执行 Shell 产生的输出。'},
 permissions:{title:'权限与失败处理',prompt:'尝试在只读模式下写入文件，再读取一个不存在的文件。',answer:'Pico 执行框架在只读模式下拒绝了 write_file，并对不存在的 missing.py 返回参数校验错误。原始文件保持不变。工具错误会作为反馈交给模型，因此预设的测试模型仍可给出最终说明。'},
};
