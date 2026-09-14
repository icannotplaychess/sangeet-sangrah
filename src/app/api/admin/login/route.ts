import { NextResponse } from "next/server";
import {
  createAdminSession,
  hasAdminPassword,
  setSessionCookie,
  verifyAdminPassword,
} from "@/lib/auth";
import { hasDatabase } from "@/lib/db-url";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };

  if (!hasAdminPassword()) {
    return NextResponse.json(
      {
        error:
          "Admin password सेट केलेला नाही. Vercel → Environment Variables मध्ये SANGEET_ADMIN_PASSWORD जोडा, नंतर Redeploy करा.",
      },
      { status: 503 },
    );
  }

  if (!hasDatabase()) {
    return NextResponse.json(
      {
        error:
          "Database अजून जोडलेला नाही. Vercel → Storage → Create Database → Neon (Postgres) → project ला connect करा, नंतर Deployments मध्ये Redeploy करा.",
      },
      { status: 503 },
    );
  }

  if (!body.password || !(await verifyAdminPassword(body.password))) {
    return NextResponse.json({ error: "चुकीचा संकेतशब्द." }, { status: 401 });
  }

  try {
    const token = await createAdminSession();
    await setSessionCookie(token);
  } catch {
    return NextResponse.json(
      {
        error:
          "Database जोडला आहे, पण अजून तयार नाही. Vercel → Deployments → ⋯ → Redeploy करा म्हणजे tables तयार होतील.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
