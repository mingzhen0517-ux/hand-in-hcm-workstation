import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const category = searchParams.get("category");

    const features = await prisma.featureItem.findMany({
      orderBy: { order: "asc" },
    });

    let filtered = features;
    if (role && role !== "ALL") {
      filtered = filtered.filter((f) => {
        try {
          const tags: string[] = JSON.parse(f.roleTags || "[]");
          return tags.includes(role);
        } catch {
          return true;
        }
      });
    }

    if (category && category !== "ALL") {
      filtered = filtered.filter((f) => f.category === category);
    }

    // Also get request logs count per feature for ranking
    const counts = await prisma.featureRequestLog.groupBy({
      by: ["featureCode"],
      _count: {
        _all: true,
      },
    });

    const countMap: Record<string, number> = {};
    for (const c of counts) {
      countMap[c.featureCode] = c._count._all;
    }

    const featuresWithVotes = filtered.map((f) => ({
      ...f,
      votes: countMap[f.code] || 0,
    }));

    return NextResponse.json({ success: true, data: featuresWithVotes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
