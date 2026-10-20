import { AgentPlugin } from "@/types/agent";
import { callLLM } from "@/lib/llm";

export interface OfferGeneratorInput {
  candidateName: string;
  position: string;
  department: string;
  baseSalary: string;
  bonusStructure: string;
  reportDate: string;
  specialBenefits?: string;
}

export interface OfferGeneratorOutput {
  offerContent: string;
  smsNotification: string;
  approvalSummary: string;
  generatedAt: string;
}

export const offerGeneratorAgent: AgentPlugin<OfferGeneratorInput, OfferGeneratorOutput> = {
  metadata: {
    id: "agent_rec_offer_generator",
    code: "REC_OFFER_GENERATOR",
    title: "智能 Offer 与录用审批",
    description: "录用参数一键装配，自动化校验薪酬职级并生成标准 Offer 文书与入职通知。",
    category: "RECRUITMENT",
    status: "AUTOMATED",
    efficiency: "流程耗时降低 90%",
    targetRoles: ["RECRUITER", "SSC"],
    version: "1.0.0",
  },

  async execute(input: OfferGeneratorInput, onProgress) {
    if (onProgress) await onProgress(25, "正在装配录用条款与合规薪酬结构...");

    const userPrompt = `请为即将入职的候选人生成全套录用材料：
- 候选人姓名：${input.candidateName}
- 录用岗位：${input.position}
- 录用部门：${input.department}
- 基本月薪：${input.baseSalary}
- 奖金与考核机制：${input.bonusStructure}
- 报到入职日期：${input.reportDate}
- 补充福利待遇：${input.specialBenefits || "全额五险一金、餐补、带薪年假"}

请生成三项内容，格式如下：
### 1. 规范正式录用通知书 (Offer Letter 邮件版)
（规范、热情、合规条款清晰、入职携带材料指引）

### 2. 短信/企微即时通知简讯
（100字以内，重点突出入职时间、职位与查收邮箱提醒）

### 3. HR内部录用审批摘要
（用于内部OA/系统流转的薪酬结构核准卡）`;

    if (onProgress) await onProgress(70, "正在生成合规 Offer 文书与通知内容...");

    const fullText = await callLLM({
      systemPrompt: "你是一个精通劳动法与人力资源入职合规的SSC运营专家。",
      userPrompt,
      temperature: 0.5,
    });

    if (onProgress) await onProgress(100, "Offer 材料装配完毕");

    return {
      offerContent: fullText,
      smsNotification: `【录用通知】尊敬的${input.candidateName}，恭喜您通过我司面试考核被录用为${input.position}！正式Offer已发至您的邮箱，报到日期为${input.reportDate}，期待您的加入！`,
      approvalSummary: `姓名：${input.candidateName} | 岗位：${input.position} | 部门：${input.department} | 薪酬：${input.baseSalary}，奖金结构：${input.bonusStructure}`,
      generatedAt: new Date().toISOString(),
    };
  },
};
