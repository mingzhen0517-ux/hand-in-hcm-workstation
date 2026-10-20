import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "HR Workstation - 智能人力资源工作台",
  description: "面向现代人力资源团队的模块化、可插拔 AI 自动化与提效工作台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          HR Workstation (AI Empowered) · 基于微内核插件 Agent 架构 · 支持自动化后台监控与即时推送
        </footer>
      </body>
    </html>
  );
}
