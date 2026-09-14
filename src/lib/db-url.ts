/**
 * Resolve Postgres connection strings from Vercel / Neon / Supabase env vars.
 * Handles prefixed names (e.g. SANGEET_SANGRAH_DATABASE_URL) and discrete PG* vars.
 */

function isPostgresUrl(value: string): boolean {
  return /^postgres(ql)?:\/\//.test(value);
}

function buildFromPgParts(env: NodeJS.ProcessEnv, prefix = ""): string | null {
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

export type DbUrlResolution = {
  url: string;
  source: string;
};

export function resolveDatabaseUrl(): DbUrlResolution | null {
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
    const val = process.env[key];
    if (val && isPostgresUrl(val)) return { url: val, source: key };
  }

  for (const [key, val] of Object.entries(process.env)) {
    if (!val || !isPostgresUrl(val)) continue;
    if (/DATABASE_URL|POSTGRES_URL|PRISMA_URL/i.test(key)) {
      return { url: val, source: key };
    }
  }

  const direct = buildFromPgParts(process.env, "");
  if (direct) return { url: direct, source: "PGHOST+PGUSER+..." };

  for (const key of Object.keys(process.env)) {
    const m = key.match(/^(.+_)PGHOST$/);
    if (m) {
      const built = buildFromPgParts(process.env, m[1]);
      if (built) return { url: built, source: `${m[1]}PGHOST+...` };
    }
  }

  return null;
}

/** Env var names related to Postgres (for diagnostics — never log values). */
export function listDatabaseEnvKeys(): string[] {
  const pattern =
    /^(.*)(DATABASE_URL|POSTGRES_URL|PGHOST|PGUSER|PGPASSWORD|PGDATABASE|POSTGRES_)/i;
  return Object.keys(process.env).filter((k) => pattern.test(k)).sort();
}

/** Normalize so Prisma always reads DATABASE_URL. Returns null when no DB configured. */
export function ensureDatabaseUrl(): string | null {
  const resolved = resolveDatabaseUrl();
  if (!resolved) return null;
  process.env.DATABASE_URL = resolved.url;
  return resolved.url;
}

export function hasDatabase(): boolean {
  return resolveDatabaseUrl() !== null;
}

export function getDatabaseDiagnostics(): {
  configured: boolean;
  source: string | null;
  envKeysFound: string[];
} {
  const resolved = resolveDatabaseUrl();
  return {
    configured: resolved !== null,
    source: resolved?.source ?? null,
    envKeysFound: listDatabaseEnvKeys(),
  };
}
