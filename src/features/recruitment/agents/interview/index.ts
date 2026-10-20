import { AgentPlugin } from "@/types/agent";
import { callLLM } from "@/lib/llm";

export interface InterviewPrepInput {
  candidateName: string;
  position: string;
  resumeSummary?: string;
  focusAreas?: string; // e.g. "技术深度、抗压能力、团队管理"
}

export interface InterviewPrepOutput {
  candidateName: string;
  position: string;
  guideMarkdown: string;
  generatedAt: string;
}

export const interviewPrepAgent: AgentPlugin<InterviewPrepInput, InterviewPrepOutput> = {
  metadata: {
    id: "agent_rec_interview_prep",
    code: "REC_INTERVIEW_PREP",
    title: "针对性面试提问生成器",
    description: "结合候选人履历疑点与能力短板，自动生成 STAR 行为面试题与考察标准。",
    category: "RECRUITMENT",
    status: "HIGH_EFFICIENCY",
    efficiency: "准备提效 70%",
    targetRoles: ["RECRUITER", "HRBP"],
    version: "1.0.0",
  },

  async execute(input: InterviewPrepInput, onProgress) {
    if (onProgress) await onProgress(30, "正在提取岗位胜任力模型与候选人背景...");

    const userPrompt = `请为候选人【${input.candidateName}】（应聘岗位：【${input.position}】）生成结构化面试指南：
- 候选人背景摘要：${input.resumeSummary || "具备对应岗位工作年限，有专业实战积累"}
- 重点关注与考察维度：${input.focusAreas || "专业深度、业务理解、抗压沟通、团队协同"}

要求基于 STAR 原则（Situation、Task、Action、Result），设计 4~6 个有深度的行为面试题，每个问题后附带【考察维度】与【优质回答 vs 风险回答判别标准】。`;

    if (onProgress) await onProgress(70, "大模型正在生成行为面试指南与评判基准...");

    const guideMarkdown = await callLLM({
      systemPrompt: "你是一个专业的HRBP与结构化面试教练，精通行为面试法与胜任力测评体系。",
      userPrompt,
      temperature: 0.6,
    });

    if (onProgress) await onProgress(100, "面试题库生成完毕");

    return {
      candidateName: input.candidateName,
      position: input.position,
      guideMarkdown,
      generatedAt: new Date().toISOString(),
    };
  },
};
