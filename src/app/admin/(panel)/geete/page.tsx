import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSongsListPage() {
  const songs = await prisma.song.findMany({
    orderBy: { title: "asc" },
    select: { slug: true, title: true, status: true, lyricist: true, composer: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-deva text-3xl text-pale">गीते</h1>
        <Link href="/admin/geete/new" className="admin-btn admin-btn-primary">
          नवीन गीत
        </Link>
      </div>
      <ul className="mt-10 space-y-2">
        {songs.map((s) => (
          <li key={s.slug}>
            <Link href={`/admin/geete/${s.slug}`} className="group flex justify-between border-b hairline py-4">
              <span className="font-deva text-pale group-hover:text-teal-bright">{s.title}</span>
              <span className="font-label text-[8px] text-dim">
                {s.lyricist} • {s.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
