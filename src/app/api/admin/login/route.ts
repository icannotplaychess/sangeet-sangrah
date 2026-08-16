import { NextResponse } from "next/server";
import {
  createAdminSession,
  setSessionCookie,
  verifyAdminPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  if (!body.password || !(await verifyAdminPassword(body.password))) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const token = await createAdminSession();
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
