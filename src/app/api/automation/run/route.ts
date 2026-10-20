import { NextResponse } from "next/server";
import { createAndRunTask } from "@/services/task-runner";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agentCode, title, input, totalCount } = body;

    if (!agentCode || !title) {
      return NextResponse.json(
        { success: false, error: "agentCode and title are required" },
        { status: 400 }
      );
    }

    const task = await createAndRunTask({
      agentCode,
      title,
      input,
      totalCount: totalCount || (input?.resumes ? input.resumes.length : 1),
    });

    return NextResponse.json({
      success: true,
      data: task,
      message: "自动化任务已创建并在后台启动运行",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
