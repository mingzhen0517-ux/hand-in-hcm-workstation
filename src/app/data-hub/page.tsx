"use client";

import { useEffect, useState } from "react";
import { 
  Database, 
  UploadCloud, 
  RefreshCw, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Link as LinkIcon
} from "lucide-react";

export default function DataHubPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Sync State
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [candRes, syncRes] = await Promise.all([
        fetch("/api/data-hub/upload"),
        fetch("/api/data-hub/sync"),
      ]);
      const candData = await candRes.json();
      const syncData = await syncRes.json();

      if (candData.success) setCandidates(candData.data);
      if (syncData.success) setDataSources(syncData.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/data-hub/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadMessage(`✅ ${data.message}`);
        setSelectedFile(null);
        loadData();
      } else {
        setUploadMessage(`❌ 上传失败: ${data.error}`);
      }
    } catch (e: any) {
      setUploadMessage(`❌ 请求异常: ${e?.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleTriggerSync = async (configId?: string) => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/data-hub/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configId }),
      });
      const data = await res.json();
      if (data.success) {
        setSyncMessage(`✅ ${data.message}`);
        loadData();
      } else {
        setSyncMessage(`❌ 同步失败: ${data.error}`);
      }
    } catch (e: any) {
      setSyncMessage(`❌ 同步异常: ${e?.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Database className="w-6 h-6 text-indigo-600" />
          数据集成中心 (Data Hub & Ingestion)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          支持解析导入本地 Excel / CSV 花名册文件，以及通过 API 周期拉取外部 HCM / OA 系统员工数据并落库。
        </p>
      </div>

      {/* 操作两列卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. 本地文件上传与解析 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm">本地表格 / 简历文件解析导入</h2>
          </div>

          <p className="text-xs text-slate-500">
            支持 Excel (.xlsx, .xls) 与 CSV 格式，自动识别表头如“姓名、电话、邮箱、岗位、工作年限、技能”，批量解析落库。
          </p>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-all">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <label className="cursor-pointer block text-xs font-semibold text-indigo-600 hover:text-indigo-700">
              <span>{selectedFile ? selectedFile.name : "选择或拖入 Excel/CSV 文件"}</span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv,.txt"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </label>
            <span className="text-[11px] text-slate-400 block mt-1">
              单文件上限 10MB，自动去重与事务存储
            </span>
          </div>

          {uploadMessage && (
            <div className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium">
              {uploadMessage}
            </div>
          )}

          <button
            onClick={handleFileUpload}
            disabled={!selectedFile || uploading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {uploading ? "正在解析文件入库..." : "解析并导入至本地数据库"}
          </button>
        </div>

        {/* 2. 外部 API 同步连接器 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <LinkIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-sm">外部 HCM / OA 系统 API 同步通道</h2>
          </div>

          <p className="text-xs text-slate-500">
            已配置好的外部对接端点，可通过点击或定时机制拉取远程花名册，实现本地与核心人事系统互通。
          </p>

          <div className="space-y-3">
            {dataSources.map((ds) => (
              <div key={ds.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{ds.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{ds.endpointUrl}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    上次同步: {ds.lastSyncAt ? new Date(ds.lastSyncAt).toLocaleString("zh-CN") : "从未同步"}
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerSync(ds.id)}
                  disabled={syncing}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-1 shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                  立即拉取
                </button>
              </div>
            ))}
          </div>

          {syncMessage && (
            <div className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium">
              {syncMessage}
            </div>
          )}
        </div>
      </div>

      {/* 本地数据库候选人/员工数据总览 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            本地沉淀人才库档案 (Local Candidates & Profiles: {candidates.length} 人)
          </h2>
          <button
            onClick={loadData}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" /> 刷新数据
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-400 text-xs">正在查询数据库...</div>
        ) : candidates.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs">
            暂无人才数据，请在上方上传表格或通过 API 同步。
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">姓名</th>
                  <th className="py-3 px-4">应聘/匹配岗位</th>
                  <th className="py-3 px-4">工作年限</th>
                  <th className="py-3 px-4">联系方式</th>
                  <th className="py-3 px-4">数据来源</th>
                  <th className="py-3 px-4">状态</th>
                  <th className="py-3 px-4">AI 诊断分</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((c) => {
                  const evalScore = c.evaluations?.[0]?.matchScore;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-all">
                      <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                      <td className="py-3 px-4 text-slate-700">{c.positionApplied || "通用"}</td>
                      <td className="py-3 px-4 text-slate-600">{c.yearsExp ? `${c.yearsExp} 年` : "-"}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{c.phone || c.email || "-"}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                          {c.source}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {evalScore !== undefined ? (
                          <span className="font-extrabold text-emerald-600 text-sm">
                            {evalScore} 分
                          </span>
                        ) : (
                          <span className="text-slate-400">未评分</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
