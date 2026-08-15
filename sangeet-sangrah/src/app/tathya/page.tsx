import type { Metadata } from "next";
import FactExplorer from "@/components/FactExplorer";

export const metadata: Metadata = {
  title: "आजचा तथ्य",
  description: "मराठी संगीत, कलाकार, गीते आणि इतिहासाविषयीचे तथ्य.",
};

export default async function TathyaPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
      <p className="font-label text-[10px] text-muted">तथ्य • स्मृती • ज्ञान</p>
      <h1 className="font-deva mt-4 text-5xl font-medium text-pale md:text-7xl">
        आजचा तथ्य<span className="text-teal-bright">.</span>
      </h1>
      <p className="font-deva mt-7 text-base font-light leading-loose text-pale-2">
        मराठी संगीतविश्वातील एका कलाकाराने, गीताने किंवा घटनेने — प्रत्येक क्लिकवर नवे तथ्य.
      </p>
      <div className="mt-16">
        <FactExplorer initialId={id} />
      </div>
    </div>
  );
}
