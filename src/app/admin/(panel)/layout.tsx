import Link from "next/link";
import type { ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "डॅशबोर्ड" },
  { href: "/admin/shodh", label: "शोध" },
  { href: "/admin/geete/new", label: "नवीन गीत" },
  { href: "/admin/kalakar/new", label: "नवीन कलाकार" },
  { href: "/admin/lekh/new", label: "लेख तयार करा" },
  { href: "/admin/lekh", label: "लेख" },
];

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="border-b hairline">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div>
            <Link href="/admin" className="font-deva text-xl text-pale link-quiet">
              संगीत संग्रह Admin
            </Link>
            <p className="font-label mt-1 text-[9px] text-dim">स्वर. शब्द. स्मृती.</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border hairline px-3 py-1.5 font-label text-[8px] text-muted link-quiet hover:text-teal-bright"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-full border hairline px-3 py-1.5 font-label text-[8px] text-dim link-quiet"
            >
              साइट →
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">{children}</div>
    </>
  );
}
