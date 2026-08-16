import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { parseJson } from "./json";
import type { ArticleBlock } from "./article-types";
import type { Artist, Song, SongType } from "@/data/types";

export type DbSong = {
  id: string;
  slug: string;
  title: string;
  latinTitle: string | null;
  singers: string[];
  lyricist: string;
  composer: string;
  filmOrAlbum: string | null;
  year: string | null;
  language: string;
  type: string;
  raga: string | null;
  taal: string | null;
  theme: string | null;
  excerpt: string[];
  context: string[];
  meaning: string[];
  musicAnalysis: string[];
  culturalContext: string[];
  legacy: string[];
  description: string | null;
  tags: string[];
  relatedArtistSlugs: string[];
  audio: {
    url: string;
    source: string;
    filename: string | null;
    uploadedAt: Date | null;
  } | null;
  youtube: {
    videoId: string;
    url: string;
  } | null;
  sources: DbSource[];
  status: string;
};

export type DbArtist = {
  id: string;
  slug: string;
  name: string;
  latinName: string | null;
  categories: string[];
  meta: string | null;
  period: string | null;
  birthDate: string | null;
  birthPlace: string | null;
  portraitUrl: string | null;
  intro: string[];
  timeline: { year: string; event: string }[];
  contribution: string[];
  style: string[];
  notableSongSlugs: string[];
  notableWorks: string[];
  collaborations: string[];
  facts: string[];
  related: string[];
  tags: string[];
  sources: DbSource[];
  status: string;
};

export type DbSource = {
  id: string;
  title: string;
  author: string | null;
  publication: string | null;
  url: string | null;
  year: string | null;
  notes: string | null;
  sourceType: string;
};

export type DbArticle = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  type: string;
  heroImage: string | null;
  author: string | null;
  summary: string | null;
  content: ArticleBlock[];
  tags: string[];
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  sources: DbSource[];
  linkedSongs: { slug: string; title: string }[];
  linkedArtists: { slug: string; name: string }[];
};

const songInclude = {
  audioAsset: true,
  youtubeVideo: true,
  sources: true,
} satisfies Prisma.SongInclude;

function mapSource(s: {
  id: string;
  title: string;
  author: string | null;
  publication: string | null;
  url: string | null;
  year: string | null;
  notes: string | null;
  sourceType: string;
}): DbSource {
  return {
    id: s.id,
    title: s.title,
    author: s.author,
    publication: s.publication,
    url: s.url,
    year: s.year,
    notes: s.notes,
    sourceType: s.sourceType,
  };
}

export function mapDbSong(
  row: Prisma.SongGetPayload<{ include: typeof songInclude }>,
  relatedArtistSlugs: string[] = [],
): DbSong {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    latinTitle: row.latinTitle,
    singers: parseJson<string[]>(row.singers, []),
    lyricist: row.lyricist,
    composer: row.composer,
    filmOrAlbum: row.filmOrAlbum,
    year: row.year,
    language: row.language,
    type: row.type,
    raga: row.raga,
    taal: row.taal,
    theme: row.theme,
    excerpt: parseJson<string[]>(row.excerpt, []),
    context: parseJson<string[]>(row.context, []),
    meaning: parseJson<string[]>(row.meaning, []),
    musicAnalysis: parseJson<string[]>(row.musicAnalysis, []),
    culturalContext: parseJson<string[]>(row.culturalContext, []),
    legacy: parseJson<string[]>(row.legacy, []),
    description: row.description,
    tags: parseJson<string[]>(row.tags, []),
    relatedArtistSlugs,
    audio: row.audioAsset
      ? {
          url: row.audioAsset.audioUrl,
          source: row.audioAsset.audioSource,
          filename: row.audioAsset.audioFilename,
          uploadedAt: row.audioAsset.uploadedAt,
        }
      : null,
    youtube: row.youtubeVideo
      ? { videoId: row.youtubeVideo.youtubeVideoId, url: row.youtubeVideo.youtubeUrl }
      : null,
    sources: row.sources.map(mapSource),
    status: row.status,
  };
}

export function mapDbSongToLegacy(song: DbSong): Song {
  return {
    slug: song.slug,
    title: song.title,
    latinTitle: song.latinTitle ?? song.title,
    singers: song.singers,
    lyricist: song.lyricist,
    composer: song.composer,
    filmOrAlbum: song.filmOrAlbum ?? undefined,
    year: song.year ?? undefined,
    language: song.language,
    type: song.type as SongType,
    raga: song.raga ?? undefined,
    taal: song.taal ?? undefined,
    theme: song.theme ?? "",
    excerpt: song.excerpt.length ? song.excerpt : undefined,
    context: song.context,
    meaning: song.meaning,
    musicAnalysis: song.musicAnalysis,
    culturalContext: song.culturalContext,
    relatedArtistSlugs: song.relatedArtistSlugs,
    tags: song.tags,
  };
}

export function mapDbArtist(row: Prisma.ArtistGetPayload<{ include: { sources: true } }>): DbArtist {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    latinName: row.latinName,
    categories: parseJson<string[]>(row.categories, []),
    meta: row.meta,
    period: row.period,
    birthDate: row.birthDate,
    birthPlace: row.birthPlace,
    portraitUrl: row.portraitUrl,
    intro: parseJson<string[]>(row.intro, []),
    timeline: parseJson<{ year: string; event: string }[]>(row.timeline, []),
    contribution: parseJson<string[]>(row.contribution, []),
    style: parseJson<string[]>(row.style, []),
    notableSongSlugs: parseJson<string[]>(row.notableSongSlugs, []),
    notableWorks: parseJson<string[]>(row.notableWorks, []),
    collaborations: parseJson<string[]>(row.collaborations, []),
    facts: parseJson<string[]>(row.facts, []),
    related: parseJson<string[]>(row.related, []),
    tags: parseJson<string[]>(row.tags, []),
    sources: row.sources.map(mapSource),
    status: row.status,
  };
}

export function mapDbArtistToLegacy(artist: DbArtist): Artist {
  return {
    slug: artist.slug,
    name: artist.name,
    latinName: artist.latinName ?? artist.name,
    categories: artist.categories as Artist["categories"],
    meta: artist.meta ?? "",
    period: artist.period ?? "",
    intro: artist.intro,
    timeline: artist.timeline,
    contribution: artist.contribution,
    notableSongSlugs: artist.notableSongSlugs,
    notableWorks: artist.notableWorks.length ? artist.notableWorks : undefined,
    collaborations: artist.collaborations,
    style: artist.style,
    facts: artist.facts,
    related: artist.related,
    tags: artist.tags,
  };
}

export async function getPublishedSongs(): Promise<DbSong[]> {
  const rows = await prisma.song.findMany({
    where: { status: "PUBLISHED" },
    include: songInclude,
    orderBy: { title: "asc" },
  });
  const staticRelated = await getStaticRelatedMap();
  return rows.map((r) => mapDbSong(r, staticRelated.get(r.slug) ?? []));
}

export async function getSongBySlug(slug: string): Promise<DbSong | null> {
  const row = await prisma.song.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: songInclude,
  });
  if (!row) return null;
  const staticRelated = await getStaticRelatedMap();
  return mapDbSong(row, staticRelated.get(slug) ?? []);
}

export async function getArtistBySlug(slug: string): Promise<DbArtist | null> {
  const row = await prisma.artist.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { sources: true },
  });
  return row ? mapDbArtist(row) : null;
}

export async function getPublishedArtists(): Promise<DbArtist[]> {
  const rows = await prisma.artist.findMany({
    where: { status: "PUBLISHED" },
    include: { sources: true },
    orderBy: { name: "asc" },
  });
  return rows.map(mapDbArtist);
}

export async function getPublishedArticle(slug: string): Promise<DbArticle | null> {
  const row = await prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      sources: true,
      entities: {
        include: {
          song: { select: { slug: true, title: true } },
          artist: { select: { slug: true, name: true } },
        },
      },
    },
  });
  if (!row) return null;
  return mapDbArticle(row);
}

export async function getArticlesForSong(songId: string) {
  const links = await prisma.articleEntity.findMany({
    where: { songId, article: { status: "PUBLISHED" } },
    include: { article: { select: { slug: true, title: true, type: true } } },
  });
  return links.map((l) => ({
    slug: l.article.slug,
    title: l.article.title,
    type: l.article.type,
  }));
}

function mapDbArticle(
  row: Prisma.ArticleGetPayload<{
    include: {
      sources: true;
      entities: {
        include: {
          song: { select: { slug: true; title: true } };
          artist: { select: { slug: true; name: true } };
        };
      };
    };
  }>,
): DbArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    type: row.type,
    heroImage: row.heroImage,
    author: row.author,
    summary: row.summary,
    content: parseJson<ArticleBlock[]>(row.content, []),
    tags: parseJson<string[]>(row.tags, []),
    status: row.status,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    sources: row.sources.map(mapSource),
    linkedSongs: row.entities.filter((e) => e.song).map((e) => e.song!),
    linkedArtists: row.entities.filter((e) => e.artist).map((e) => e.artist!),
  };
}

let relatedMapCache: Map<string, string[]> | null = null;

async function getStaticRelatedMap(): Promise<Map<string, string[]>> {
  if (relatedMapCache) return relatedMapCache;
  const { songs } = await import("@/data/songs");
  relatedMapCache = new Map(songs.map((s) => [s.slug, s.relatedArtistSlugs]));
  return relatedMapCache;
}

export async function getAdminStats() {
  const [songs, artists, articles, drafts, published] = await Promise.all([
    prisma.song.count(),
    prisma.artist.count(),
    prisma.article.count(),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
  ]);

  const { poems } = await import("@/data/poems");
  const { facts } = await import("@/data/facts");
  const { quizQuestions } = await import("@/data/quiz");

  const recentSongs = await prisma.song.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: { slug: true, title: true, updatedAt: true },
  });
  const recentArticles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
    select: { slug: true, title: true, status: true, updatedAt: true },
  });

  return {
    counts: {
      songs,
      artists,
      poems: poems.length,
      articles,
      facts: facts.length,
      quiz: quizQuestions.length,
      drafts,
      published,
    },
    recentSongs,
    recentArticles,
  };
}

export async function adminSearch(query: string) {
  const q = query.trim();
  if (q.length < 2) return [];

  const [songHits, artistHits, articleHits] = await Promise.all([
    prisma.song.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { lyricist: { contains: q } },
          { composer: { contains: q } },
          { singers: { contains: q } },
        ],
      },
      take: 10,
      select: { id: true, slug: true, title: true, lyricist: true, composer: true },
    }),
    prisma.artist.findMany({
      where: { OR: [{ name: { contains: q } }, { latinName: { contains: q } }] },
      take: 10,
      select: { id: true, slug: true, name: true, categories: true },
    }),
    prisma.article.findMany({
      where: { OR: [{ title: { contains: q } }, { summary: { contains: q } }] },
      take: 10,
      select: { id: true, slug: true, title: true, status: true, type: true },
    }),
  ]);

  return [
    ...artistHits.map((a) => ({
      kind: "artist" as const,
      id: a.id,
      slug: a.slug,
      title: a.name,
      subtitle: parseJson<string[]>(a.categories, []).join(" • "),
      href: `/admin/kalakar/${a.slug}`,
    })),
    ...songHits.map((s) => ({
      kind: "song" as const,
      id: s.id,
      slug: s.slug,
      title: s.title,
      subtitle: `${s.lyricist} • ${s.composer}`,
      href: `/admin/geete/${s.slug}`,
    })),
    ...articleHits.map((a) => ({
      kind: "article" as const,
      id: a.id,
      slug: a.slug,
      title: a.title,
      subtitle: `${a.type} • ${a.status}`,
      href: `/admin/lekh/${a.slug}`,
    })),
  ];
}
