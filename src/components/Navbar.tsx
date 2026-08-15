"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/sangrah", label: "संग्रह" },
  { href: "/kalakar", label: "कलाकार" },
  { href: "/geete", label: "गीते" },
  { href: "/kavita", label: "कविता" },
  { href: "/shayari", label: "शायरी" },
  { href: "/itihas", label: "इतिहास" },
] as const;

const actions = [
  { href: "/tathya", label: "आजचा तथ्य" },
  { href: "/quiz", label: "क्विझ" },
  { href: "/shodh", label: "शोध" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b hairline bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-deva text-lg font-medium tracking-wide text-pale">
            संगीत संग्रह
          </span>
          <span className="text-teal-bright transition-opacity group-hover:opacity-60">.</span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-label link-quiet text-[10px] ${
                pathname.startsWith(l.href) ? "text-teal-bright" : "text-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {actions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`pill font-label px-4 py-2 text-[10px] ${
                pathname.startsWith(a.href) ? "text-teal-bright" : "text-pale-2"
              }`}
            >
              {a.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label="मेनू"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span
            className={`block h-px w-5 bg-pale transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-pale transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open && (
        <div className="border-t hairline px-5 pb-8 pt-4 lg:hidden animate-fade-in">
          <div className="flex flex-col gap-5">
            {[...links, ...actions].map((l) => (
              <Link key={l.href} href={l.href} className="font-label text-xs text-pale-2 link-quiet">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
