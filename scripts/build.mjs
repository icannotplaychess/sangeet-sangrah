import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listDatabaseEnvKeys, resolveDatabaseUrl } from "./resolve-db-url.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const bin = (name) => path.join(root, "node_modules", ".bin", name);

const resolved = resolveDatabaseUrl(process.env);

if (resolved) {
  process.env.DATABASE_URL = resolved.url;
  console.log(`Database configured via ${resolved.source}`);
} else {
  const keys = listDatabaseEnvKeys(process.env);
  if (keys.length > 0) {
    console.log(`Database env keys present but no URL resolved: ${keys.join(", ")}`);
  }
}

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

if (resolved) {
  // Neon migrations work best with a direct (non-pooled) connection
  const unpooled =
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.POSTGRES_URL_NO_SSL;
  if (unpooled && /^postgres(ql)?:\/\//.test(unpooled)) {
    process.env.DATABASE_URL = unpooled;
  }
  run(bin("prisma"), ["migrate", "deploy"]);
  process.env.DATABASE_URL = resolved.url;
  run(bin("tsx"), ["prisma/seed.ts"]);
} else {
  console.log(
    "No Postgres connection found — building in read-only mode (static content only). " +
      "In Vercel: Storage → your database → Projects tab → Connect Project → Production, then Redeploy.",
  );
}

run(bin("next"), ["build"]);
