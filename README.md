# HR Workstation (AI Empowered HCM Workspace)

> **Languages**: [中文](#中文) | [English](#english) | [한국어](#한국어) | [日本語](#日本語)

---

<a id="中文"></a>
## 🇨🇳 中文说明

### 1. 项目简介
**HR Workstation** 是专为现代人力资源团队打造的模块化、AI 赋能型工作台。系统支持多角色 HR（招聘顾问、HRBP、SSC、薪酬专家、HRD）视角自由切换，采用微内核与插件化 Agent 架构，将高频高耗时的 HR 流程转化为高效人机协同或全自动无人值守作业。

### 2. 核心视觉引导与状态分级
系统采用直观的视觉颜色分级，帮助 HR 快速发现高价值工具：
- 🟢 **已上线·全自动化 (Automated)**：翡翠绿标识。支持一键后台异步托管运行，并可在监控看板中追踪流转状态。
- 🟣 **已上线·高提效工具 (High Efficiency)**：紫罗兰/靛蓝高亮。聚焦关键业务人机协同，平均提效 70%~85%。
- ⚪ **规划中 (On The Way)**：中性冷灰标识。点击弹窗支持“需求加速投票”，自动落库埋点记录 HR 角色与诉求，驱动后续排期。

### 3. 主要功能模块
- **智能招聘工作中心**：
  - **简历批量初筛与评分**（🟢 自动化）：多简历对比目标岗位 JD 进行 0~100 分能力模型打分，输出优劣势诊断并落库。
  - **智能 JD 编写与市场对标**（🟣 高提效）：输入基础岗位属性，智能生成合规且具有市场竞争力的标准 JD。
  - **针对性行为面试指南**（🟣 高提效）：基于 STAR 原则，根据候选人经历疑点与能力短板生成定制化行为面试题。
  - **智能 Offer 与录用文书装配**（🟢 自动化）：录用薪酬与福利参数一键装配，生成正式 Offer Letter、即时短信与审批卡。
- **自动化监控执行中心**：
  - 实时流转状态机（`PENDING` -> `RUNNING` -> `SUCCESS` / `FAILED`）。
  - 支持执行进度百分比、耗时、异常排查与结构化 JSON 产出钻取。
- **推送通知中心 (Notification Hub)**：
  - 支持 **企业微信/飞书/钉钉 Webhook 机器人** 与 **标准 SMTP 邮件** 服务。
  - 自动化任务完成或异常中断时即时派发通知并记录审计历史。
- **数据集成中心 (Data Hub)**：
  - 支持 Excel (`.xlsx`, `.xls`) 与 CSV 本地花名册解析入库。
  - 外部 HCM / OA 系统 API 同步拉取与持久化。

### 4. 快速开始
```bash
# 1. 安装依赖 (推荐设置淘宝镜像源加速)
npm i

# 2. 初始化数据库与种子数据 (SQLite WAL 并发模式)
npm run seed

# 3. 启动本地开发服务 (默认访问 http://localhost:3000)
npm run dev

# 4. 生产构建打包
npm run build && npm run start
```

---

<a id="english"></a>
## 🇺🇸 English Guide

### 1. Overview
**HR Workstation** is a modular, AI-empowered human capital management (HCM) workspace built for modern HR professionals. It supports role-based views (Recruiters, HRBPs, SSCs, C&B Specialists, HR Directors) and features a microkernel plugin architecture that transforms labor-intensive HR workflows into high-efficiency copilots or unattended automated tasks.

### 2. Visual Status & Guidance System
Features are categorized by efficiency impact and automation readiness:
- 🟢 **Automated (Active)**: Highlighted in Emerald. Supports background async job dispatch with real-time status tracking in the monitor dashboard.
- 🟣 **High Efficiency (Active)**: Highlighted in Violet/Indigo. Accelerates key human-in-the-loop tasks by 70%~85%.
- ⚪ **On The Way (Planned)**: Cool gray badges. Clicking opens a feature demand feedback modal, recording votes in the database to drive the development roadmap.

### 3. Core Modules
- **Talent Acquisition Studio**:
  - **Resume Batch Screening & Scoring** (🟢 Automated): Evaluates resumes against target JDs with 0-100 match ratings, strengths/weaknesses breakdown, and automated profile persistence.
  - **Smart JD Generator** (🟣 High Efficiency): Drafts competitive, compliant job descriptions based on role parameters.
  - **Targeted STAR Interview Guide** (🟣 High Efficiency): Generates behavioral interview questions tailored to each candidate's background gaps.
  - **Smart Offer Suite** (🟢 Automated): Assembles formal offer letters, SMS notifications, and internal approval forms in one click.
- **Automation Execution Monitor**:
  - Real-time job lifecycle state machine (`PENDING` -> `RUNNING` -> `SUCCESS` / `FAILED`).
  - Live progress bars, failure diagnostics, and structured JSON result inspection.
- **Multi-Channel Notification Hub**:
  - Integrates with **Feishu / WeCom / DingTalk Webhooks** and standard **SMTP email**.
  - Sends instant alerts on task completion or failure with audit logs.
- **Data Hub & Ingestion**:
  - Parses and imports local Excel (`.xlsx`, `.xls`) and CSV employee rosters.
  - Pulls and syncs external HCM/OA employee records via scheduled or manual API connectors.

### 4. Quick Start
```bash
# 1. Install dependencies
npm i

# 2. Seed database (SQLite configured with WAL mode)
npm run seed

# 3. Start local development server (open http://localhost:3000)
npm run dev

# 4. Production build
npm run build && npm run start
```

---

<a id="한국어"></a>
## 🇰🇷 한국어 안내

### 1. 프로젝트 개요
**HR Workstation**은 현대 기업의 HR 부서를 위해 설계된 모듈형 AI 기반 인사 업무 통합 플랫폼입니다. 채용 담당자(Recruiter), HRBP, 공유서비스센터(SSC), 보상복리(C&B), HR 총괄(HRD) 등 역할별 맞춤형 화면을 제공하며, 마이크로커널 플러그인 아키텍처를 기반으로 반복적이고 복잡한 HR 프로세스를 고효율 코파일럿 및 완전 자동화 작업으로 전환합니다.

### 2. 시각적 상태 분류 및 가이드 체계
업무 효율화 기여도와 자동화 구현 여부에 따라 색상 라벨로 구분하여 직관적인 사용을 유도합니다:
- 🟢 **출시 완료 · 완전 자동화 (Automated)**: 에메랄드 그린 표시. 백그라운드 비동기 작업으로 즉시 위임 가능하며, 모니터링 화면에서 실시간 진행 상태를 추적합니다.
- 🟣 **출시 완료 · 고효율화 도구 (High Efficiency)**: 인디고/바이올렛 표시. 사람과 AI 협업을 통해 주요 업무 시간을 70%~85% 단축합니다.
- ⚪ **기획 및 준비 중 (On The Way)**: 쿨 그레이 표시. 클릭 시 기능 요구 투표 팝업이 표시되며, 클릭 로그가 데이터베이스에 저장되어 개발 우선순위 결정에 반영됩니다.

### 3. 주요 기능 구성
- **스마트 채용 센터 (Talent Acquisition Studio)**:
  - **이력서 일괄 스크리닝 및 평가** (🟢 자동화): 목표 직무 JD와 비교하여 0~100점 매칭 스코어, 강점/약점 분석 및 맞춤형 면접 질문을 자동 도출하고 DB에 저장합니다.
  - **스마트 직무기술서(JD) 작성** (🟣 고효율): 직급 및 기본 요구사항 입력을 통해 시장 경쟁력과 노동 규정을 충족하는 표준 JD를 생성합니다.
  - **역량 기반 STAR 면접 가이드** (🟣 고효율): 지원자 이력서의 약점 및 검증 포인트를 기반으로 상황별 심층 질문을 설계합니다.
  - **오퍼레터 및 채용 품의 패키지** (🟢 자동화): 채용 조건 입력 한 번으로 공식 오퍼레터, 안내 문자메시지, 사내 승인용 요약 카드를 생성합니다.
- **자동화 모니터링 센터 (Automation Monitor)**:
  - 상태 머신 기반 작업 흐름 추적 (`PENDING` -> `RUNNING` -> `SUCCESS` / `FAILED`).
  - 실시간 진행률, 오류 로그, 생성된 구조화 JSON 데이터 상세 조회 지원.
- **통합 알림 허브 (Notification Hub)**:
  - **표준 SMTP 이메일** 및 **웹훅(Webhook, 라인/슬랙/잔디/팀즈 호환 API)** 연동 지원.
  - 자동화 작업 완료 및 오류 발생 시 즉각적인 알림 전송 및 감사 로그 보관.
- **데이터 통합 허브 (Data Hub)**:
  - 엑셀(`.xlsx`, `.xls`) 및 CSV 직원/지원자 명부 로컬 파일 파싱 및 데이터베이스 저장.
  - 외부 HCM / 그룹웨어 API 연동을 통한 인재 데이터 동기화.

### 4. 실행 가이드
```bash
# 1. 의존성 패키지 설치
npm i

# 2. 데이터베이스 초기화 및 시드 데이터 적재 (SQLite WAL 모드 적용)
npm run seed

# 3. 로컬 개발 서버 실행 (기본 포트: http://localhost:3000)
npm run dev

# 4. 프로덕션 빌드 및 실행
npm run build && npm run start
```

---

<a id="日本語"></a>
## 🇯🇵 日本語ガイド

### 1. プロジェクト概要
**HR Workstation** は、人事プロフェッショナルのために設計されたモジュール型 AI 支援ワークスペースです。採用担当者、HRBP、労務・SSC、人事企画・C&B、人事責任者（HRD）など、役割に応じた視点切り替えに対応しています。マイクロカーネル・プラグイン型 Agent アーキテクチャを採用し、反復的で時間のかかる人事プロセスを高効率な協調作業または完全自動化タスクへと変革します。

### 2. 視覚的ステータス分類と誘導方針
業務効率向上度や自動化の対応状況に応じて、直感的なカラーラベルで分類されています：
- 🟢 **実装完了・完全自動化 (Automated)**：エメラルドグリーン表示。バックグラウンド非同期タスクとして即時実行可能で、監視画面にてステータスを追跡できます。
- 🟣 **実装完了・高効率化ツール (High Efficiency)**：バイオレット／インディゴ表示。人と AI の協調により主要作業時間を 70%〜85% 短縮します。
- ⚪ **開発予定 (On The Way)**：ニュートラルグレー表示。クリック時に機能要望の投票モーダルが表示され、ログがデータベースに保存されて今後の開発優先度の判断材料となります。

### 3. 主な機能モジュール
- **スマート採用スタジオ (Talent Acquisition Studio)**：
  - **履歴書一括スクリーニング・適性採点**（🟢 自動化）：募集要項（JD）と照合して 0〜100 点の適合スコア、強み・弱み分析、質問案を自動生成して保存。
  - **スマート求人票（JD）作成**（🟣 高効率）：職種や基本要件の入力から、法令遵守かつ市場競争力のある求人票を自動生成。
  - **STAR 行動面接ガイド作成**（🟣 高効率）：候補者の経歴や懸念点に合わせ、STAR 原則に基づいた深掘り質問案を設計。
  - **オファーレター・内定通知作成**（🟢 自動化）：処遇条件の入力から、正式な内定通知書（Offer Letter）、案内ショートメッセージ、社内承認用カードをワンクリック作成。
- **自動化監視センター (Automation Monitor)**：
  - タスク状態遷移の可視化（`PENDING` → `RUNNING` → `SUCCESS` / `FAILED`）。
  - リアルタイム進捗率、エラーログ、出力 JSON データの詳細確認。
- **通知ハブ (Notification Hub)**：
  - **SMTP メール送信** および **各種 Webhook** に対応。
  - 自動化タスク完了時または異常発生時に即時通知を行い、送信履歴を保存。
- **データ連携ハブ (Data Hub)**：
  - Excel（`.xlsx`, `.xls`）および CSV 名簿ファイルのローカルインポート・自動抽出。
  - 外部 HCM / 基幹システム API からの従業員データ同期・蓄積。

### 4. クイックスタート
```bash
# 1. パッケージインストール
npm i

# 2. データベースの初期化と初期データ投入 (SQLite WAL モード)
npm run seed

# 3. 開発サーバーの起動 (http://localhost:3000)
npm run dev

# 4. 本番ビルドと起動
npm run build && npm run start
```
