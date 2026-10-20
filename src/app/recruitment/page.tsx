"use client";

import { useState } from "react";
import { 
  FileText, 
  CheckCircle, 
  UserCheck, 
  Award, 
  Zap, 
  Sparkles, 
  Send,
  Loader2,
  Copy,
  ExternalLink
} from "lucide-react";

export default function RecruitmentHubPage() {
  const [activeTab, setActiveTab] = useState<"JD" | "RESUME" | "INTERVIEW" | "OFFER">("RESUME");

  // 1. JD Generator State
  const [jdForm, setJdForm] = useState({
    jobTitle: "全栈高级开发工程师",
    department: "技术研发部",
    experienceLevel: "3-5年",
    salaryRange: "25k-35k · 15薪",
    keyRequirements: "掌握 React/Next.js/Node.js 全栈技术，熟悉高可用分布式架构及性能调优",
  });
  const [jdLoading, setJdLoading] = useState(false);
  const [jdResult, setJdResult] = useState<string | null>(null);

  // 2. Resume Eval State
  const [targetPosition, setTargetPosition] = useState("高级前端开发工程师");
  const [candidateName, setCandidateName] = useState("王建国");
  const [resumeText, setResumeText] = useState(
    "具有4年前端研发经验，精通React/Next.js生态与TypeScript。在上一家公司负责电商核心营销中台系统，完成过多次首屏性能优化与SSR改造，团队协作意识强。"
  );
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeResult, setResumeResult] = useState<any | null>(null);
  const [dispatchAutomation, setDispatchAutomation] = useState(false);

  // 3. Interview Prep State
  const [interviewForm, setInterviewForm] = useState({
    candidateName: "王建国",
    position: "高级前端开发工程师",
    resumeSummary: "精通React及SSR，主导过营销中台改造，但过往微前端大型架构经验较少",
    focusAreas: "微前端与模块联邦、高并发首屏性能调优、跨团队抗压协同",
  });
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewResult, setInterviewResult] = useState<string | null>(null);

  // 4. Offer State
  const [offerForm, setOfferForm] = useState({
    candidateName: "王建国",
    position: "高级前端开发工程师",
    department: "数字化研发部",
    baseSalary: "28,000 元/月",
    bonusStructure: "年终 2-4 个月绩效奖金 + 项目上线里程碑激励",
    reportDate: "2026-11-01",
    specialBenefits: "全额六险一金、餐费补贴、年度体检、入职发最新MacBook Pro",
  });
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerResult, setOfferResult] = useState<any | null>(null);

  // JD Action
  const handleGenerateJD = async () => {
    setJdLoading(true);
    try {
      const res = await fetch("/api/agents/recruitment/jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jdForm),
      });
      const data = await res.json();
      if (data.success) {
        setJdResult(data.data.jdContent);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setJdLoading(false);
    }
  };

  // Resume Eval Action (Direct or Automated Task)
  const handleEvalResume = async () => {
    setResumeLoading(true);
    setResumeResult(null);

    const payload = {
      targetPosition,
      resumes: [
        {
          name: candidateName,
          text: resumeText,
        },
      ],
    };

    if (dispatchAutomation) {
      // 托管给后台自动化监控执行并派发推送通知
      try {
        const res = await fetch("/api/automation/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentCode: "REC_RESUME_EVAL",
            title: `批量简历初筛与匹配评分 (${candidateName}等)`,
            input: payload,
          }),
        });
        const data = await res.json();
        if (data.success) {
          alert(`自动化任务已提交后台执行！任务ID: ${data.data.id}。您可以前往【自动化监控】页面查看实时执行进度与通知推送记录。`);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setResumeLoading(false);
      }
      return;
    }

    try {
      const res = await fetch("/api/agents/recruitment/resume-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setResumeResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResumeLoading(false);
    }
  };

  // Interview Prep Action
  const handleGenerateInterview = async () => {
    setInterviewLoading(true);
    try {
      const res = await fetch("/api/agents/recruitment/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(interviewForm),
      });
      const data = await res.json();
      if (data.success) {
        setInterviewResult(data.data.guideMarkdown);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInterviewLoading(false);
    }
  };

  // Offer Action
  const handleGenerateOffer = async () => {
    setOfferLoading(true);
    try {
      const res = await fetch("/api/agents/recruitment/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerForm),
      });
      const data = await res.json();
      if (data.success) {
        setOfferResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOfferLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            智能招聘工作站 (Talent Acquisition Studio)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            覆盖招聘全链路：岗位规划 → 简历批量自动化初筛打分 → 针对性行为面试题库 → 录用与 Offer 合规装配
          </p>
        </div>
      </div>

      {/* 选项卡导航 */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("RESUME")}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-sm transition-all ${
            activeTab === "RESUME"
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>简历初筛与匹配打分</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
            🟢 自动化
          </span>
        </button>

        <button
          onClick={() => setActiveTab("JD")}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-sm transition-all ${
            activeTab === "JD"
              ? "border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>智能 JD 编写</span>
          <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
            🟣 高提效
          </span>
        </button>

        <button
          onClick={() => setActiveTab("INTERVIEW")}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-sm transition-all ${
            activeTab === "INTERVIEW"
              ? "border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <UserCheck className="w-4 h-4 text-indigo-600" />
          <span>针对性行为面试指南</span>
          <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
            🟣 高提效
          </span>
        </button>

        <button
          onClick={() => setActiveTab("OFFER")}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold text-sm transition-all ${
            activeTab === "OFFER"
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span>智能 Offer 录用审批</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
            🟢 自动化
          </span>
        </button>
      </div>

      {/* 1. 简历初筛与匹配打分 (自动化重点) */}
      {activeTab === "RESUME" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                候选人与目标岗位配置
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                节省 85% 初筛耗时
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                目标评选岗位 (JD)
              </label>
              <input
                type="text"
                value={targetPosition}
                onChange={(e) => setTargetPosition(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                候选人姓名
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                简历正文 / 履历文本 (可粘贴或自数据中心同步)
              </label>
              <textarea
                rows={7}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-center gap-3">
              <input
                type="checkbox"
                id="dispatchCheck"
                checked={dispatchAutomation}
                onChange={(e) => setDispatchAutomation(e.target.checked)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
              />
              <label htmlFor="dispatchCheck" className="text-xs text-emerald-900 cursor-pointer font-medium">
                托管至后台自动化作业（执行完成后通过 Webhook / SMTP 自动推送结果通知）
              </label>
            </div>

            <button
              onClick={handleEvalResume}
              disabled={resumeLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {resumeLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  正在进行智能匹配分析...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  {dispatchAutomation ? "提交后台自动化任务" : "即刻开始智能评分与诊断"}
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h2 className="font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
              <span>评估诊断报告 (AI Evaluation Card)</span>
              {resumeResult && (
                <span className="text-xs text-slate-400 font-normal">
                  已同步持久化到本地候选人数据库
                </span>
              )}
            </h2>

            {resumeResult ? (
              <div className="space-y-4 flex-1">
                {resumeResult.evaluations?.map((item: any, idx: number) => (
                  <div key={idx} className="space-y-4">
                    {/* 分数大卡 */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                      <div>
                        <div className="text-xs text-emerald-800 font-medium">岗位匹配度得分</div>
                        <div className="text-3xl font-black text-emerald-700">
                          {item.matchScore} <span className="text-sm font-semibold text-emerald-600">/ 100</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${
                            item.recommendation === "RECOMMENDED"
                              ? "bg-emerald-600 text-white"
                              : item.recommendation === "CONSIDER"
                              ? "bg-amber-500 text-white"
                              : "bg-rose-500 text-white"
                          }`}
                        >
                          {item.recommendation === "RECOMMENDED"
                            ? "强烈推荐初试"
                            : item.recommendation === "CONSIDER"
                            ? "建议深入复核"
                            : "不建议进入下一轮"}
                        </span>
                      </div>
                    </div>

                    {/* 总结 */}
                    <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
                      <span className="font-bold text-slate-900 mr-1">综合诊断：</span>
                      {item.summary}
                    </div>

                    {/* 优缺点对比 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100">
                        <div className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          核心胜任力优势
                        </div>
                        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                          {item.strengths?.map((s: string, i: number) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-100">
                        <div className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-600" />
                          潜在短板与考察点
                        </div>
                        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                          {item.weaknesses?.map((w: string, i: number) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 面试题建议 */}
                    <div className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100">
                      <div className="text-xs font-bold text-indigo-900 mb-2">
                        推荐后续初面追问重点 (Customized Questions)
                      </div>
                      <div className="space-y-1.5">
                        {item.interviewQuestions?.map((q: string, i: number) => (
                          <div key={i} className="text-xs text-slate-700 bg-white p-2 rounded-lg border border-indigo-100">
                            {i + 1}. {q}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center p-8 text-center text-slate-400 text-xs">
                在左侧填写候选人信息与目标岗位后点击运行，或勾选自动化托管至后台异步队列。
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. JD Generator */}
      {activeTab === "JD" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              JD 基础要素设定
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">岗位名称</label>
              <input
                type="text"
                value={jdForm.jobTitle}
                onChange={(e) => setJdForm({ ...jdForm, jobTitle: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">所属部门</label>
                <input
                  type="text"
                  value={jdForm.department}
                  onChange={(e) => setJdForm({ ...jdForm, department: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">经验要求</label>
                <input
                  type="text"
                  value={jdForm.experienceLevel}
                  onChange={(e) => setJdForm({ ...jdForm, experienceLevel: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">薪酬区间参考</label>
              <input
                type="text"
                value={jdForm.salaryRange}
                onChange={(e) => setJdForm({ ...jdForm, salaryRange: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                关键业务诉求或特质要求
              </label>
              <textarea
                rows={4}
                value={jdForm.keyRequirements}
                onChange={(e) => setJdForm({ ...jdForm, keyRequirements: e.target.value })}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleGenerateJD}
              disabled={jdLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {jdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {jdLoading ? "正在编写与对标市场标准..." : "智能生成结构化标准 JD"}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 text-base">生成的岗位说明书 (JD Preview)</h2>
              {jdResult && (
                <button
                  onClick={() => navigator.clipboard.writeText(jdResult)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                >
                  <Copy className="w-3.5 h-3.5" /> 复制全文
                </button>
              )}
            </div>

            {jdResult ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex-1 overflow-auto max-h-[500px]">
                <pre className="text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">
                  {jdResult}
                </pre>
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center p-8 text-center text-slate-400 text-xs">
                配置左侧岗位属性后点击生成，AI 将输出合规且有竞争力的职位说明书。
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Interview Prep */}
      {activeTab === "INTERVIEW" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              候选人与考察侧重
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">候选人姓名</label>
                <input
                  type="text"
                  value={interviewForm.candidateName}
                  onChange={(e) => setInterviewForm({ ...interviewForm, candidateName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">应聘岗位</label>
                <input
                  type="text"
                  value={interviewForm.position}
                  onChange={(e) => setInterviewForm({ ...interviewForm, position: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">简历疑点 / 背景摘要</label>
              <textarea
                rows={3}
                value={interviewForm.resumeSummary}
                onChange={(e) => setInterviewForm({ ...interviewForm, resumeSummary: e.target.value })}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">核心考察维度要求</label>
              <textarea
                rows={3}
                value={interviewForm.focusAreas}
                onChange={(e) => setInterviewForm({ ...interviewForm, focusAreas: e.target.value })}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleGenerateInterview}
              disabled={interviewLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {interviewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {interviewLoading ? "正在基于 STAR 原则构建题库..." : "生成结构化行为面试指南"}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <h2 className="font-bold text-slate-900 text-base mb-4">行为面试指南 (Interview Guide)</h2>
            {interviewResult ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex-1 overflow-auto max-h-[500px]">
                <pre className="text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">
                  {interviewResult}
                </pre>
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center p-8 text-center text-slate-400 text-xs">
                录入候选人及重点考查项，AI 将自动制定针对性深挖题与评判标尺。
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Offer Generator */}
      {activeTab === "OFFER" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              录用审批与文书参数
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">候选人姓名</label>
                <input
                  type="text"
                  value={offerForm.candidateName}
                  onChange={(e) => setOfferForm({ ...offerForm, candidateName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">录用岗位</label>
                <input
                  type="text"
                  value={offerForm.position}
                  onChange={(e) => setOfferForm({ ...offerForm, position: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">录用部门</label>
                <input
                  type="text"
                  value={offerForm.department}
                  onChange={(e) => setOfferForm({ ...offerForm, department: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">报到入职日期</label>
                <input
                  type="date"
                  value={offerForm.reportDate}
                  onChange={(e) => setOfferForm({ ...offerForm, reportDate: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">基本薪酬</label>
                <input
                  type="text"
                  value={offerForm.baseSalary}
                  onChange={(e) => setOfferForm({ ...offerForm, baseSalary: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">绩效与奖金包</label>
                <input
                  type="text"
                  value={offerForm.bonusStructure}
                  onChange={(e) => setOfferForm({ ...offerForm, bonusStructure: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">特殊福利或定制条款</label>
              <textarea
                rows={2}
                value={offerForm.specialBenefits}
                onChange={(e) => setOfferForm({ ...offerForm, specialBenefits: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={handleGenerateOffer}
              disabled={offerLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {offerLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
              {offerLoading ? "正在合规装配 Offer 文本..." : "生成全套录用材料 (邮件+短信+审批卡)"}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col space-y-4">
            <h2 className="font-bold text-slate-900 text-base">录用材料装配结果 (Offer Suite)</h2>
            {offerResult ? (
              <div className="space-y-4 flex-1 overflow-auto max-h-[550px]">
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-900 block mb-1">
                    📲 短信 / 企微即时录用喜报文案：
                  </span>
                  <p className="text-xs text-slate-700">{offerResult.smsNotification}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-900 block mb-2">
                    📄 正式 Offer Letter 文书：
                  </span>
                  <pre className="text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">
                    {offerResult.offerContent}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center p-8 text-center text-slate-400 text-xs">
                配置薪酬待遇及入职要求，一键生成正式 Offer 邮件与通知。
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
