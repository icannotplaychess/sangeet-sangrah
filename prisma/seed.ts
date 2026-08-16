import { PrismaClient } from "@prisma/client";
import { ensureDatabaseUrl } from "../src/lib/db-url";
import { gayak } from "../src/data/artists-gayak";
import { sangeetkar } from "../src/data/artists-sangeetkar";
import { geetkar } from "../src/data/artists-geetkar";
import { kavi } from "../src/data/artists-kavi";
import { songs } from "../src/data/songs";
import { toJson } from "../src/lib/json";
import { paragraphsToBlocks } from "../src/lib/article-types";

if (!ensureDatabaseUrl()) {
  console.log("No DATABASE_URL configured — skipping seed.");
  process.exit(0);
}

const prisma = new PrismaClient();

const allArtists = [...gayak, ...sangeetkar, ...geetkar, ...kavi];

/**
 * Non-destructive seed: only creates records that don't exist yet.
 * Admin edits made through the CMS are never overwritten.
 */
async function main() {
  console.log("Seeding database (create-only, never overwrites)…");
  let createdArtists = 0;
  let createdSongs = 0;

  for (const artist of allArtists) {
    const exists = await prisma.artist.findUnique({
      where: { slug: artist.slug },
      select: { id: true },
    });
    if (exists) continue;
    await prisma.artist.create({
      data: {
        slug: artist.slug,
        name: artist.name,
        latinName: artist.latinName,
        categories: toJson(artist.categories),
        meta: artist.meta,
        period: artist.period,
        intro: toJson(artist.intro),
        timeline: toJson(artist.timeline),
        contribution: toJson(artist.contribution),
        style: toJson(artist.style),
        notableSongSlugs: toJson(artist.notableSongSlugs),
        notableWorks: toJson(artist.notableWorks ?? []),
        collaborations: toJson(artist.collaborations),
        facts: toJson(artist.facts),
        related: toJson(artist.related),
        tags: toJson(artist.tags),
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    createdArtists++;
  }

  for (const song of songs) {
    const exists = await prisma.song.findUnique({
      where: { slug: song.slug },
      select: { id: true },
    });
    if (exists) continue;
    await prisma.song.create({
      data: {
        slug: song.slug,
        title: song.title,
        latinTitle: song.latinTitle,
        singers: toJson(song.singers),
        lyricist: song.lyricist,
        composer: song.composer,
        filmOrAlbum: song.filmOrAlbum,
        year: song.year,
        language: song.language,
        type: song.type,
        raga: song.raga,
        taal: song.taal,
        theme: song.theme,
        excerpt: toJson(song.excerpt ?? []),
        context: toJson(song.context),
        meaning: toJson(song.meaning),
        musicAnalysis: toJson(song.musicAnalysis),
        culturalContext: toJson(song.culturalContext),
        tags: toJson(song.tags),
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
    createdSongs++;
  }

  // Sample editorial article, created once
  const articleExists = await prisma.article.findUnique({
    where: { slug: "geetaramayanache-mahatva" },
    select: { id: true },
  });
  if (!articleExists) {
    const sampleSong = songs[0];
    const sampleArtist = allArtists.find((a) => a.slug === sampleSong.relatedArtistSlugs[0]);
    const songRow = await prisma.song.findUnique({ where: { slug: sampleSong.slug } });
    const artistRow = sampleArtist
      ? await prisma.artist.findUnique({ where: { slug: sampleArtist.slug } })
      : null;

    await prisma.article.create({
      data: {
        slug: "geetaramayanache-mahatva",
        title: "हे गीत इतके महत्त्वाचे का आहे?",
        subtitle: "गीतरामायणाच्या प्रथम गीताचे सांस्कृतिक स्थान",
        type: "SANGIT_VISHLESHAN",
        author: "संग्रह संपादकीय",
        summary:
          "‘स्वये श्री रामप्रभू ऐकती’ हे गीत केवळ एक भक्तिगीत नव्हे — ते मराठी संस्कृतीत आकाशवाणी, काव्य आणि सामूहिक स्मृती यांचे संगमस्थळ आहे.",
        content: toJson([
          { type: "heading", level: 2, text: "गीताचा संदर्भ" },
          ...paragraphsToBlocks(sampleSong.context),
          { type: "heading", level: 2, text: "भावार्थ" },
          ...paragraphsToBlocks(sampleSong.meaning),
          { type: "heading", level: 2, text: "संगीत" },
          ...paragraphsToBlocks(sampleSong.musicAnalysis),
          { type: "heading", level: 2, text: "सांस्कृतिक संदर्भ" },
          ...paragraphsToBlocks(sampleSong.culturalContext),
          { type: "heading", level: 2, text: "आजचा वारसा" },
          {
            type: "paragraph",
            text: "आजही चैत्र महिन्यात गीतरामायणाचे सामूहिक गायन महाराष्ट्रभर होते — साठ वर्षांहून अधिक काळ ही परंपरा अखंड आहे.",
          },
        ]),
        tags: toJson(["गीतरामायण", "सांस्कृतिक इतिहास"]),
        status: "PUBLISHED",
        publishedAt: new Date(),
        entities: {
          create: [
            ...(songRow
              ? [{ entityType: "SONG", entitySlug: sampleSong.slug, songId: songRow.id }]
              : []),
            ...(artistRow
              ? [{ entityType: "ARTIST", entitySlug: sampleArtist!.slug, artistId: artistRow.id }]
              : []),
          ],
        },
        sources: {
          create: [
            {
              title: "गीतरामायण — आकाशवाणी पुणे",
              sourceType: "ARCHIVE",
              publication: "आकाशवाणी",
              year: "१९५५",
              notes: "प्रसारणाच्या ऐतिहासिक नोंदी",
            },
          ],
        },
      },
    });
  }

  console.log(
    `Seed done. Created ${createdArtists} new artists, ${createdSongs} new songs (existing records untouched).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
