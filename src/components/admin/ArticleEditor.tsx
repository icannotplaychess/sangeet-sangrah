"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ARTICLE_TYPE_LABELS,
  SOURCE_TYPE_LABELS,
  emptyArticleContent,
  type ArticleBlock,
} from "@/lib/article-types";

type SourceForm = {
  title: string;
  author: string;
  publication: string;
  url: string;
  year: string;
  notes: string;
  sourceType: string;
};

export type ArticleFormData = {
  slug: string;
  title: string;
  subtitle: string;
  type: string;
  heroImage: string;
  author: string;
  summary: string;
  content: ArticleBlock[];
  tags: string[];
  status: string;
  linkedSongSlugs: string[];
  linkedArtistSlugs: string[];
  sources: SourceForm[];
};

const emptySource = (): SourceForm => ({
  title: "",
  author: "",
  publication: "",
  url: "",
  year: "",
  notes: "",
  sourceType: "OTHER",
});

export function ArticleEditor({
  initial,
  isNew = false,
  songOptions = [],
  artistOptions = [],
}: {
  initial?: ArticleFormData;
  isNew?: boolean;
  songOptions?: { slug: string; title: string }[];
  artistOptions?: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleFormData>({
    slug: "",
    title: "",
    subtitle: "",
    type: "SAMANYA",
    heroImage: "",
    author: "",
    summary: "",
    content: emptyArticleContent(),
    tags: [],
    status: "DRAFT",
    linkedSongSlugs: [],
    linkedArtistSlugs: [],
    sources: [],
    ...initial,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateBlock(index: number, patch: Partial<ArticleBlock>) {
    setForm((f) => ({
      ...f,
      content: f.content.map((b, i) => (i === index ? { ...b, ...patch } as ArticleBlock : b)),
    }));
  }

  function addBlock(type: ArticleBlock["type"]) {
    let block: ArticleBlock;
    switch (type) {
      case "heading":
        block = { type: "heading", level: 2, text: "" };
        break;
      case "quote":
        block = { type: "quote", text: "" };
        break;
      case "list":
        block = { type: "list", ordered: false, items: [""] };
        break;
      case "divider":
        block = { type: "divider" };
        break;
      case "image":
        block = { type: "image", src: "", caption: "" };
        break;
      default:
        block = { type: "paragraph", text: "" };
    }
    setForm((f) => ({ ...f, content: [...f.content, block] }));
  }

  function removeBlock(index: number) {
    setForm((f) => ({ ...f, content: f.content.filter((_, i) => i !== index) }));
  }

  async function save(status?: string) {
    setSaving(true);
    setError("");
    setMessage("");

    const url = isNew ? "/api/admin/articles" : `/api/admin/articles/${initial!.slug}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status: status ?? form.status }),
    });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "जतन अयशस्वी.");
      return;
    }

    const data = await res.json();
    setMessage(status === "PUBLISHED" ? "प्रकाशित केले." : "जतन केले.");
    if (isNew && data.slug) {
      router.push(`/admin/lekh/${data.slug}`);
      router.refresh();
    } else {
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <label>
          <span className="admin-label">लेखाचे शीर्षक</span>
          <input
            className="admin-input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label>
          <span className="admin-label">उपशीर्षक</span>
          <input
            className="admin-input"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />
        </label>
        <label>
          <span className="admin-label">प्रकार</span>
          <select
            className="admin-input"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            {Object.entries(ARTICLE_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="admin-label">लेखक</span>
          <input
            className="admin-input"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
        </label>
        <label className="md:col-span-2">
          <span className="admin-label">मुख्य प्रतिमा URL</span>
          <input
            className="admin-input"
            value={form.heroImage}
            onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
          />
        </label>
        <label className="md:col-span-2">
          <span className="admin-label">सारांश</span>
          <textarea
            className="admin-input min-h-[80px]"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
        </label>
        <label>
          <span className="admin-label">Tags</span>
          <input
            className="admin-input"
            value={form.tags.join(", ")}
            onChange={(e) =>
              setForm({
                ...form,
                tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </label>
      </div>

      <section>
        <h2 className="font-deva mb-4 text-lg text-pale">मुख्य मजकूर</h2>
        <div className="space-y-4">
          {form.content.map((block, i) => (
            <div key={i} className="rounded-lg border hairline p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-label text-[8px] text-dim">{block.type}</span>
                <button type="button" onClick={() => removeBlock(i)} className="font-label text-[8px] text-red-400">
                  काढा
                </button>
              </div>
              {block.type === "paragraph" && (
                <textarea
                  className="admin-input min-h-[100px]"
                  value={block.text}
                  onChange={(e) => updateBlock(i, { text: e.target.value })}
                />
              )}
              {block.type === "heading" && (
                <input
                  className="admin-input"
                  value={block.text}
                  onChange={(e) => updateBlock(i, { text: e.target.value })}
                  placeholder="शीर्षक"
                />
              )}
              {block.type === "quote" && (
                <textarea
                  className="admin-input min-h-[80px]"
                  value={block.text}
                  onChange={(e) => updateBlock(i, { text: e.target.value })}
                />
              )}
              {block.type === "list" && (
                <textarea
                  className="admin-input min-h-[80px]"
                  value={block.items.join("\n")}
                  onChange={(e) =>
                    updateBlock(i, {
                      items: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  placeholder="प्रत्येक ओळ वेगळी"
                />
              )}
              {block.type === "image" && (
                <div className="space-y-2">
                  <input
                    className="admin-input"
                    value={block.src}
                    onChange={(e) => updateBlock(i, { src: e.target.value })}
                    placeholder="Image URL"
                  />
                  <input
                    className="admin-input"
                    value={block.caption ?? ""}
                    onChange={(e) => updateBlock(i, { caption: e.target.value })}
                    placeholder="Caption"
                  />
                </div>
              )}
              {block.type === "divider" && <hr className="border-t hairline" />}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["paragraph", "heading", "quote", "list", "divider", "image"] as const).map((t) => (
            <button key={t} type="button" onClick={() => addBlock(t)} className="admin-btn">
              + {t}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <label>
          <span className="admin-label">संबंधित गीत</span>
          <select
            multiple
            className="admin-input min-h-[120px]"
            value={form.linkedSongSlugs}
            onChange={(e) =>
              setForm({
                ...form,
                linkedSongSlugs: Array.from(e.target.selectedOptions, (o) => o.value),
              })
            }
          >
            {songOptions.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="admin-label">संबंधित कलाकार</span>
          <select
            multiple
            className="admin-input min-h-[120px]"
            value={form.linkedArtistSlugs}
            onChange={(e) =>
              setForm({
                ...form,
                linkedArtistSlugs: Array.from(e.target.selectedOptions, (o) => o.value),
              })
            }
          >
            {artistOptions.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-deva text-lg text-pale">स्रोत</h2>
          <button
            type="button"
            onClick={() => setForm({ ...form, sources: [...form.sources, emptySource()] })}
            className="admin-btn"
          >
            + स्रोत
          </button>
        </div>
        {form.sources.map((src, i) => (
          <div key={i} className="mb-4 grid gap-3 rounded-lg border hairline p-4 md:grid-cols-2">
            <input
              className="admin-input"
              placeholder="Source title"
              value={src.title}
              onChange={(e) => {
                const sources = [...form.sources];
                sources[i] = { ...src, title: e.target.value };
                setForm({ ...form, sources });
              }}
            />
            <select
              className="admin-input"
              value={src.sourceType}
              onChange={(e) => {
                const sources = [...form.sources];
                sources[i] = { ...src, sourceType: e.target.value };
                setForm({ ...form, sources });
              }}
            >
              {Object.entries(SOURCE_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <input
              className="admin-input"
              placeholder="Author"
              value={src.author}
              onChange={(e) => {
                const sources = [...form.sources];
                sources[i] = { ...src, author: e.target.value };
                setForm({ ...form, sources });
              }}
            />
            <input
              className="admin-input"
              placeholder="Publication"
              value={src.publication}
              onChange={(e) => {
                const sources = [...form.sources];
                sources[i] = { ...src, publication: e.target.value };
                setForm({ ...form, sources });
              }}
            />
            <input
              className="admin-input"
              placeholder="URL"
              value={src.url}
              onChange={(e) => {
                const sources = [...form.sources];
                sources[i] = { ...src, url: e.target.value };
                setForm({ ...form, sources });
              }}
            />
            <input
              className="admin-input"
              placeholder="Year"
              value={src.year}
              onChange={(e) => {
                const sources = [...form.sources];
                sources[i] = { ...src, year: e.target.value };
                setForm({ ...form, sources });
              }}
            />
            <textarea
              className="admin-input md:col-span-2"
              placeholder="Notes"
              value={src.notes}
              onChange={(e) => {
                const sources = [...form.sources];
                sources[i] = { ...src, notes: e.target.value };
                setForm({ ...form, sources });
              }}
            />
          </div>
        ))}
      </section>

      {error && <p className="font-deva text-sm text-red-400">{error}</p>}
      {message && <p className="font-deva text-sm text-teal-bright">{message}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => save("DRAFT")} disabled={saving} className="admin-btn">
          जतन करा
        </button>
        <button type="button" onClick={() => save("PUBLISHED")} disabled={saving} className="admin-btn admin-btn-primary">
          प्रकाशित करा
        </button>
        <button type="button" onClick={() => save("ARCHIVED")} disabled={saving} className="admin-btn">
          संग्रहित करा
        </button>
        {!isNew && (
          <a href={`/lekh/${initial!.slug}`} target="_blank" rel="noreferrer" className="admin-btn">
            पूर्वावलोकन →
          </a>
        )}
      </div>
    </div>
  );
}
