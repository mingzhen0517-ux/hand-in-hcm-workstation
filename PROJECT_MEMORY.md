# HR Workstation - Project Memory (项目持续演进与上下文记忆)

> 本文件为项目的唯一可信上下文来源 (Single Source of Truth)。为确保后续 AI 及开发人员始终拥有干净、高信噪比的上下文，遵循**“增量追加，废弃立即剔除”**原则，严禁在本文档堆积过期废弃逻辑与临时草稿。

---

## 1. 架构与技术底座 (Active Architecture)
- **前端与全栈运行时**：Next.js (App Router) + React + TypeScript + Tailwind CSS (v4) + Lucide Icons。
- **微内核与 Agent 插件机制 (Plugin Architecture)**：
  - 核心定义位于 `src/types/agent.ts`（统一 `AgentPlugin<TInput, TOutput>` 规范）。
  - 所有具体 Agent 物理隔离在 `src/features/<category>/agents/<agent_name>/`。
  - 全局由 `src/features/registry.ts` 集中注册，支持零副作用拔插与增量添加。
- **数据引擎与高并发保障**：
  - Prisma ORM + 本地 SQLite (`prisma/schema.prisma`)。
  - **默认启用 SQLite WAL 模式 (Write-Ahead Logging)**，杜绝后台批处理高频写入与前台需求投票埋点时的写锁争用。
- **后台异步任务与状态机 (Task Runner)**：
  - 任务入库持久化 (`AutomationTask` 表)：`PENDING` -> `RUNNING` -> `SUCCESS` / `FAILED`。
  - 执行进度实时更新，通过 `/automation` 面板实时轮询展示，任务完成/失败自动触发通知。
- **多通道通知推送中心 (Notification Hub)**：
  - 封装在 `src/services/notification.ts`。
  - 支持 **企业微信/飞书/钉钉 Webhook** 与 **标准 SMTP 邮件**，支持测试联通与任务完成/失败自动化触发。
- **数据集成与落库 (Data Hub)**：
  - 本地文件上传解析：支持 Excel (`.xlsx`, `.xls`) 与 CSV 自动提取表头落库 `Candidate` 表。
  - 外部 API 同步连接器：支持配置外部 HCM/OA Endpoint，批量拉取外部花名册并持久化。

---

## 2. 状态视觉分级与导引规范 (Color & Status Guidelines)
- 🟢 **`AUTOMATED` (已上线·全自动化)**：
  - 视觉：翡翠绿 (Emerald)。
  - 特征：支持后台一键托管批处理、实时任务进度追踪与任务完成自动推送。
- 🟣 **`HIGH_EFFICIENCY` (已上线·高提效)**：
  - 视觉：紫罗兰/靛蓝 (Indigo/Violet)。
  - 特征：聚焦关键业务人机协同，提供高质量即时产出（提效 70%~80%）。
- ⚪ **`ON_THE_WAY` (规划中)**：
  - 视觉：中性冷灰 (Slate)。
  - 特征：点击弹出需求收集弹窗，向 `FeatureRequestLog` 数据库落库记录 HR 角色与期待，驱动功能热度排行榜。

---

## 3. 当前已上线 Agent 插件全量注册清单 (Active Agents)
| Agent Code | 插件目录 | 业务分类 | 状态类型 | 核心价值与输出 |
| :--- | :--- | :--- | :--- | :--- |
| `REC_RESUME_EVAL` | `src/features/recruitment/agents/resume-eval` | 招聘与配置 | 🟢 `AUTOMATED` | 批量简历初筛、0-100分胜任力打分、优劣势诊断、追问重点并落库 |
| `REC_JD_GENERATOR` | `src/features/recruitment/agents/jd` | 招聘与配置 | 🟣 `HIGH_EFFICIENCY` | 岗位职责与任职资格说明书(JD)市场对标智能编写 |
| `REC_INTERVIEW_PREP` | `src/features/recruitment/agents/interview` | 招聘与配置 | 🟣 `HIGH_EFFICIENCY` | 基于 STAR 原则的针对性行为面试题库与判别标尺 |
| `REC_OFFER_GENERATOR` | `src/features/recruitment/agents/offer` | 招聘与配置 | 🟢 `AUTOMATED` | 规范正式 Offer Letter、短信通知简讯与内部审批卡 |

---

## 4. 后续开发与改善规范 (Guidelines for Future Extension)
1. **新增功能的标准流程**：
   - 确定所属大类（如 `TRAINING`, `PERFORMANCE`, `COMPENSATION` 等）。
   - 在 `src/features/<category>/agents/<name>/index.ts` 实现 `AgentPlugin` 接口。
   - 在 `src/features/registry.ts` 注册该插件。
   - 在 `scripts/seed.js` 或数据库中将对应功能的 `status` 从 `ON_THE_WAY` 更新为 `AUTOMATED` 或 `HIGH_EFFICIENCY`。
   - 更新本 `PROJECT_MEMORY.md` 的 Active Agents 列表，保持上下文纯净。
2. **废弃或重构规则**：
   - 当重构某个已有功能时，直接在对应独立目录修改或替换，并**立即删除本文档中旧有的过时参数说明**，严禁保留已被废弃的冗余描述。
