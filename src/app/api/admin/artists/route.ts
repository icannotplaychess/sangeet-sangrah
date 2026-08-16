import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify, toJson } from "@/lib/json";

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "नाव आवश्यक." }, { status: 400 });

  const slug = body.slug?.trim() || slugify(name);
  const exists = await prisma.artist.findUnique({ where: { slug } });
  if (exists) return NextResponse.json({ error: "हा slug आधीच वापरात आहे." }, { status: 409 });

  const categories = Array.isArray(body.categories)
    ? body.categories
    : [body.category || "गायक"];

  const artist = await prisma.artist.create({
    data: {
      slug,
      name,
      latinName: body.latinName || null,
      categories: toJson(categories),
      meta: body.meta || null,
      period: body.period || null,
      birthDate: body.birthDate || null,
      birthPlace: body.birthPlace || null,
      portraitUrl: body.portraitUrl || null,
      intro: toJson(splitLines(body.intro)),
      timeline: toJson([]),
      contribution: toJson(splitLines(body.contribution)),
      style: toJson(splitLines(body.style)),
      notableSongSlugs: toJson(parseList(body.notableSongSlugs)),
      notableWorks: toJson(parseList(body.notableWorks)),
      collaborations: toJson([]),
      facts: toJson([]),
      related: toJson([]),
      tags: toJson(parseTags(body.tags)),
      status: body.status || "DRAFT",
      publishedAt: body.status === "PUBLISHED" ? new Date() : null,
    },
  });

  return NextResponse.json({ ok: true, slug: artist.slug });
}

function splitLines(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value.split("\n").map((s) => s.trim()).filter(Boolean);
  return [];
}

function parseList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string")
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

function parseTags(value: unknown): string[] {
  return parseList(value);
}
