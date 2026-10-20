import { NextResponse } from "next/server";
import { sendNotification } from "@/services/notification";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { channel } = body;

    const result = await sendNotification({
      title: "【连通性测试】HR 智能工作台测试推送",
      content: `这是一条来自 HR 智能工作台的测试通知。\n发送通道: ${channel || "全部已启用通道"}\n时间: ${new Date().toLocaleString("zh-CN")}\n系统状态: 正常运行中`,
      eventType: "TEST",
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "测试通知已派发，请检查目标渠道（若未收到请检查账号/Token/网络配置）",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
