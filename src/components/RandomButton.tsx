"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getDiscoveryTargets } from "@/lib/content";

export default function RandomButton({ label = "मला काहीतरी दाखवा" }: { label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  function open() {
    const targets = getDiscoveryTargets();
    const target = targets[Math.floor(Math.random() * targets.length)];
    setBusy(true);
    router.push(target.href);
  }

  return (
    <button
      type="button"
      onClick={open}
      disabled={busy}
      className="pill inline-flex cursor-pointer items-center gap-3 px-8 py-4 font-label text-[11px] text-teal-bright disabled:opacity-60"
    >
      <span>{busy ? "उघडतो आहे…" : label}</span>
      <span className="pill-arrow">→</span>
    </button>
  );
}
