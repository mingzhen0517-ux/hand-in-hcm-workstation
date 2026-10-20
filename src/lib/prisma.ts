import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL || "";
  const databaseUrl = process.env.DATABASE_URL || "";
  const effectiveUrl = tursoUrl || databaseUrl;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // 1. 如果配置了 Turso 云端数据库 (libsql:// 或 https://)
  if (effectiveUrl.startsWith("libsql://") || effectiveUrl.startsWith("https://")) {
    const libsql = createClient({
      url: effectiveUrl,
      authToken,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  // 2. 本地直接使用标准 SQLite 引擎
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = global.__prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
