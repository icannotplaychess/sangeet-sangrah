/** Shared Postgres URL resolution for build script (mirrors src/lib/db-url.ts). */

function isPostgresUrl(value) {
  return /^postgres(ql)?:\/\//.test(value);
}

function buildFromPgParts(env, prefix = "") {
  const host = env[`${prefix}PGHOST`] ?? env[`${prefix}POSTGRES_HOST`];
  const user = env[`${prefix}PGUSER`] ?? env[`${prefix}POSTGRES_USER`];
  const password = env[`${prefix}PGPASSWORD`] ?? env[`${prefix}POSTGRES_PASSWORD`];
  const database = env[`${prefix}PGDATABASE`] ?? env[`${prefix}POSTGRES_DATABASE`];
  if (!host || !user || !password || !database) return null;
  const port = env[`${prefix}PGPORT`] ?? env[`${prefix}POSTGRES_PORT`] ?? "5432";
  const encUser = encodeURIComponent(user);
  const encPass = encodeURIComponent(password);
  return `postgresql://${encUser}:${encPass}@${host}:${port}/${database}?sslmode=require`;
}

export function resolveDatabaseUrl(env = process.env) {
  const priorityKeys = [
    "POSTGRES_PRISMA_URL",
    "DATABASE_URL",
    "POSTGRES_URL",
    "DATABASE_URL_UNPOOLED",
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_URL_NO_SSL",
    "NEON_DATABASE_URL",
  ];

  for (const key of priorityKeys) {
    const val = env[key];
    if (val && isPostgresUrl(val)) return { url: val, source: key };
  }

  for (const [key, val] of Object.entries(env)) {
    if (!val || !isPostgresUrl(val)) continue;
    if (/DATABASE_URL|POSTGRES_URL|PRISMA_URL/i.test(key)) {
      return { url: val, source: key };
    }
  }

  const direct = buildFromPgParts(env, "");
  if (direct) return { url: direct, source: "PGHOST+PGUSER+..." };

  for (const key of Object.keys(env)) {
    const m = key.match(/^(.+_)PGHOST$/);
    if (m) {
      const built = buildFromPgParts(env, m[1]);
      if (built) return { url: built, source: `${m[1]}PGHOST+...` };
    }
  }

  return null;
}

export function listDatabaseEnvKeys(env = process.env) {
  const pattern = /^(.*)(DATABASE_URL|POSTGRES_URL|PGHOST|PGUSER|PGPASSWORD|PGDATABASE|POSTGRES_)/i;
  return Object.keys(env).filter((k) => pattern.test(k)).sort();
}
