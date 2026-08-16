import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const bin = (name) => path.join(root, "node_modules", ".bin", name);

// Normalize the Postgres URL from Vercel marketplace env-var names.
const dbUrl =
  [
    process.env.POSTGRES_PRISMA_URL,
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL_UNPOOLED,
  ].find((u) => u && /^postgres(ql)?:\/\//.test(u)) ?? null;

if (dbUrl) process.env.DATABASE_URL = dbUrl;

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(bin("prisma"), ["generate"]);

if (dbUrl) {
  run(bin("prisma"), ["migrate", "deploy"]);
  run(bin("tsx"), ["prisma/seed.ts"]);
} else {
  console.log(
    "No Postgres DATABASE_URL configured — building in read-only mode (static content only). " +
      "Create a Postgres database in Vercel → Storage to enable the CMS.",
  );
}

run(bin("next"), ["build"]);
