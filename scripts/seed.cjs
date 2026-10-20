const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding features and initial data...");

  const features = [
    // 1. 招聘与配置
    {
      code: "REC_RESUME_EVAL",
      title: "简历批量初筛与匹配评分",
      description: "拖拽多份简历自动解析打分，对比目标岗位胜任力输出多维度雷达与优缺点报告。",
      category: "RECRUITMENT",
      status: "AUTOMATED",
      efficiency: "耗时减少 85%",
      roleTags: JSON.stringify(["RECRUITER", "HRBP", "HRD"]),
      order: 1,
    },
    {
      code: "REC_JD_GENERATOR",
      title: "智能 JD 编写与市场对标",
      description: "输入基础职责与职级，智能生成符合劳动合规要求与市场竞争力的结构化 JD。",
      category: "RECRUITMENT",
      status: "HIGH_EFFICIENCY",
      efficiency: "撰写提效 80%",
      roleTags: JSON.stringify(["RECRUITER", "HRBP"]),
      order: 2,
    },
    {
      code: "REC_INTERVIEW_PREP",
      title: "针对性面试提问生成器",
      description: "结合候选人履历疑点与能力短板，自动生成 STAR 行为面试题与考察标准。",
      category: "RECRUITMENT",
      status: "HIGH_EFFICIENCY",
      efficiency: "准备提效 70%",
      roleTags: JSON.stringify(["RECRUITER", "HRBP"]),
      order: 3,
    },
    {
      code: "REC_OFFER_GENERATOR",
      title: "智能 Offer 与录用审批",
      description: "录用参数一键装配，自动化校验薪酬职级并生成标准 Offer 文书与入职通知。",
      category: "RECRUITMENT",
      status: "AUTOMATED",
      efficiency: "流程耗时降低 90%",
      roleTags: JSON.stringify(["RECRUITER", "SSC"]),
      order: 4,
    },

    // 2. 培训与人才发展
    {
      code: "TRN_COURSE_OUTLINE",
      title: "微课培训大纲与题库生成",
      description: "输入业务赋能目标，自动输出内训课程模块大纲及考核配套选择题。",
      category: "TRAINING",
      status: "ON_THE_WAY",
      efficiency: "备课提效 60%",
      roleTags: JSON.stringify(["HRBP", "HRD"]),
      order: 5,
    },
    {
      code: "TRN_SKILL_GRAPH",
      title: "员工技能图谱与学习路径推荐",
      description: "基于岗位胜任力差距，自动规划员工个性化成长路径与课程包。",
      category: "TRAINING",
      status: "ON_THE_WAY",
      efficiency: "规划提效 50%",
      roleTags: JSON.stringify(["HRBP", "HRD"]),
      order: 6,
    },

    // 3. 绩效管理
    {
      code: "PERF_OKR_ASSISTANT",
      title: "绩效目标 (OKR/KPI) 规范改写",
      description: "AI 审查目标是否符合 SMART 原则，提供表述润色与关键结果量化建议。",
      category: "PERFORMANCE",
      status: "ON_THE_WAY",
      efficiency: "沟通提效 40%",
      roleTags: JSON.stringify(["HRBP", "HRD"]),
      order: 7,
    },
    {
      code: "PERF_FEEDBACK_COACH",
      title: "360 评价语气润色与面谈话术建议",
      description: "消除评价中的情绪化偏见，生成建设性绩效面谈脚本与改进指导。",
      category: "PERFORMANCE",
      status: "ON_THE_WAY",
      efficiency: "面谈提效 50%",
      roleTags: JSON.stringify(["HRBP"]),
      order: 8,
    },

    // 4. 薪酬与福利
    {
      code: "COMP_ANOMALY_DETECTOR",
      title: "算薪突变检测与智能考勤对账",
      description: "跨月薪酬对比与考勤异常自动对账，对大幅波动与潜在合规风险进行标红预警。",
      category: "COMPENSATION",
      status: "ON_THE_WAY",
      efficiency: "对账提效 70%",
      roleTags: JSON.stringify(["CB_SPECIALIST", "HRD"]),
      order: 9,
    },
    {
      code: "COMP_SALARY_BENCHMARK",
      title: "外部薪酬调研比对与调薪模拟",
      description: "聚合行业薪酬分位数据（P50/P75/P90），测算调薪包预算与人均成本支出。",
      category: "COMPENSATION",
      status: "ON_THE_WAY",
      efficiency: "测算提效 65%",
      roleTags: JSON.stringify(["CB_SPECIALIST", "HRD"]),
      order: 10,
    },

    // 5. 员工关系与运营
    {
      code: "REL_POLICY_BOT",
      title: "HR 政策与员工服务智能问答",
      description: "基于公司规章制度知识库，7x24h 自动化解答年假、报销、社保公积金等高频咨询。",
      category: "RELATIONS",
      status: "ON_THE_WAY",
      efficiency: "答疑减负 80%",
      roleTags: JSON.stringify(["SSC", "HRBP"]),
      order: 11,
    },
    {
      code: "REL_DOC_OCR_AUDIT",
      title: "入职/转正材料 OCR 结构化初审",
      description: "身份证、学历证、离职证明等材料图片自动验真提取并校对入档。",
      category: "RELATIONS",
      status: "ON_THE_WAY",
      efficiency: "审核提效 85%",
      roleTags: JSON.stringify(["SSC"]),
      order: 12,
    },

    // 6. 组织发展与人才盘点
    {
      code: "OD_TALENT_9GRID",
      title: "人才九宫格自动生成与画像标签",
      description: "自动聚合业绩与潜能测评数据，绘制部门九宫格分布并标注高潜与继任梯队。",
      category: "ANALYTICS",
      status: "ON_THE_WAY",
      efficiency: "盘点提效 50%",
      roleTags: JSON.stringify(["HRD", "HRBP"]),
      order: 13,
    },
  ];

  for (const item of features) {
    await prisma.featureItem.upsert({
      where: { code: item.code },
      update: item,
      create: item,
    });
  }

  // 初始化推送配置
  await prisma.notificationConfig.upsert({
    where: { channel: "WEBHOOK" },
    update: {},
    create: {
      channel: "WEBHOOK",
      settingsJson: JSON.stringify({
        url: "",
        secret: "",
        serviceType: "FEISHU",
      }),
      isEnabled: false,
      triggerEvents: "COMPLETED,FAILED",
    },
  });

  await prisma.notificationConfig.upsert({
    where: { channel: "SMTP" },
    update: {},
    create: {
      channel: "SMTP",
      settingsJson: JSON.stringify({
        host: "smtp.example.com",
        port: 465,
        secure: true,
        user: "hr-notify@example.com",
        pass: "",
        from: "HR Workstation <hr-notify@example.com>",
        to: "recruiter@example.com",
      }),
      isEnabled: false,
      triggerEvents: "COMPLETED,FAILED",
    },
  });

  console.log("Database seeded successfully via seed.cjs!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
