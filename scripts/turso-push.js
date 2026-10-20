import { createClient } from "@libsql/client";
import { execSync } from "child_process";
import fs from "fs";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in environment or .env");
  process.exit(1);
}

console.log("Generating SQL migration script from Prisma schema...");
const sql = execSync("npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script", {
  encoding: "utf-8",
});

console.log(`Connecting to Turso: ${url}...`);
const client = createClient({ url, authToken });

async function run() {
  // Execute multi-statement SQL batch
  console.log("Executing SQL schema on Turso database...");
  await client.executeMultiple(sql);
  console.log("Turso schema synced successfully!");
}

run()
  .catch((e) => {
    console.error("Error pushing schema to Turso:", e);
    process.exit(1);
  })
  .finally(() => {
    client.close();
  });
