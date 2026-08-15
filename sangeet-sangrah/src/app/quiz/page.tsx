import type { Metadata } from "next";
import QuizEngine from "@/components/QuizEngine";

export const metadata: Metadata = {
  title: "संगीत क्विझ",
  description: "मराठी संगीत, कविता आणि इतिहासावरील क्विझ — कलाकार, गीते, राग आणि अधिक.",
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
      <p className="font-label text-[10px] text-muted">क्विझ • ज्ञान • आनंद</p>
      <h1 className="font-deva mt-4 text-5xl font-medium text-pale md:text-7xl">
        संगीत क्विझ<span className="text-teal-bright">.</span>
      </h1>
      <p className="font-deva mt-7 text-base font-light leading-loose text-pale-2">
        मराठी संगीताचे ज्ञान तपासा — कलाकार, गीते, संगीतकार, गीतकार, कविता आणि राग.
      </p>
      <div className="mt-16">
        <QuizEngine />
      </div>
    </div>
  );
}
