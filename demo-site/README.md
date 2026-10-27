# Pico 中文在线 Demo

**[打开在线体验](https://pico-agent-playground.foggygem1024.chatgpt.site)** · [三个演示场景与操作指南](../examples/online-demo/README.md)

Pico 的浏览器演示站点，使用中文界面。包含项目概览、交互工作台、执行循环可视化、系统架构与运行观测。支持播放、暂停、单步、重置、文件查看、工具参数与结果展开，以及原始 Trace / report / task_state 检查。

## 演示模式

当前为 **测试夹具 / 运行记录回放**。记录由现有 Pico 运行时配合 FakeModelClient 生成：工具校验和执行结果来自实际运行，模型决策与最终说明由脚本预设。前端展示中文释义，原始代码和 Trace 保留原文。

- 仓库结构分析：实际列出和读取示例文件。
- 测试失败排查：读取说明性失败夹具和源码，提出建议，不声称应用修改或通过测试。
- 权限与失败处理：展示真实只读写入拒绝和文件校验错误。

网站不接收自由 Prompt，不调用实时模型，也不提供访客 Shell 或服务器文件访问。现有记录不作为真实模型能力基准。Sites 使用 Cloudflare Workers，不能直接托管这个 Python CLI；未来实时模式需要独立的临时隔离沙箱、资源/费用限制和服务端凭据管理。

## 目录

- `app/`：界面与写入事件的 API。
- `lib/zh.mjs`：中文展示文案；`lib/contracts.mjs`：事件校验与节点映射。
- `data/recordings.json`：已脱敏、可公开的固定回放记录。
- `scripts/generate-recordings.py`：调用父目录 Pico 重新生成夹具记录。
- `db/`、`drizzle/`：D1 数据定义、迁移与所有者查询。
- `tests/`：数据/接口校验。

这是线上版本的源码快照。Sites 保有自己的源码同步仓库；修改 GitHub 文件不会自动部署到 Sites。维护者需要使用 Sites 发布流程更新站点。

## 本地开发与检查

需要 Node.js >=22.13；重新生成记录另需 Python >=3.10。

```bash
cd demo-site
npm ci
npm run dev
```

默认本机预览地址为 `http://127.0.0.1:5173`。播放三个场景不需要数据库、模型 Key 或 Python 后端；事件统计依赖 D1，未初始化时界面会提示统计不可用，回放仍可使用。

```bash
node --test tests/*.test.mjs
npx tsc --noEmit
npm run build
python scripts/generate-recordings.py
```

生成脚本使用当前检出的 Pico 源码，重新生成的时间戳与细节可能不同于托管快照。不要将个人 `.pico/` 运行目录复制到公开数据中。

## Sites 与 D1

保留 `vite.config.ts` 的 Sites 集成。`.openai/hosting.json` 声明 D1 绑定 `DB`；发布通过 Sites 工具进行，不能将 `dist/` 直接作为普通 GitHub Pages 静态页面部署。

初始化 SQL 位于 `drizzle/0000_pink_robbie_robertson.sql`，本地迁移与托管库相互独立，Sites 部署会应用托管迁移。对已应用迁移的修改应使用新的追加迁移。运行 `npm run db:generate` 生成后续变更。

部署构建后可执行本地迁移：

```bash
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_pink_robbie_robertson.sql
node tests/api.integration.mjs
```

## 统计与隐私

流量与访客趋势使用 Sites 原生 Analytics，不重复实现页面访问计数。D1 仅记录用户主动勾选后的匿名演示使用事件：随机页面会话/运行 ID、场景、开始/完成/中止、播放耗时、模式与时间。不保存 Prompt、代码、API Key、IP 或工具输出。ID 在刷新后轮换。

`POST /api/events` 校验来源、字段、请求大小与配额；没有公开的读取 API 或 `/admin`。匿名会话配额不是身份级反滥用机制，公开托管仍依赖平台请求保护。

过期事件在新写入时清理；若要求无访问期间也严格按 30 天删除，所有者需每日运行 `db/operator-queries.sql` 的清理语句。关闭标签页可能使开始事件没有对应结束事件，不能将差值当作失败率。Sites 原生分析属于平台单独的数据处理。

在 Sites 站点设置中查看受限数据库，使用 `db/operator-queries.sql` 查询场景数量和趋势。不要向普通访客开放管理接口。
