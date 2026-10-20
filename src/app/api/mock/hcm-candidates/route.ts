import { NextResponse } from "next/server";

export async function GET() {
  const mockExternalEmployees = [
    {
      name: "周子涵",
      phone: "18611112222",
      email: "zihan.zhou@mock-corp.com",
      positionApplied: "组织发展与绩效主管",
      yearsExp: 6,
      skills: ["OKR设计", "胜任力模型", "领导力梯队"],
      resumeText: "6年集团型企业HR经验，负责搭建过集团绩效考核全生命周期指标库与核心管理层述职流程。",
    },
    {
      name: "陈思远",
      phone: "18533334444",
      email: "siyuan.chen@mock-corp.com",
      positionApplied: "薪酬福利(C&B)专家",
      yearsExp: 4,
      skills: ["算薪建模", "税优方案", "市场薪酬对标"],
      resumeText: "熟悉全国各地个税社保公积金政策，有丰富的跨国企业薪酬总额管控与年终奖激励核算实战经验。",
    },
    {
      name: "林佳琪",
      phone: "13566667777",
      email: "jiaqi.lin@mock-corp.com",
      positionApplied: "HR 运营/SSC 专员",
      yearsExp: 2,
      skills: ["员工服务", "档案审核", "假勤管理"],
      resumeText: "踏实细致，掌握各大主流OA人事模块操作，月均办理入离职与证明开具达200+人次零差错。",
    },
  ];

  return NextResponse.json({
    code: 200,
    message: "success",
    data: mockExternalEmployees,
    syncTimestamp: new Date().toISOString(),
  });
}
