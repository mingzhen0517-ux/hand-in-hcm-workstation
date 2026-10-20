import { prisma } from "@/lib/prisma";
import { getAgentByCode } from "@/features/registry";
import { sendNotification } from "./notification";

export async function createAndRunTask(params: {
  agentCode: string;
  title: string;
  input: any;
  totalCount?: number;
}) {
  const task = await prisma.automationTask.create({
    data: {
      agentCode: params.agentCode,
      title: params.title,
      status: "PENDING",
      progress: 0,
      totalCount: params.totalCount || 1,
      processedCount: 0,
      startedAt: new Date(),
    },
  });

  // Asynchronously trigger execution in background without blocking response
  runBackgroundTask(task.id, params.agentCode, params.input).catch((err) => {
    console.error(`Task ${task.id} execution uncaught failure:`, err);
  });

  return task;
}

async function runBackgroundTask(taskId: string, agentCode: string, input: any) {
  const agent = getAgentByCode(agentCode);
  if (!agent) {
    await prisma.automationTask.update({
      where: { id: taskId },
      data: {
        status: "FAILED",
        errorDetail: `Agent not found for code: ${agentCode}`,
        finishedAt: new Date(),
      },
    });
    return;
  }

  // Update status to RUNNING
  await prisma.automationTask.update({
    where: { id: taskId },
    data: { status: "RUNNING", startedAt: new Date() },
  });

  try {
    const result = await agent.execute(input, async (progress, message) => {
      await prisma.automationTask.update({
        where: { id: taskId },
        data: {
          progress: Math.min(Math.max(progress, 0), 100),
          errorDetail: message, // transient progress message
        },
      });
    });

    // Mark SUCCESS
    const finishedTask = await prisma.automationTask.update({
      where: { id: taskId },
      data: {
        status: "SUCCESS",
        progress: 100,
        processedCount: input?.resumes ? input.resumes.length : 1,
        successCount: input?.resumes ? input.resumes.length : 1,
        resultSummary: JSON.stringify(result),
        errorDetail: null,
        finishedAt: new Date(),
      },
    });

    // Trigger Notification
    await sendNotification({
      taskId: finishedTask.id,
      title: `自动化任务成功完成: ${finishedTask.title}`,
      content: `任务编号: ${finishedTask.id}\n执行Agent: ${agent.metadata.title}\n处理总数: ${finishedTask.processedCount}\n完成时间: ${new Date().toLocaleString("zh-CN")}`,
      eventType: "COMPLETED",
      metadata: { taskId: finishedTask.id, agentCode },
    });
  } catch (err: any) {
    console.error(`Error executing task ${taskId}:`, err);
    const failedTask = await prisma.automationTask.update({
      where: { id: taskId },
      data: {
        status: "FAILED",
        errorDetail: err?.message || String(err),
        finishedAt: new Date(),
      },
    });

    // Trigger Failure Notification
    await sendNotification({
      taskId: failedTask.id,
      title: `自动化任务执行失败: ${failedTask.title}`,
      content: `任务编号: ${failedTask.id}\n执行Agent: ${agent.metadata.title}\n异常原因: ${failedTask.errorDetail}\n发生时间: ${new Date().toLocaleString("zh-CN")}`,
      eventType: "FAILED",
      metadata: { taskId: failedTask.id, error: failedTask.errorDetail },
    });
  }
}
