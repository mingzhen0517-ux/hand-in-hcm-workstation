# Hand-in HCM Workstation (AI 赋能人力资源智能工作台)

新一代微内核、可扩展的企业级 HCM（人力资源）智能工作台。支持招聘、培训、绩效、薪酬、员工关系及人才盘点六大人事业务场景。

- 🌐 **Cloudflare + Turso 演示版**：用户可直接在线访问体验各功能模块与预置大模型 AI 评估。
- 💻 **本地私有化部署版**：用户可将系统一键运行在本地，使用自有的大模型 API Key（OpenAI / DeepSeek / 通义千问等），数据 100% 留存在本地 SQLite，确保企业人事数据安全与隐私。

---

## 架构特性

1. **双模数据库适配器**：
   - **本地环境**：零配置使用标准 SQLite 文件数据库（`prisma/dev.db`），开箱即用。
   - **云端环境**：原生支持通过 `@prisma/adapter-libsql` 连接 **[Turso.tech](https://turso.tech/)** 分布式 libSQL 数据库，完美契合 Cloudflare Pages / Workers 边缘运行。
2. **大模型智能调用与优雅降级**：
   - 配置了 `OPENAI_API_KEY` 时，实时调用大模型生成岗位 JD、结构化简历评分、STAR 原则面试题与合规 Offer；
   - 未配置 API Key 时，内建高拟真专家级 Mock 响应引擎，保障线上 Demo 零报错顺畅演示。
3. **轻量纯粹**：基于 Next.js 16 (App Router) + React 19 + Tailwind CSS + Prisma 5 构建。

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

# 填入您自己的大模型 API Key (如 OpenAI / DeepSeek 等)
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

## 二、部署到 Cloudflare + Turso (在线 Demo 方案)

### 步骤 1：在 Turso 创建云端数据库
1. 前往 [Turso.tech](https://turso.tech) 注册账号并安装 Turso CLI（或在 Web 控制台操作）：
   ```bash
   turso db create hcm-workstation
   turso db show hcm-workstation --url
   turso db tokens create hcm-workstation
   ```
2. 记录得到的：
   - 数据库 URL，例如：`libsql://hcm-workstation-yourname.turso.io`
   - 认证 Token，例如：`eyJhbGciOi...`

### 步骤 2：向 Turso 推送表结构并预填数据
在本地临时指定环境变量，直接将数据结构和 Demo 演示数据推送到 Turso：
```bash
DATABASE_URL="libsql://hcm-workstation-yourname.turso.io?authToken=YOUR_TOKEN" npm run db:push
TURSO_DATABASE_URL="libsql://hcm-workstation-yourname.turso.io" TURSO_AUTH_TOKEN="YOUR_TOKEN" npm run seed
```

### 步骤 3：部署到 Cloudflare Pages
1. 将本项目推送到您个人的 GitHub / GitLab 仓库。
2. 登录 **Cloudflare 控制台** -> **Compute (Workers & Pages)** -> **Create application** -> **Pages** -> **Connect to Git**。
3. 选取本仓库，构建配置填写如下：
   - **Framework preset**: `Next.js`
   - **Build command**: `npx @cloudflare/next-on-pages` (或 `npm run build`)
   - **Build output directory**: `.vercel/output/static` (或根据 Pages 提示)
4. 在 **Environment Variables（环境变量）** 中添加：
   - `TURSO_DATABASE_URL` = `libsql://hcm-workstation-yourname.turso.io`
   - `TURSO_AUTH_TOKEN` = `YOUR_TURSO_TOKEN`
   - `OPENAI_API_KEY` = `sk-demo-key`（若 demo 希望共享一个限额 key 或留空使用内置 mock 引擎）
   - `OPENAI_BASE_URL` = `https://api.openai.com/v1`
   - `OPENAI_MODEL` = `gpt-4o`
5. 点击 **Save and Deploy**，即可获得专属的 Cloudflare 在线演示域名（如 `https://hand-in-hcm.pages.dev`）。

---

## 三、常用 Scripts 指令
- `npm run dev`：启动本地开发服务器
- `npm run build`：生产环境打包
- `npm run db:push`：将 schema 变更同步到数据库（SQLite 或 Turso）
- `npm run seed`：预填 HR 业务清单、候选人及初筛评测数据
