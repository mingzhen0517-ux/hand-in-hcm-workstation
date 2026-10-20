"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  Clock, 
  Sparkles, 
  Filter, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  ThumbsUp,
  X
} from "lucide-react";

interface Feature {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  status: "AUTOMATED" | "HIGH_EFFICIENCY" | "ON_THE_WAY";
  efficiency: string;
  roleTags: string;
  votes: number;
}

const ROLES = [
  { key: "ALL", label: "全部角色 (All Roles)" },
  { key: "RECRUITER", label: "招聘 HR / TA" },
  { key: "HRBP", label: "业务伙伴 HRBP" },
  { key: "SSC", label: "共享服务中心 SSC" },
  { key: "CB_SPECIALIST", label: "薪酬福利 C&B" },
  { key: "HRD", label: "HR 负责人 / HRD" },
];

const CATEGORIES = [
  { key: "ALL", label: "全部业务" },
  { key: "RECRUITMENT", label: "招聘与配置" },
  { key: "TRAINING", label: "培训与发展" },
  { key: "PERFORMANCE", label: "绩效管理" },
  { key: "COMPENSATION", label: "薪酬与福利" },
  { key: "RELATIONS", label: "员工关系与运营" },
  { key: "ANALYTICS", label: "组织发展与盘点" },
];

export default function HomePage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Modal for On The Way vote feedback
  const [activeModalFeature, setActiveModalFeature] = useState<Feature | null>(null);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  useEffect(() => {
    fetchFeatures();
  }, [selectedRole, selectedCategory]);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/features?role=${selectedRole}&category=${selectedCategory}`);
      const json = await res.json();
      if (json.success) {
        setFeatures(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteSubmit = async () => {
    if (!activeModalFeature) return;
    try {
      const res = await fetch("/api/features/request-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          featureCode: activeModalFeature.code,
          userRole: selectedRole !== "ALL" ? selectedRole : "HR_STAFF",
          feedback: feedbackInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVoteSubmitted(true);
        setTimeout(() => {
          setActiveModalFeature(null);
          setVoteSubmitted(false);
          setFeedbackInput("");
          fetchFeatures();
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* 顶部引导横幅 */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_70%)] pointer-events-none" />
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            新一代 HCM 智能工作站
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            选择您的 HR 业务需求，体验高提效与自动化
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            系统按提效幅度对功能进行了视觉颜色分级引导：
            <span className="inline-block mx-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              🟢 已上线·可全自动执行
            </span>
            、
            <span className="inline-block mx-1.5 px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 font-semibold border border-indigo-400/30">
              🟣 已上线·人机协同高提效
            </span>
            、
            <span className="inline-block mx-1.5 px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 font-medium border border-slate-600/40">
              ⚪ 规划中 (点击记录埋点驱动排期)
            </span>
            。
          </p>
        </div>
      </div>

      {/* 筛选控制器 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Filter className="w-4 h-4 text-indigo-600" />
            按您的 HR 角色筛选 (Role Perspective)
          </div>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r.key}
                onClick={() => setSelectedRole(r.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedRole === r.key
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-slate-500 mr-2">业务大类：</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                selectedCategory === cat.key
                  ? "bg-slate-900 text-white font-medium shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 功能卡片列表 */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">正在载入工作台功能矩阵...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const isAutomated = feature.status === "AUTOMATED";
            const isHighEff = feature.status === "HIGH_EFFICIENCY";
            const isOnTheWay = feature.status === "ON_THE_WAY";

            return (
              <div
                key={feature.id}
                className={`rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between border ${
                  isAutomated
                    ? "bg-emerald-50/40 border-emerald-300 shadow-sm hover:shadow-md hover:border-emerald-400 ring-1 ring-emerald-500/10"
                    : isHighEff
                    ? "bg-indigo-50/40 border-indigo-200 shadow-sm hover:shadow-md hover:border-indigo-300 ring-1 ring-indigo-500/10"
                    : "bg-slate-50 border-slate-200 text-slate-500 opacity-90 hover:opacity-100 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                        isAutomated
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : isHighEff
                          ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {isAutomated && <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />}
                      {isHighEff && <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
                      {isOnTheWay && <Clock className="w-3.5 h-3.5 text-slate-500" />}
                      {isAutomated ? "已就绪 · 全自动化" : isHighEff ? "已就绪 · 高提效" : "On The Way · 规划中"}
                    </span>

                    <span className="text-xs font-bold text-slate-600 px-2 py-0.5 rounded bg-white/80 border border-slate-200/60 shadow-2xs">
                      {feature.efficiency}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                  {isOnTheWay ? (
                    <>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        已收到 {feature.votes} 位 HR 期待
                      </span>
                      <button
                        onClick={() => setActiveModalFeature(feature)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                        优先开发投票
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        微内核 Agent 插件激活
                      </span>
                      <Link
                        href="/recruitment"
                        className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 text-white shadow-xs transition-all ${
                          isAutomated
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      >
                        立即体验
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* On The Way 需求埋点与弹窗 */}
      {activeModalFeature && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setActiveModalFeature(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {voteSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">期待已成功落库记录！</h3>
                <p className="text-xs text-slate-600">
                  当前已将此功能的优先级日志记录到数据库，产品团队将根据投票数优先排期上线。
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                  <HelpCircle className="w-4 h-4" />
                  功能规划中 (On The Way)
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeModalFeature.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    当前该功能正在规划排期中。点击提交将记录您的点击日志，以便我们在后续迭代中优先开发。
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    告诉我们您的具体业务诉求 (可选)：
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="例如：我们每个月考勤对账需要花2天，最希望有自动异常比对功能..."
                    className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setActiveModalFeature(null)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    再等等
                  </button>
                  <button
                    onClick={handleVoteSubmit}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    加速上线投一票
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
