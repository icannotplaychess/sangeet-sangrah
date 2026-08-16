# संगीत संग्रह — Sangeet Sangrah

मराठी संगीत, कविता आणि साहित्याचा डिजिटल संग्रह. स्वर. शब्द. स्मृती.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel deployment

The app must deploy from the **repository root** (where `package.json` lives). Root Directory in Vercel should be **empty** or `.` — not `sangeet-sangrah`.

### Enable the CMS (one-time setup, ~2 minutes)

To add songs, articles, YouTube links, and MP3s from the live site:

1. **Database** — Vercel Dashboard → your project → **Storage** tab → **Create Database** → choose **Postgres (Neon)** → connect it to the project. This adds `DATABASE_URL` automatically.
2. **Audio storage** — same Storage tab → **Create Blob store** → connect it. This adds `BLOB_READ_WRITE_TOKEN` automatically.
3. **Admin password** — Settings → Environment Variables → add `ADMIN_PASSWORD` with a password you choose.
4. **Redeploy** — Deployments → latest → Redeploy.

Then log in at `/admin/login` with your password. Without the database, the site still works in read-only mode (built-in content only).

If the site shows **404** or **DEPLOYMENT_NOT_FOUND**:

1. **Production branch** — ensure Vercel deploys from `main` (the app is merged there).
2. **Redeploy** — Vercel Dashboard → Deployments → latest Production → Redeploy.
3. **Deployment Protection** — Settings → Deployment Protection → allow **public** access to Production (otherwise visitors see a Vercel login wall).
4. **Domains** — Settings → Domains → assign your production URL to the latest deployment.

After each push to `main`, use the **Production** deployment URL shown in the Vercel dashboard (not old preview hash links).

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Prisma + Postgres (content CMS) + Vercel Blob (audio)
- Noto Serif Devanagari + Cormorant Garamond + JetBrains Mono

## CMS & Admin

Admin panel: `/admin` (password from `ADMIN_PASSWORD` in `.env`).

| Feature | Route |
|---------|-------|
| Dashboard | `/admin` |
| Song editor + audio/YouTube | `/admin/geete/[slug]` |
| Article CMS | `/admin/lekh` |
| Global admin search | `/admin/shodh` |

**Audio uploads** require the rights checkbox; files are validated server-side (MP3, WAV, M4A, OGG; max 25 MB). On Vercel they upload directly to Blob storage. **YouTube** uses official embeds only — no downloading.

Public article pages: `/lekh/[slug]`. Song URLs: `/geete/[slug]` (alias `/songs/[slug]`).

Local development needs Postgres (see `.env.example`):

```bash
npm run db:migrate   # apply migrations
npm run db:seed      # seed from static data (create-only, never overwrites edits)
```

## Sections

- **कलाकार** — Artists (Lata Mangeshkar, Sudhir Phadke, etc.)
- **गीते** — Songs with audio, YouTube, editorial archive pages
- **लेख** — Editorial articles (CMS)
- **कविता** — Poetry reader
- **शायरी** — Shayari by theme
- **इतिहास** — Music history timeline
- **क्विझ** — Interactive quiz
- **तथ्य** — Random facts
- **शोध** — Global Marathi search
