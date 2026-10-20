"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Play, 
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface AutomationTask {
  id: string;
  agentCode: string;
  title: string;
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";
  progress: number;
  totalCount: number;
  processedCount: number;
  successCount: number;
  failedCount: number;
  resultSummary: string | null;
  errorDetail: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
}

export default function AutomationMonitorPage() {
  const [tasks, setTasks] = useState<AutomationTask[]>([]);
  const [stats, setStats] = useState({ total: 0, running: 0, success: 0, failed: 0 });
  const [loading, setLoading] = useState(true);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
    const timer = setInterval(fetchTasks, 3000); // 3秒自动轮询刷新状态
    return () => clearInterval(timer);
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/automation/tasks");
      const json = await res.json();
      if (json.success) {
        setTasks(json.data.tasks);
        setStats(json.data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const triggerDemoBatchTask = async () => {
    try {
      const res = await fetch("/api/automation/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentCode: "REC_RESUME_EVAL",
          title: "全自动批处理：新投递前端工程师简历初筛",
          totalCount: 3,
          input: {
            targetPosition: "高级全栈工程师",
            resumes: [
              {
                name: "张立伟",
                phone: "13800001111",
                text: "5年Web全栈研发，精通React/Next.js与Node服务端，负责过千万级日活活动平台。",
              },
              {
                name: "赵雪",
                phone: "13922223333",
                text: "3年Vue及React前端开发，主要在电商领域做小程序与H5页面交付，技术稳健。",
              },
              {
                name: "孙凯",
                phone: "18644445555",
                text: "7年资深架构师，主导过微前端基座搭建与跨国跨时区分布式团队协作。",
              },
            ],
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            自动化监控执行中心 (Automation Monitor)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            监控所有后台无人值守作业状态机流转与执行进度，任务结束触发即时多通道推送。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTasks}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> 刷新
          </button>
          <button
            onClick={triggerDemoBatchTask}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> 触发一次自动化简历批处理
          </button>
        </div>
      </div>

      {/* 状态统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">累计作业总数</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-xs bg-blue-50/20">
          <div className="text-xs font-medium text-blue-700 flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> 执行中 (Running)
          </div>
          <div className="text-2xl font-black text-blue-700 mt-1">{stats.running}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs bg-emerald-50/20">
          <div className="text-xs font-medium text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 成功执行 (Success)
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats.success}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-xs bg-rose-50/20">
          <div className="text-xs font-medium text-rose-700 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> 异常/中断 (Failed)
          </div>
          <div className="text-2xl font-black text-rose-700 mt-1">{stats.failed}</div>
        </div>
      </div>

      {/* 任务监控流水表格 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-800">实时任务流水面板 (Task Execution Stream)</h2>
          <span className="text-xs text-slate-400">每 3 秒自动轮询心跳</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">正在载入作业流水...</div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            暂无自动化任务记录，点击上方“触发一次自动化简历批处理”体验。
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const isExpanded = expandedTaskId === task.id;
              return (
                <div key={task.id} className="p-4 hover:bg-slate-50/80 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            task.status === "SUCCESS"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : task.status === "RUNNING"
                              ? "bg-blue-100 text-blue-800 border border-blue-300 animate-pulse"
                              : task.status === "FAILED"
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {task.status}
                        </span>
                        <span className="font-bold text-sm text-slate-900">{task.title}</span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span>Agent 标识: {task.agentCode}</span>
                        <span>创建时间: {new Date(task.createdAt).toLocaleTimeString("zh-CN")}</span>
                        {task.finishedAt && (
                          <span>完成时间: {new Date(task.finishedAt).toLocaleTimeString("zh-CN")}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* 进度条 */}
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                          <span>进度</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className={`h-full transition-all duration-300 ${
                              task.status === "SUCCESS"
                                ? "bg-emerald-500"
                                : task.status === "FAILED"
                                ? "bg-rose-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* 展开的明细与产出数据 */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-slate-50/60 p-4 rounded-xl">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500">处理总数：</span>
                          <span className="font-bold text-slate-800">{task.totalCount}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">已处理数：</span>
                          <span className="font-bold text-slate-800">{task.processedCount}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">成功数：</span>
                          <span className="font-bold text-emerald-600">{task.successCount}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">异常/失败：</span>
                          <span className="font-bold text-rose-600">{task.failedCount}</span>
                        </div>
                      </div>

                      {task.errorDetail && (
                        <div className="text-xs p-2.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          <span className="font-bold">执行日志/状态：</span> {task.errorDetail}
                        </div>
                      )}

                      {task.resultSummary && (
                        <div>
                          <span className="text-xs font-bold text-slate-700 block mb-1">
                            执行产出结构化结果 (Result Summary JSON):
                          </span>
                          <pre className="text-[11px] p-3 rounded-lg bg-slate-900 text-slate-100 overflow-x-auto font-mono max-h-60">
                            {JSON.stringify(JSON.parse(task.resultSummary), null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
