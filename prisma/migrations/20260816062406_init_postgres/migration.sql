-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "latinTitle" TEXT,
    "singers" TEXT NOT NULL,
    "lyricist" TEXT NOT NULL,
    "composer" TEXT NOT NULL,
    "filmOrAlbum" TEXT,
    "year" TEXT,
    "language" TEXT NOT NULL DEFAULT 'मराठी',
    "type" TEXT NOT NULL,
    "raga" TEXT,
    "taal" TEXT,
    "theme" TEXT,
    "excerpt" TEXT,
    "context" TEXT,
    "meaning" TEXT,
    "musicAnalysis" TEXT,
    "culturalContext" TEXT,
    "legacy" TEXT,
    "description" TEXT,
    "tags" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latinName" TEXT,
    "categories" TEXT NOT NULL,
    "meta" TEXT,
    "period" TEXT,
    "birthDate" TEXT,
    "birthPlace" TEXT,
    "portraitUrl" TEXT,
    "intro" TEXT,
    "timeline" TEXT,
    "contribution" TEXT,
    "style" TEXT,
    "notableSongSlugs" TEXT,
    "notableWorks" TEXT,
    "collaborations" TEXT,
    "facts" TEXT,
    "related" TEXT,
    "tags" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "type" TEXT NOT NULL,
    "heroImage" TEXT,
    "author" TEXT,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "tags" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleEntity" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entitySlug" TEXT NOT NULL,
    "songId" TEXT,
    "artistId" TEXT,

    CONSTRAINT "ArticleEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioAsset" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "audioSource" TEXT NOT NULL DEFAULT 'UPLOADED',
    "audioFilename" TEXT,
    "mimeType" TEXT,
    "fileSize" INTEGER,
    "rightsConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "rightsConfirmedAt" TIMESTAMP(3),
    "uploadedAt" TIMESTAMP(3),
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AudioAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YouTubeVideo" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "youtubeVideoId" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YouTubeVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "publication" TEXT,
    "url" TEXT,
    "year" TEXT,
    "notes" TEXT,
    "sourceType" TEXT NOT NULL DEFAULT 'OTHER',
    "songId" TEXT,
    "artistId" TEXT,
    "articleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Song_slug_key" ON "Song"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_slug_key" ON "Artist"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleEntity_articleId_entityType_entitySlug_key" ON "ArticleEntity"("articleId", "entityType", "entitySlug");

-- CreateIndex
CREATE UNIQUE INDEX "AudioAsset_songId_key" ON "AudioAsset"("songId");

-- CreateIndex
CREATE UNIQUE INDEX "YouTubeVideo_songId_key" ON "YouTubeVideo"("songId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_token_key" ON "AdminSession"("token");

-- AddForeignKey
ALTER TABLE "ArticleEntity" ADD CONSTRAINT "ArticleEntity_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleEntity" ADD CONSTRAINT "ArticleEntity_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleEntity" ADD CONSTRAINT "ArticleEntity_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioAsset" ADD CONSTRAINT "AudioAsset_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YouTubeVideo" ADD CONSTRAINT "YouTubeVideo_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
