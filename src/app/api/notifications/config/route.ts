import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const configs = await prisma.notificationConfig.findMany();
    const logs = await prisma.notificationLog.findMany({
      take: 20,
      orderBy: { sentAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        configs: configs.map((c) => ({
          ...c,
          settings: JSON.parse(c.settingsJson || "{}"),
        })),
        recentLogs: logs,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { channel, settings, isEnabled, triggerEvents } = body;

    if (!channel || !["SMTP", "WEBHOOK"].includes(channel)) {
      return NextResponse.json(
        { success: false, error: "channel must be SMTP or WEBHOOK" },
        { status: 400 }
      );
    }

    const config = await prisma.notificationConfig.upsert({
      where: { channel },
      update: {
        settingsJson: JSON.stringify(settings || {}),
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        triggerEvents: triggerEvents || "COMPLETED,FAILED",
      },
      create: {
        channel,
        settingsJson: JSON.stringify(settings || {}),
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        triggerEvents: triggerEvents || "COMPLETED,FAILED",
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...config,
        settings: JSON.parse(config.settingsJson),
      },
      message: "通知配置已保存",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
