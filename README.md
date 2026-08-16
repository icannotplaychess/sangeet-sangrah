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

If the site shows **404** or **DEPLOYMENT_NOT_FOUND**:

1. **Production branch** — ensure Vercel deploys from `main` (the app is merged there).
2. **Redeploy** — Vercel Dashboard → Deployments → latest Production → Redeploy.
3. **Deployment Protection** — Settings → Deployment Protection → allow **public** access to Production (otherwise visitors see a Vercel login wall).
4. **Domains** — Settings → Domains → assign your production URL to the latest deployment.

After each push to `main`, use the **Production** deployment URL shown in the Vercel dashboard (not old preview hash links).

The production build no longer requires a `DATABASE_URL` Vercel env var — SQLite defaults to `prisma/dev.db` and is created during `npm run build`. Optional: set `ADMIN_PASSWORD` and `ADMIN_SECRET` in Vercel → Settings → Environment Variables for the CMS.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Prisma + SQLite (content CMS)
- Noto Serif Devanagari + Cormorant Garamond + JetBrains Mono

## CMS & Admin

Admin panel: `/admin` (password from `ADMIN_PASSWORD` in `.env`).

| Feature | Route |
|---------|-------|
| Dashboard | `/admin` |
| Song editor + audio/YouTube | `/admin/geete/[slug]` |
| Article CMS | `/admin/lekh` |
| Global admin search | `/admin/shodh` |

**Audio uploads** require the rights checkbox; files are validated server-side (MP3, WAV, M4A, OGG; max 25 MB). **YouTube** uses official embeds only — no downloading.

Public article pages: `/lekh/[slug]`. Song URLs: `/geete/[slug]` (alias `/songs/[slug]`).

```bash
npm run db:migrate   # apply migrations
npm run db:seed      # seed from static data
```

Set `ADMIN_PASSWORD` and `ADMIN_SECRET` in production. On Vercel, SQLite is rebuilt at deploy; use persistent storage (e.g. Turso, Postgres + blob storage) for production CMS writes and audio hosting.

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
