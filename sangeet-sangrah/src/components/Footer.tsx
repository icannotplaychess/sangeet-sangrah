import Link from "next/link";

const footerLinks = [
  { href: "/sangrah", label: "संग्रह" },
  { href: "/sangrah#aamchyabaddal", label: "आमच्याबद्दल" },
  { href: "/sangrah#srot", label: "स्रोत" },
  { href: "/sangrah#yogdan", label: "योगदान" },
  { href: "/sangrah#sampark", label: "संपर्क" },
];

export default function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
          <div>
            <p className="font-deva text-4xl font-medium text-pale md:text-6xl">
              संगीत संग्रह<span className="text-teal-bright">.</span>
            </p>
            <p className="mt-5 font-label text-[10px] text-muted">
              मराठी संगीत, शब्द आणि स्मृती यांचा डिजिटल संग्रह.
            </p>
            <p className="mt-2 font-editorial text-sm italic text-dim">
              A Marathi Music Archive — est. archive of स्वर, शब्द, स्मृती
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-4">
            {footerLinks.map((l) => (
              <Link key={l.label} href={l.href} className="font-label text-[10px] text-muted link-quiet">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t hairline pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-label text-[9px] text-dim">
            स्वर • शब्द • स्मृती
          </p>
          <p className="font-label text-[9px] text-dim">
            शैक्षणिक व सांस्कृतिक दस्तऐवजीकरणासाठी — प्रताधिकारित काव्यांचे केवळ अल्प अंश, समीक्षेसह
          </p>
        </div>
      </div>
    </footer>
  );
}
