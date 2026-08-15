import type { Metadata } from "next";
import SearchClient from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "शोध",
  description: "संगीत संग्रहात कलाकार, गीते, कविता, राग, तथ्य आणि अधिक शोधा.",
};

export default function ShodhPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
      <p className="font-label text-[10px] text-muted">शोध • संग्रह</p>
      <h1 className="font-deva mt-4 text-5xl font-medium text-pale md:text-7xl">
        शोध<span className="text-teal-bright">.</span>
      </h1>
      <p className="font-deva mt-7 text-base font-light leading-loose text-pale-2">
        कलाकार, गीत, कविता, राग, तथ्य — संपूर्ण संग्रहात शोधा. मराठी देवनागरीत नैसर्गिक शोध.
      </p>
      <div className="mt-16">
        <SearchClient />
      </div>
    </div>
  );
}
