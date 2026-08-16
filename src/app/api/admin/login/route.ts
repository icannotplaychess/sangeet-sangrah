import { NextResponse } from "next/server";
import {
  createAdminSession,
  setSessionCookie,
  verifyAdminPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD सेट केलेला नाही. Vercel → Settings → Environment Variables मध्ये जोडा." },
      { status: 503 },
    );
  }

  if (!body.password || !(await verifyAdminPassword(body.password))) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  try {
    const token = await createAdminSession();
    await setSessionCookie(token);
  } catch {
    return NextResponse.json(
      { error: "डेटाबेस जोडलेला नाही. Vercel → Storage मध्ये Postgres database तयार करा." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
