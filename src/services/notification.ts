import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export interface NotificationPayload {
  taskId?: string;
  title: string;
  content: string;
  eventType: "COMPLETED" | "FAILED" | "TEST";
  metadata?: Record<string, unknown>;
}

export async function sendNotification(payload: NotificationPayload) {
  const configs = await prisma.notificationConfig.findMany({
    where: { isEnabled: true },
  });

  const results = [];

  for (const config of configs) {
    // Check trigger events
    const triggerEvents = (config.triggerEvents || "").split(",").map((s) => s.trim());
    if (payload.eventType !== "TEST" && !triggerEvents.includes(payload.eventType)) {
      continue;
    }

    try {
      const settings = JSON.parse(config.settingsJson || "{}");

      if (config.channel === "SMTP") {
        const result = await sendEmailNotification(settings, payload);
        results.push(result);
      } else if (config.channel === "WEBHOOK") {
        const result = await sendWebhookNotification(settings, payload);
        results.push(result);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Failed to dispatch notification for channel ${config.channel}:`, err);
      await prisma.notificationLog.create({
        data: {
          taskId: payload.taskId,
          channel: config.channel,
          recipient: "ERROR",
          title: payload.title,
          content: payload.content,
          status: "FAILED",
          errorMsg: errorMessage,
        },
      });
      results.push({ channel: config.channel, success: false, error: errorMessage });
    }
  }

  return results;
}

async function sendEmailNotification(settings: Record<string, unknown>, payload: NotificationPayload) {
  const { host, port, secure, user, pass, from, to } = settings as Record<string, string>;

  if (!host || !to) {
    throw new Error("SMTP host or recipient 'to' not configured");
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port) || 465,
    secure: Boolean(secure),
    auth: user && pass ? { user, pass } : undefined,
  });

  const info = await transporter.sendMail({
    from: from || user,
    to,
    subject: payload.title,
    text: payload.content,
    html: `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #1e293b;">
      <h2 style="color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">${payload.title}</h2>
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #e2e8f0;">
        <pre style="white-space: pre-wrap; font-size: 14px; font-family: inherit;">${payload.content}</pre>
      </div>
      <p style="color: #64748b; font-size: 12px;">来自 HR 智能工作台自动化推送中心</p>
    </div>`,
  });

  await prisma.notificationLog.create({
    data: {
      taskId: payload.taskId,
      channel: "SMTP",
      recipient: to,
      title: payload.title,
      content: payload.content,
      status: "SENT",
    },
  });

  return { channel: "SMTP", success: true, messageId: info.messageId };
}

async function sendWebhookNotification(settings: Record<string, unknown>, payload: NotificationPayload) {
  const { url, serviceType } = settings as { url: string; serviceType?: string };

  if (!url) {
    throw new Error("Webhook URL is empty");
  }

  let body: Record<string, unknown>;

  if (serviceType === "FEISHU") {
    body = {
      msg_type: "text",
      content: {
        text: `【HR工作台通知】${payload.title}\n------------------------\n${payload.content}`,
      },
    };
  } else if (serviceType === "WECOM") {
    body = {
      msgtype: "text",
      text: {
        content: `【HR工作台通知】${payload.title}\n------------------------\n${payload.content}`,
      },
    };
  } else if (serviceType === "DINGTALK") {
    body = {
      msgtype: "text",
      text: {
        content: `【HR工作台通知】${payload.title}\n------------------------\n${payload.content}`,
      },
    };
  } else {
    // Custom JSON Webhook
    body = {
      title: payload.title,
      content: payload.content,
      eventType: payload.eventType,
      taskId: payload.taskId,
      metadata: payload.metadata,
      timestamp: new Date().toISOString(),
    };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Webhook endpoint responded with HTTP ${res.status}: ${errText}`);
  }

  await prisma.notificationLog.create({
    data: {
      taskId: payload.taskId,
      channel: "WEBHOOK",
      recipient: url,
      title: payload.title,
      content: payload.content,
      status: "SENT",
    },
  });

  return { channel: "WEBHOOK", success: true };
}
