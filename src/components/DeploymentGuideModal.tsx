"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, X, Laptop, Key } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DeploymentGuideModal({ isOpen, onClose }: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: "1. 克隆代码仓库",
      desc: "拉取最新版 Hand-in HCM 完整代码到本地机器：",
      code: "git clone https://github.com/mingzhen0517-ux/hand-in-hcm-workstation.git\ncd hand-in-hcm-workstation",
    },
    {
      title: "2. 安装依赖",
      desc: "安装 Next.js 及 Prisma 边缘驱动包：",
      code: "npm install",
    },
    {
      title: "3. 配置您私有的 API Key (.env)",
      desc: "复制环境变量模板并填入您的 OpenAI / DeepSeek / 通义千问等兼容 API Key：",
      code: 'cp .env.example .env\n\n# 编辑 .env 文件：\nDATABASE_URL="file:./dev.db"\nOPENAI_API_KEY="sk-your-private-key-here"\nOPENAI_BASE_URL="https://api.openai.com/v1"\nOPENAI_MODEL="gpt-4o"',
    },
    {
      title: "4. 初始化本地 SQLite 数据库与预置数据",
      desc: "一键执行数据库建表与业务清单预填充：",
      code: "npm run db:push\nnpm run seed",
    },
    {
      title: "5. 启动私有工作台",
      desc: "启动本地开发服务器，开始私有体验：",
      code: "npm run dev",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150 my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">本地私有化部署指南</h3>
            <p className="text-xs text-slate-500">
              数据 100% 留存在您本地 SQLite，支持接入您自有的大模型 API Key 无限制使用
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <Key className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">云端演示版与本地版区别：</span>
              当前 Vercel Demo 运行在公共云端，出于安全防范对大模型调用做了保护或额度限流；本地部署只需配置您自己的 API Key，数据与生成完全属于您自己。
            </div>
          </div>

          {steps.map((step, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>{step.title}</span>
                <button
                  onClick={() => copyToClipboard(step.code, idx)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-600">{step.desc}</p>
              <pre className="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed">
                {step.code}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <a
            href="https://github.com/mingzhen0517-ux/hand-in-hcm-workstation"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            访问 GitHub 仓库源码
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            知道了，开始探索
          </button>
        </div>
      </div>
    </div>
  );
}
