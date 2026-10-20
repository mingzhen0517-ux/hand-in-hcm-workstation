import { AgentPlugin } from "@/types/agent";
import { callLLM } from "@/lib/llm";

export interface JDGeneratorInput {
  jobTitle: string;
  department: string;
  experienceLevel: string; // e.g. "3-5年", "应届生", "专家/资深"
  salaryRange?: string;
  keyRequirements?: string;
}

export interface JDGeneratorOutput {
  jobTitle: string;
  jdContent: string;
  generatedAt: string;
}

export const jdGeneratorAgent: AgentPlugin<JDGeneratorInput, JDGeneratorOutput> = {
  metadata: {
    id: "agent_rec_jd_generator",
    code: "REC_JD_GENERATOR",
    title: "智能 JD 编写与市场对标",
    description: "输入基础职责与职级，智能生成符合劳动合规要求与市场竞争力的结构化 JD。",
    category: "RECRUITMENT",
    status: "HIGH_EFFICIENCY",
    efficiency: "撰写提效 80%",
    targetRoles: ["RECRUITER", "HRBP"],
    version: "1.0.0",
  },

  async execute(input: JDGeneratorInput, onProgress) {
    if (onProgress) await onProgress(20, "正在分析行业岗位对标数据与关键胜任力...");

    const userPrompt = `请作为资深HR专家，为以下岗位编写一份专业、标准、有竞争力的岗位职责与任职资格说明书(JD)：
- 岗位名称：${input.jobTitle}
- 所属部门：${input.department || "未指定"}
- 经验要求：${input.experienceLevel}
- 薪酬范围：${input.salaryRange || "面议"}
- 关键诉求/特色标签：${input.keyRequirements || "行业主流技能标准"}

请输出结构清晰的 Markdown 格式，包含：【岗位职责】、【任职资格】（硬性技能+软性素养）、【加分项】与【福利发展】。`;

    if (onProgress) await onProgress(60, "大模型正在生成结构化岗位说明书与任职资格...");

    const jdContent = await callLLM({
      systemPrompt: "你是一个拥有10年大厂经验的资深招聘专家，擅长撰写规范且具有市场吸引力的JD。",
      userPrompt,
      temperature: 0.7,
    });

    if (onProgress) await onProgress(100, "JD 生成完毕");

    return {
      jobTitle: input.jobTitle,
      jdContent,
      generatedAt: new Date().toISOString(),
    };
  },
};
