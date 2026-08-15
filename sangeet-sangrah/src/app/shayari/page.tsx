import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui";
import { shayari } from "@/lib/content";
import type { ShayariTheme } from "@/data/types";

export const metadata: Metadata = {
  title: "शायरी",
  description: "मराठी शायरी — प्रेम, विरह, पाऊस, आठवणी आणि जीवन.",
};

const themes: ShayariTheme[] = [
  "प्रेम",
  "विरह",
  "मैत्री",
  "पाऊस",
  "आठवणी",
  "जीवन",
  "एकटेपणा",
  "आशा",
  "निसर्ग",
];

export default function ShayariPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-20 md:px-8 md:py-28">
      <p className="font-label text-[10px] text-muted">शायरी • कविता पेक्षा वेगळी</p>
      <h1 className="font-deva mt-4 text-5xl font-medium text-pale md:text-7xl">
        शायरी<span className="text-teal-bright">.</span>
      </h1>
      <p className="font-deva mt-7 max-w-2xl text-base font-light leading-loose text-pale-2">
        कविता, शायरी, अभंग आणि लोकगीत — हे चारही वेगळे प्रकार आहेत. शायरी ही
        चारोळींची, थेट भावनांची अभिव्यक्ती.
      </p>

      <div className="mt-24 space-y-24">
        {themes.map((theme) => {
          const items = shayari.filter((s) => s.theme === theme);
          if (!items.length) return null;
          return (
            <section key={theme} id={theme}>
              <SectionLabel>{theme}</SectionLabel>
              <div className="mt-10 space-y-12">
                {items.map((item) => (
                  <blockquote
                    key={item.id}
                    className="border-l border-teal/30 pl-8 md:pl-12"
                  >
                    {item.lines.map((line) => (
                      <p
                        key={line}
                        className="font-deva text-lg font-light leading-[2] text-pale md:text-xl"
                      >
                        {line}
                      </p>
                    ))}
                    <footer className="font-label mt-4 text-[9px] text-dim">
                      — {item.attribution}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
