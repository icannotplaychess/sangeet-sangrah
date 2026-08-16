import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const bin = (name) => path.join(root, "node_modules", ".bin", name);

process.env.DATABASE_URL ||= `file:${path.join(root, "prisma", "dev.db")}`;
process.env.ADMIN_SECRET ||= "vercel-build-placeholder-change-me";

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
run(bin("prisma"), ["migrate", "deploy"]);
run(bin("tsx"), ["prisma/seed.ts"]);
run(bin("next"), ["build"]);
