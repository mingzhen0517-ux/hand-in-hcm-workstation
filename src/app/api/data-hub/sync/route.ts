import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { configId, directUrl } = body;

    let targetUrl = directUrl;
    let authHeader = "";

    if (configId) {
      const config = await prisma.dataSourceConfig.findUnique({
        where: { id: configId },
      });
      if (config) {
        targetUrl = config.endpointUrl;
        const parsedAuth = JSON.parse(config.authConfig || "{}");
        if (parsedAuth.token) {
          authHeader = `Bearer ${parsedAuth.token}`;
        }
      }
    }

    if (!targetUrl) {
      targetUrl = "/api/mock/hcm-candidates";
    }

    // Resolve relative URL if needed
    const url = targetUrl.startsWith("http")
      ? targetUrl
      : `http://localhost:${process.env.PORT || 3000}${targetUrl}`;

    const res = await fetch(url, {
      headers: authHeader ? { Authorization: authHeader } : {},
    });

    if (!res.ok) {
      throw new Error(`外部 API 请求失败，状态码: ${res.status}`);
    }

    const json = await res.json();
    const items: any[] = Array.isArray(json) ? json : json.data || [];

    let syncedCount = 0;
    for (const item of items) {
      await prisma.candidate.create({
        data: {
          name: item.name || "未命名",
          phone: item.phone || null,
          email: item.email || null,
          positionApplied: item.positionApplied || "外部同步岗位",
          yearsExp: item.yearsExp || 0,
          skills: JSON.stringify(item.skills || []),
          source: "API_SYNC",
          status: "NEW",
          resumeText: item.resumeText || `${item.name} 来自外部系统自动拉取同步`,
        },
      });
      syncedCount++;
    }

    if (configId) {
      await prisma.dataSourceConfig.update({
        where: { id: configId },
        data: { lastSyncAt: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      message: `成功从外部 API 拉取并入库 ${syncedCount} 条员工/候选人档案！`,
      syncedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const configs = await prisma.dataSourceConfig.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: configs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
