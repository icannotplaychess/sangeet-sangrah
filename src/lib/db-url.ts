import path from "node:path";

/** Absolute SQLite URL so Prisma CLI and Prisma Client use the same file. */
export function defaultDatabaseUrl(): string {
  return `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
}

export function ensureDatabaseUrl(): string {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = defaultDatabaseUrl();
  }
  return process.env.DATABASE_URL;
}
