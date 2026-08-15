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

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Noto Serif Devanagari + Cormorant Garamond + JetBrains Mono

## Sections

- **कलाकार** — Artists (Lata Mangeshkar, Sudhir Phadke, etc.)
- **गीते** — Songs with भावार्थ and context
- **कविता** — Poetry reader
- **शायरी** — Shayari by theme
- **इतिहास** — Music history timeline
- **क्विझ** — Interactive quiz
- **तथ्य** — Random facts
- **शोध** — Global Marathi search
