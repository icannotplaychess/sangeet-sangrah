import { PrismaClient } from "@prisma/client";
import { gayak } from "../src/data/artists-gayak";
import { sangeetkar } from "../src/data/artists-sangeetkar";
import { geetkar } from "../src/data/artists-geetkar";
import { kavi } from "../src/data/artists-kavi";
import { songs } from "../src/data/songs";
import { toJson } from "../src/lib/json";
import { paragraphsToBlocks } from "../src/lib/article-types";

const prisma = new PrismaClient();

const allArtists = [...gayak, ...sangeetkar, ...geetkar, ...kavi];

async function main() {
  console.log("Seeding database…");

  for (const artist of allArtists) {
    await prisma.artist.upsert({
      where: { slug: artist.slug },
      create: {
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
      update: {
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
      },
    });
  }

  for (const song of songs) {
    await prisma.song.upsert({
      where: { slug: song.slug },
      create: {
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
      update: {
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
      },
    });
  }

  // Sample editorial article linked to first song
  const sampleSong = songs[0];
  const sampleArtist = allArtists.find((a) => a.slug === sampleSong.relatedArtistSlugs[0]);
  const songRow = await prisma.song.findUnique({ where: { slug: sampleSong.slug } });
  const artistRow = sampleArtist
    ? await prisma.artist.findUnique({ where: { slug: sampleArtist.slug } })
    : null;

  await prisma.article.upsert({
    where: { slug: "geetaramayanache-mahatva" },
    create: {
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
            ? [
                {
                  entityType: "SONG" as const,
                  entitySlug: sampleSong.slug,
                  songId: songRow.id,
                },
              ]
            : []),
          ...(artistRow
            ? [
                {
                  entityType: "ARTIST" as const,
                  entitySlug: sampleArtist!.slug,
                  artistId: artistRow.id,
                },
              ]
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
    update: {},
  });

  console.log(`Seeded ${allArtists.length} artists, ${songs.length} songs, 1 sample article.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
