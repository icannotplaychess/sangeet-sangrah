/**
 * Resolve the Postgres connection string from the env-var names used by
 * Vercel marketplace integrations (Neon, Supabase) and plain setups.
 */
export function resolveDatabaseUrl(): string | null {
  const candidates = [
    process.env.POSTGRES_PRISMA_URL,
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL_UNPOOLED,
  ];
  for (const url of candidates) {
    if (url && /^postgres(ql)?:\/\//.test(url)) return url;
  }
  return null;
}

/** Normalize so Prisma always reads DATABASE_URL. Returns null when no DB configured. */
export function ensureDatabaseUrl(): string | null {
  const url = resolveDatabaseUrl();
  if (url) process.env.DATABASE_URL = url;
  return url;
}

export function hasDatabase(): boolean {
  return resolveDatabaseUrl() !== null;
}
