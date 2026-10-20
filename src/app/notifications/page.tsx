"use client";

import { useEffect, useState } from "react";
import { 
  BellRing, 
  Mail, 
  Webhook, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  History
} from "lucide-react";

export default function NotificationHubPage() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Webhook Form State
  const [webhookConfig, setWebhookConfig] = useState({
    url: "",
    serviceType: "FEISHU", // FEISHU | WECOM | DINGTALK | CUSTOM
    isEnabled: true,
  });

  // SMTP Form State
  const [smtpConfig, setSmtpConfig] = useState({
    host: "smtp.example.com",
    port: 465,
    secure: true,
    user: "hr-notify@example.com",
    pass: "",
    from: "HR Workstation <hr-notify@example.com>",
    to: "hr-team@example.com",
    isEnabled: false,
  });

  const [savingChannel, setSavingChannel] = useState<string | null>(null);
  const [testingChannel, setTestingChannel] = useState<string | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await fetch("/api/notifications/config");
      const json = await res.json();
      if (json.success) {
        setConfigs(json.data.configs);
        setLogs(json.data.recentLogs);

        const wh = json.data.configs.find((c: any) => c.channel === "WEBHOOK");
        if (wh) {
          setWebhookConfig({
            url: wh.settings?.url || "",
            serviceType: wh.settings?.serviceType || "FEISHU",
            isEnabled: wh.isEnabled,
          });
        }

        const smtp = json.data.configs.find((c: any) => c.channel === "SMTP");
        if (smtp) {
          setSmtpConfig({
            host: smtp.settings?.host || "smtp.example.com",
            port: smtp.settings?.port || 465,
            secure: smtp.settings?.secure ?? true,
            user: smtp.settings?.user || "",
            pass: smtp.settings?.pass || "",
            from: smtp.settings?.from || "",
            to: smtp.settings?.to || "",
            isEnabled: smtp.isEnabled,
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (channel: "WEBHOOK" | "SMTP") => {
    setSavingChannel(channel);
    setAlertMsg(null);
    try {
      const settings = channel === "WEBHOOK" ? webhookConfig : smtpConfig;
      const isEnabled = channel === "WEBHOOK" ? webhookConfig.isEnabled : smtpConfig.isEnabled;

      const res = await fetch("/api/notifications/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          settings,
          isEnabled,
          triggerEvents: "COMPLETED,FAILED",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: "success", text: `${channel} 推送配置已成功保存！` });
        fetchConfigs();
      } else {
        setAlertMsg({ type: "error", text: data.error || "保存失败" });
      }
    } catch (e: any) {
      setAlertMsg({ type: "error", text: e?.message || "网络请求失败" });
    } finally {
      setSavingChannel(null);
    }
  };

  const handleTestNotification = async (channel: string) => {
    setTestingChannel(channel);
    setAlertMsg(null);
    try {
      const res = await fetch("/api/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: "success", text: data.message });
        fetchConfigs();
      } else {
        setAlertMsg({ type: "error", text: data.error || "测试调用发生异常" });
      }
    } catch (e: any) {
      setAlertMsg({ type: "error", text: e?.message || "测试通知异常" });
    } finally {
      setTestingChannel(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BellRing className="w-6 h-6 text-indigo-600" />
          推送通知中心 (Notification Hub)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          配置飞书/企微/钉钉 Webhook 机器人及标准 SMTP 邮件服务，支持任务完成/异常时即时提醒。
        </p>
      </div>

      {alertMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            alertMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {alertMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          {alertMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Webhook 配置卡片 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Webhook className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-sm">企业群机器人 Webhook</h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={webhookConfig.isEnabled}
                onChange={(e) => setWebhookConfig({ ...webhookConfig, isEnabled: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              启用该通道
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">机器人协议类型</label>
            <select
              value={webhookConfig.serviceType}
              onChange={(e) => setWebhookConfig({ ...webhookConfig, serviceType: e.target.value })}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="FEISHU">飞书自定义机器人 (Feishu Webhook)</option>
              <option value="WECOM">企业微信群机器人 (WeCom Webhook)</option>
              <option value="DINGTALK">钉钉群机器人 (DingTalk Webhook)</option>
              <option value="CUSTOM">通用自定义 JSON HTTP POST</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Webhook 接入地址 (Endpoint URL)
            </label>
            <input
              type="text"
              placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/xxxx"
              value={webhookConfig.url}
              onChange={(e) => setWebhookConfig({ ...webhookConfig, url: e.target.value })}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={() => handleTestNotification("WEBHOOK")}
              disabled={testingChannel === "WEBHOOK" || !webhookConfig.url}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {testingChannel === "WEBHOOK" ? "测试发送中..." : "测试推送连通性"}
            </button>
            <button
              onClick={() => handleSaveConfig("WEBHOOK")}
              disabled={savingChannel === "WEBHOOK"}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              {savingChannel === "WEBHOOK" ? "正在保存..." : "保存 Webhook 配置"}
            </button>
          </div>
        </div>

        {/* 2. SMTP 邮件配置卡片 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-sm">SMTP 邮件服务配置</h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={smtpConfig.isEnabled}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, isEnabled: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              启用该通道
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">SMTP 主机</label>
              <input
                type="text"
                value={smtpConfig.host}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">端口</label>
              <input
                type="number"
                value={smtpConfig.port}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">认证账号 (User)</label>
              <input
                type="text"
                value={smtpConfig.user}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">密码/授权码</label>
              <input
                type="password"
                placeholder="••••••••"
                value={smtpConfig.pass}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, pass: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">收件人邮箱 (To)</label>
            <input
              type="email"
              value={smtpConfig.to}
              onChange={(e) => setSmtpConfig({ ...smtpConfig, to: e.target.value })}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={() => handleTestNotification("SMTP")}
              disabled={testingChannel === "SMTP" || !smtpConfig.host || !smtpConfig.to}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {testingChannel === "SMTP" ? "测试发送中..." : "发送测试邮件"}
            </button>
            <button
              onClick={() => handleSaveConfig("SMTP")}
              disabled={savingChannel === "SMTP"}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              {savingChannel === "SMTP" ? "正在保存..." : "保存 SMTP 配置"}
            </button>
          </div>
        </div>
      </div>

      {/* 推送审计日志 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            最近推送审计历史 (Recent Notification Dispatch Logs)
          </h2>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">暂无推送记录</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        log.status === "SENT"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="font-semibold text-slate-900">{log.title}</span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-3">
                    <span>通道: {log.channel}</span>
                    <span>目标: {log.recipient}</span>
                    {log.errorMsg && <span className="text-rose-600">错误: {log.errorMsg}</span>}
                  </div>
                </div>

                <div className="text-slate-400">
                  {new Date(log.sentAt).toLocaleString("zh-CN")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
