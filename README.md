# Hand-in HCM Workstation (AI 赋能人力资源智能工作台)

新一代微内核、可扩展的企业级 HCM（人力资源）智能工作台。支持招聘、培训、绩效、薪酬、员工关系及人才盘点六大人事业务场景。

- 🌐 **Vercel + Turso 云端演示版**：用户可在线直观查看与体验各 HR 功能模块、查看预置候选人测评报告并体验 AI 智能生成。
- 💻 **本地私有化部署版**：用户可将系统一键运行在本地，使用自有的大模型 API Key（OpenAI / DeepSeek / 通义千问等），数据 100% 留存在本地 SQLite，确保企业人事数据绝对私密安全。

---

## 架构特性

1. **双模数据库适配器**：
   - **本地环境**：零配置使用标准 SQLite 文件数据库（`prisma/dev.db`），开箱即用。
   - **云端环境**：原生支持通过 `@prisma/adapter-libsql` 连接 **[Turso.tech](https://turso.tech/)** 分布式 libSQL 数据库，完美契合 Vercel Serverless / Edge 运行环境。
2. **大模型智能调用与优雅降级**：
   - 配置了 `OPENAI_API_KEY` 时，实时调用大模型生成岗位 JD、结构化简历评分、STAR 原则面试题与合规 Offer；
   - 未配置 API Key 时，内建高拟真专家级 Mock 响应引擎，保障线上 Demo 零报错顺畅演示。
3. **原生 Vercel 部署友好**：
   - 标准 Next.js 16 (App Router) + React 19 构建，零 Edge 运行时兼容障碍；
   - 依赖安装阶段配置自动触发 `prisma generate`。

---

## 一、本地私有化部署运行（推荐）

如果您需要将系统运行在本地内部网络，并接入自己企业自有的大模型 API Key：

### 1. 克隆并安装依赖
```bash
git clone https://github.com/mingzhen0517-ux/hand-in-hcm-workstation.git
cd hand-in-hcm-workstation
npm install
```

### 2. 配置环境变量
复制环境变量配置文件：
```bash
cp .env.example .env
```
编辑 `.env`：
```ini
# 本地单机 SQLite 存储路径
DATABASE_URL="file:./dev.db"

# 填入您自己的大模型 API Key (如 OpenAI / DeepSeek / 通义千问等)
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
OPENAI_BASE_URL="https://api.openai.com/v1"
OPENAI_MODEL="gpt-4o"
```

### 3. 初始化本地数据库与预置数据
```bash
npm run db:push
npm run seed
```

### 4. 启动本地开发服务
```bash
npm run dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可开始使用。

---

## 二、部署到 Vercel + Turso (在线 Demo 方案)

### 步骤 1：在 Turso 创建云端数据库并同步数据
1. 访问并登录 [Turso Dashboard](https://turso.tech) 创建数据库（例如 `hand-in-hcm-demo`），获取：
   - **TURSO_DATABASE_URL**（形如 `libsql://hand-in-hcm-demo-xxx.turso.io`）
   - **TURSO_AUTH_TOKEN**（在 Turso 控制台生成获取）
2. 在本地执行一键同步命令（将表结构与演示数据推送到 Turso）：
   ```bash
   npm run turso:push
   npm run seed
   ```

### 步骤 2：在 Vercel 导入并部署
1. 将本地代码推送到您的 GitHub / GitLab 仓库。
2. 打开 [Vercel Dashboard](https://vercel.com/)，点击 **Add New...** -> **Project** -> 选择本仓库。
3. **Build & Development Settings** 保持默认即可（Vercel 会自动识别 Next.js）。
4. 在 **Environment Variables** 添加以下环境变量：
   | 变量名 | 值 | 说明 |
   | :--- | :--- | :--- |
   | `TURSO_DATABASE_URL` | `libsql://your-db.turso.io` | Turso 数据库地址 |
   | `TURSO_AUTH_TOKEN` | `your-turso-token` | Turso 认证 Token |
   | `OPENAI_API_KEY` | `sk-...` | （选填）Demo 体验 Key；留空自动使用内置高拟真 Mock 引擎 |
   | `OPENAI_BASE_URL` | `https://api.openai.com/v1` | （选填）兼容地址 |
   | `OPENAI_MODEL` | `gpt-4o` | （选填）模型名称 |
5. 点击 **Deploy**，约 1 分钟即可部署成功获得线上 Demo 访问链接！

---

## 三、常用 Scripts 指令
- `npm run dev`：启动本地开发服务器
- `npm run build`：生产环境打包验证
- `npm run db:push`：将 schema 变更同步到本地 SQLite
- `npm run turso:push`：将 schema 变更同步到 Turso 云端数据库
- `npm run seed`：预填 HR 业务清单、候选人及初筛评测数据
