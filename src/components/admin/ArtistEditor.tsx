"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ArtistEditor({ isNew = true }: { isNew?: boolean }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    latinName: "",
    category: "गायक",
    meta: "",
    period: "",
    birthDate: "",
    birthPlace: "",
    portraitUrl: "",
    intro: "",
    contribution: "",
    style: "",
    notableSongSlugs: "",
    tags: "",
    status: "DRAFT",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(status?: string) {
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/artists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        categories: [form.category],
        status: status ?? form.status,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "जतन अयशस्वी.");
      return;
    }
    const data = await res.json();
    router.push(`/kalakar/${data.slug}`);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {[
          ["नाव", "name"],
          ["Latin Name", "latinName"],
          ["प्रकार", "category"],
          ["Meta", "meta"],
          ["कालखंड", "period"],
          ["जन्मतारीख", "birthDate"],
          ["जन्मस्थान", "birthPlace"],
          ["छायाचित्र URL", "portraitUrl"],
        ].map(([label, key]) => (
          <label key={key}>
            <span className="admin-label">{label}</span>
            <input
              className="admin-input"
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        ))}
      </div>
      {[
        ["परिचय", "intro"],
        ["योगदान", "contribution"],
        ["शैली", "style"],
      ].map(([label, key]) => (
        <label key={key}>
          <span className="admin-label">{label}</span>
          <textarea
            className="admin-input min-h-[100px]"
            value={form[key as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </label>
      ))}
      <label>
        <span className="admin-label">उल्लेखनीय गीते (slugs, comma-separated)</span>
        <input
          className="admin-input"
          value={form.notableSongSlugs}
          onChange={(e) => setForm({ ...form, notableSongSlugs: e.target.value })}
        />
      </label>
      {error && <p className="font-deva text-sm text-red-400">{error}</p>}
      <div className="flex gap-3">
        <button type="button" onClick={() => save("DRAFT")} disabled={saving} className="admin-btn">
          जतन करा
        </button>
        <button type="button" onClick={() => save("PUBLISHED")} disabled={saving} className="admin-btn admin-btn-primary">
          प्रकाशित करा
        </button>
      </div>
    </div>
  );
}
