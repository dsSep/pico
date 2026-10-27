# Pico 在线演示示例

**[打开中文在线 Demo](https://pico-agent-playground.foggygem1024.chatgpt.site)**

无需安装、无需 API Key。进入“交互体验”，选择左侧场景，再点击“开始演示”；也可以用“下一步”逐个查看事件。点击工具记录展开参数和结果，使用“展开完整运行记录”定位事件，“重置”可重新体验。

## 1. 仓库结构分析

示例请求：梳理示例仓库的文件结构，并说明代码入口。

实际记录的工具顺序：`list_files` → `read_file(README.md)` → `read_file(calculator.py)`。观察右侧执行循环高亮，从模型决策进入工具执行，再把结果反馈给模型。最终说明由预设测试模型给出。

## 2. 测试失败排查

示例请求：查看失败记录和相关代码，提出最小修复建议。

示例代码故意保留一个错误：

```python
def add(a, b):
    return a - b
```

测试夹具要求 `add(2, 3) == 5`。演示依次读取 `failure.txt`、`calculator.py` 和测试文件，提出将减法改为加法的建议。这里没有应用修改，也没有执行测试验证；`failure.txt` 是明确标注的说明性测试夹具。

`workspace/` 保存对应示例文件。`test_calculator.py.example` 使用 `.example` 后缀，避免被项目测试自动发现；演示工作区中原名为 `test_calculator.py`。

## 3. 权限与失败处理

示例请求：尝试在只读模式下写入文件，再读取一个不存在的文件。

Pico 拒绝 `write_file`，返回 `approval_denied` / `read_only_block`；随后对 `missing.py` 返回 `invalid_arguments`。工具错误是反馈，模型仍可给出最终说明，因此整次运行的 `completed` 不等于每个工具都成功。

实际事件节选见 [permission-trace.jsonl](permission-trace.jsonl)，完整三个场景的事件、报告和任务状态见 [recordings.json](../../demo-site/data/recordings.json)。这些都是可公开的合成示例，不含个人会话、真实仓库代码或凭据。

## 回放与实时执行

本网站复用 Pico 生成的记录，前端可播放、暂停、单步和检查原始数据；不会实时调用模型或在服务器执行访客输入。模型决策由 `FakeModelClient` 预设，不能据此推断真实模型成功率或性能。

网站源码位于 [demo-site](../../demo-site/)，记录生成脚本为 [generate-recordings.py](../../demo-site/scripts/generate-recordings.py)。本地重新生成时使用当前仓库的 Pico 运行时，记录时间和细节会随版本变化；托管版本的固定回放不受影响。
