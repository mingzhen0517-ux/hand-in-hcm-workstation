import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { featureCode, userRole, feedback } = body;

    if (!featureCode) {
      return NextResponse.json({ success: false, error: "featureCode is required" }, { status: 400 });
    }

    const log = await prisma.featureRequestLog.create({
      data: {
        featureCode,
        userRole: userRole || "HR_STAFF",
        feedback: feedback || null,
      },
    });

    // Get current total votes for this feature
    const totalVotes = await prisma.featureRequestLog.count({
      where: { featureCode },
    });

    return NextResponse.json({
      success: true,
      data: log,
      totalVotes,
      message: "已成功记录您的需求期待！该功能的优先级排名已提升。",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const ranking = await prisma.featureRequestLog.groupBy({
      by: ["featureCode"],
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          featureCode: "desc",
        },
      },
    });

    const features = await prisma.featureItem.findMany();
    const featureMap = new Map(features.map((f) => [f.code, f]));

    const result = ranking.map((r) => {
      const f = featureMap.get(r.featureCode);
      return {
        featureCode: r.featureCode,
        votes: r._count._all,
        title: f?.title || r.featureCode,
        category: f?.category || "OTHER",
        efficiency: f?.efficiency || "待评测",
      };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
