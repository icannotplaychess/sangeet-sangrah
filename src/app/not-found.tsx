import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-start justify-center px-5 py-24 md:px-8">
      <p className="font-label text-[10px] text-muted">४०४</p>
      <h1 className="font-deva mt-4 text-5xl font-medium text-pale md:text-6xl">
        पृष्ठ सापडले नाही<span className="text-teal-bright">.</span>
      </h1>
      <p className="font-deva mt-6 text-base font-light leading-loose text-pale-2">
        हे पृष्ठ संग्रहात नाही. कदाचित दुवा बदलला असेल, किंवा पृष्ठ अजून जोडले
        गेले नसेल.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/"
          className="pill inline-flex items-center gap-3 px-8 py-4 font-label text-[11px] text-teal-bright"
        >
          <span>मुख्यपृष्ठ</span>
          <span className="pill-arrow">→</span>
        </Link>
        <Link
          href="/shodh"
          className="pill inline-flex items-center gap-3 px-8 py-4 font-label text-[11px] text-pale-2"
        >
          <span>शोध</span>
          <span className="pill-arrow">→</span>
        </Link>
      </div>
    </div>
  );
}
