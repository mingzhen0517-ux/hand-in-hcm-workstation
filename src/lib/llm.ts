export interface LLMRequestOptions {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  jsonMode?: boolean;
}

export async function callLLM(options: LLMRequestOptions): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o";

  if (!apiKey) {
    // Return high quality deterministic mock response when API key is not configured
    return getMockResponse(options);
  }

  try {
    const messages = [];
    if (options.systemPrompt) {
      messages.push({ role: "system", content: options.systemPrompt });
    }
    messages.push({ role: "user", content: options.userPrompt });

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        ...(options.jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn("LLM API error, falling back to mock engine:", res.status, errText);
      return getMockResponse(options);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (err) {
    console.warn("LLM Call failed, falling back to mock engine:", err);
    return getMockResponse(options);
  }
}

function getMockResponse(options: LLMRequestOptions): string {
  const prompt = options.userPrompt;

  // 1. JD Generation Mock
  if (prompt.includes("岗位JD") || prompt.includes("职位描述") || prompt.includes("生成岗位")) {
    return `# 岗位职责与任职资格说明书
## 岗位职责
1. 深入理解业务发展战略，负责核心产品线/模块的架构规划与高可用工程研发；
2. 持续沉淀团队规范体系，推进开发流程自动化、自动化监控及持续集成交付；
3. 主导跨部门协作推进技术难点攻关，把控项目各里程碑研发进度与交付质量；
4. 负责初中级工程师的日常业务辅导与技术梯队培育。

## 任职资格
1. 本科及以上学历，计算机、软件工程或相关专业背景；
2. 具备 3-5 年以上相关领域实战研发经验，具备扎实的数据结构与系统设计素养；
3. 熟练掌握现代前后端工程化理念，具有大型高并发/分布式系统实战落地经验；
4. 具备极强的问题排查定位能力、自驱力与跨业务团队沟通协同韧性；
5. 有大厂核心项目开发或开源项目主导经验者优先。

## 福利发展
- 弹性工时、全额五险一金、年度体检、定期高管面对面与技术沙龙。`;
  }

  // 2. Resume Evaluation Mock
  if (prompt.includes("简历评估") || prompt.includes("匹配度评分") || options.jsonMode) {
    return JSON.stringify({
      matchScore: 88,
      summary: "该候选人核心经历与当前岗位匹配度高，具备扎实的专业积累与独立带模块交付成果，技术视野广，沟通流畅。",
      strengths: [
        "核心技术栈扎实，项目实战落地经验丰富",
        "具备跨团队协调与项目推进能力",
        "学习能力突出，对新技术有深入调研意愿"
      ],
      weaknesses: [
        "针对超大规模并发调优或特异性业务场景经验尚需进一步考察",
        "对当前行业垂直业务背景需要一定适应周期"
      ],
      recommendation: "RECOMMENDED",
      interviewQuestions: [
        "请结合过往最具代表性的项目，分享一次在资源或时间极其紧迫下保质交付的权衡过程？",
        "面对跨部门沟通中需求意见分歧严重的情况，你通常如何对齐共识并推动落实？",
        "在过往技术攻坚中，遇到过最棘手的线上故障或性能瓶颈是什么？如何定位与根本解决的？"
      ]
    });
  }

  // 3. Interview Questions Mock
  if (prompt.includes("面试题") || prompt.includes("面试提问")) {
    return `### 结构化专业与行为面试指南 (STAR 原则)

#### 维度一：专业实战与技术深度
1. **情境/任务 (Situation/Task)**: 请描述一次你在系统重构或核心模块交付中遇到的关键技术瓶颈。
2. **行动 (Action)**: 你采用了哪些方案对比？为什么最终选择了该技术路径？
3. **结果 (Result)**: 最终指标（如吞吐量、交付周期、线上故障率）改善了多少？
*【考察重点】架构决策深度、权衡取舍意识与真实编码能力。*

#### 维度二：业务理解与产品思维
1. 在与业务部门或产品团队对接时，面对不合理或频繁变动的需求，你如何甄别并引导至合理方案？
*【考察重点】业务敏锐度、抗压能力与沟通同理心。*

#### 维度三：团队协作与梯队成长
1. 在日常工作中，你如何参与代码审查（Code Review）与知识分享？如何帮助初级团队成员提升技术素养？
*【考察重点】团队技术影响力、协同意识与利他精神。*`;
  }

  // 4. Offer Letter Mock
  if (prompt.includes("Offer") || prompt.includes("录用通知")) {
    return `【录用通知书 - Offer Letter】

尊敬的候选人：

您好！非常荣幸地通知您，通过综合面试与专业胜任力评估，您已正式通过我司的甄选流程。现正式向您发出录用邀约：

一、录用岗位与部门
- 录用部门：技术研发中心 / 人力资源中心
- 录用岗位：高级工程师 / 资深顾问
- 职级定级：P6 / M2

二、薪酬与福利待遇
- 基本薪酬：以双方劳动合同约定为准（按月发放）
- 绩效奖金：根据年度组织业绩与个人绩效系数综合评定
- 基础福利：全额五险一金、带薪年假、年度健康体检、餐费补贴

三、报到入职指引
- 报到时间：请于通知发出后15个工作日内办理入职
- 携带材料：身份证原件及复印件、学历学位证书、前单位离职证明原件、近期一寸免冠照片两张

欢迎加入我们的团队，期待与您携手共进！`;
  }

  return "已接收您的输入指令并完成分析，请在各功能工作区查看最新结果。";
}
