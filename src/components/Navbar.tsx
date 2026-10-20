"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Briefcase, 
  Activity, 
  BellRing, 
  Database, 
  Layers,
  Sparkles,
  DownloadCloud
} from "lucide-react";
import { DeploymentGuideModal } from "./DeploymentGuideModal";

export function Navbar() {
  const pathname = usePathname();
  const [showDeployGuide, setShowDeployGuide] = useState(false);

  const navItems = [
    { name: "工作台总览", href: "/", icon: Layers },
    { name: "智能招聘中心", href: "/recruitment", icon: Briefcase },
    { name: "自动化监控", href: "/automation", icon: Activity },
    { name: "通知推送中心", href: "/notifications", icon: BellRing },
    { name: "数据集成中心", href: "/data-hub", icon: Database },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-md shadow-indigo-100">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 tracking-tight">HR Workstation</span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AI 赋能版
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-1 sm:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-semibold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                    <span className="hidden md:inline">{item.name}</span>
                  </Link>
                );
              })}

              <button
                onClick={() => setShowDeployGuide(true)}
                className="ml-2 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 flex items-center gap-1.5 transition-all shadow-2xs"
                title="本地私有部署此系统"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>私有部署</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <DeploymentGuideModal
        isOpen={showDeployGuide}
        onClose={() => setShowDeployGuide(false)}
      />
    </>
  );
}
