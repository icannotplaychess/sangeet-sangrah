import Link from "next/link";
import { getAdminStats } from "@/lib/repository";

export default async function AdminDashboardPage() {
  const { counts, recentSongs, recentArticles } = await getAdminStats();

  return (
    <div>
      <h1 className="font-deva text-3xl text-pale">संगीत संग्रह Admin</h1>
      <hr className="my-8 border-t hairline" />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "गीते", value: counts.songs, href: "/admin/geete" },
          { label: "कलाकार", value: counts.artists, href: "/admin/kalakar" },
          { label: "कविता", value: counts.poems, href: "/kavita" },
          { label: "लेख", value: counts.articles, href: "/admin/lekh" },
          { label: "तथ्य", value: counts.facts, href: "/tathya" },
          { label: "क्विझ प्रश्न", value: counts.quiz, href: "/quiz" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-xl border hairline bg-ink-2/40 p-6 transition hover:border-teal/50"
          >
            <p className="font-label text-[10px] text-dim">{item.label}</p>
            <p className="font-deva mt-2 text-4xl text-teal-bright">{item.value}</p>
          </Link>
        ))}
      </div>

      <hr className="my-10 border-t hairline" />

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="font-label text-[10px] text-muted">Drafts</p>
          <p className="font-deva mt-2 text-3xl text-pale">{counts.drafts}</p>
        </div>
        <div>
          <p className="font-label text-[10px] text-muted">Published</p>
          <p className="font-deva mt-2 text-3xl text-pale">{counts.published}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/admin/geete/new" className="admin-btn admin-btn-primary">
          नवीन गीत
        </Link>
        <Link href="/admin/kalakar/new" className="admin-btn">
          नवीन कलाकार
        </Link>
        <Link href="/admin/lekh/new" className="admin-btn">
          नवीन लेख
        </Link>
      </div>

      <hr className="my-12 border-t hairline" />

      <div className="grid gap-12 lg:grid-cols-2">
        <section>
          <h2 className="font-deva text-lg text-pale">अलीकडील गीते</h2>
          <ul className="mt-4 space-y-3">
            {recentSongs.map((s) => (
              <li key={s.slug}>
                <Link href={`/admin/geete/${s.slug}`} className="font-deva text-sm text-pale-2 link-quiet">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-deva text-lg text-pale">अलीकडील लेख</h2>
          <ul className="mt-4 space-y-3">
            {recentArticles.map((a) => (
              <li key={a.slug} className="flex items-baseline justify-between gap-4">
                <Link href={`/admin/lekh/${a.slug}`} className="font-deva text-sm text-pale-2 link-quiet">
                  {a.title}
                </Link>
                <span className="font-label text-[8px] text-dim">{a.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
