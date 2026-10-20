import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    const tasks = await prisma.automationTask.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      total: await prisma.automationTask.count(),
      running: await prisma.automationTask.count({ where: { status: "RUNNING" } }),
      success: await prisma.automationTask.count({ where: { status: "SUCCESS" } }),
      failed: await prisma.automationTask.count({ where: { status: "FAILED" } }),
    };

    return NextResponse.json({ success: true, data: { tasks, stats } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
