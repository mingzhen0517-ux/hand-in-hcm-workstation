import { AgentPlugin } from "@/types/agent";
import { jdGeneratorAgent } from "./recruitment/agents/jd";
import { resumeEvalAgent } from "./recruitment/agents/resume-eval";
import { interviewPrepAgent } from "./recruitment/agents/interview";
import { offerGeneratorAgent } from "./recruitment/agents/offer";

// 全局 Agent 注册表 (微内核插件体系)
// 新增或下线 Agent 只需在此处注入或移除，不污染主界面其他业务
export const agentRegistry: Record<string, AgentPlugin<any, any>> = {
  [jdGeneratorAgent.metadata.code]: jdGeneratorAgent,
  [resumeEvalAgent.metadata.code]: resumeEvalAgent,
  [interviewPrepAgent.metadata.code]: interviewPrepAgent,
  [offerGeneratorAgent.metadata.code]: offerGeneratorAgent,
};

export function getAgentByCode(code: string): AgentPlugin<any, any> | undefined {
  return agentRegistry[code];
}

export function getAllRegisteredAgents(): AgentPlugin<any, any>[] {
  return Object.values(agentRegistry);
}
