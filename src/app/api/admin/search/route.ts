import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { adminSearch } from "@/lib/repository";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = new URL(request.url).searchParams.get("q") ?? "";
  const results = await adminSearch(q);
  return NextResponse.json(results);
}
