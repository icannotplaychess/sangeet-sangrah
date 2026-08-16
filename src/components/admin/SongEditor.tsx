"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import AudioPlayer from "@/components/AudioPlayer";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import { extractYouTubeVideoId } from "@/lib/youtube";

export type SongFormData = {
  id: string;
  slug: string;
  title: string;
  latinTitle: string;
  singers: string[];
  lyricist: string;
  composer: string;
  filmOrAlbum: string;
  year: string;
  language: string;
  type: string;
  raga: string;
  taal: string;
  theme: string;
  description: string;
  context: string[];
  meaning: string[];
  musicAnalysis: string[];
  culturalContext: string[];
  legacy: string[];
  tags: string[];
  status: string;
  youtubeUrl: string;
  audioAsset?: {
    audioUrl: string;
    audioFilename: string | null;
    uploadedAt: string | null;
    rightsConfirmed: boolean;
  } | null;
  youtubeVideo?: { youtubeVideoId: string; youtubeUrl: string } | null;
};

const emptySong: Omit<SongFormData, "id" | "slug"> = {
  title: "",
  latinTitle: "",
  singers: [],
  lyricist: "",
  composer: "",
  filmOrAlbum: "",
  year: "",
  language: "मराठी",
  type: "भावगीत",
  raga: "",
  taal: "",
  theme: "",
  description: "",
  context: [],
  meaning: [],
  musicAnalysis: [],
  culturalContext: [],
  legacy: [],
  tags: [],
  status: "DRAFT",
  youtubeUrl: "",
};

function linesToText(lines: string[]) {
  return lines.join("\n");
}

function textToLines(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function SongEditor({
  initial,
  isNew = false,
  useBlobUpload = false,
}: {
  initial?: SongFormData;
  isNew?: boolean;
  useBlobUpload?: boolean;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    ...emptySong,
    ...initial,
    singers: initial?.singers ?? [],
    youtubeUrl: initial?.youtubeVideo?.youtubeUrl ?? initial?.youtubeUrl ?? "",
  });
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const songId = initial?.id;

  async function save(status?: string) {
    setSaving(true);
    setError("");
    setMessage("");
    const payload = {
      ...form,
      singers: form.singers.length ? form.singers : form.singers,
      singersRaw: Array.isArray(form.singers) ? form.singers.join(", ") : form.singers,
      status: status ?? form.status,
      context: textToLines(linesToText(form.context)),
      meaning: textToLines(linesToText(form.meaning)),
      musicAnalysis: textToLines(linesToText(form.musicAnalysis)),
      culturalContext: textToLines(linesToText(form.culturalContext)),
      legacy: textToLines(linesToText(form.legacy)),
    };

    const body = {
      ...payload,
      singers: typeof payload.singersRaw === "string"
        ? payload.singersRaw.split(",").map((s) => s.trim()).filter(Boolean)
        : payload.singers,
    };

    const url = isNew ? "/api/admin/songs" : `/api/admin/songs/${initial!.slug}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
      router.push(`/admin/geete/${data.slug}`);
      router.refresh();
    } else {
      router.refresh();
    }
  }

  async function uploadAudio() {
    if (!songId) {
      setError("प्रथम गीत जतन करा, नंतर ऑडिओ अपलोड करा.");
      return;
    }
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("ऑडिओ फाइल निवडा.");
      return;
    }
    if (!rightsConfirmed) {
      setError("कृपया अधिकाराची पुष्टी करा.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      if (useBlobUpload) {
        // Direct-to-Blob upload (bypasses the serverless request-size limit)
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/audio/upload",
          clientPayload: JSON.stringify({ songId, rightsConfirmed: true }),
        });

        const attach = await fetch("/api/admin/audio/attach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            songId,
            url: blob.url,
            filename: file.name,
            size: file.size,
            contentType: file.type,
            rightsConfirmed: true,
          }),
        });
        if (!attach.ok) {
          const data = await attach.json();
          throw new Error(data.error ?? "अपलोड अयशस्वी.");
        }
      } else {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("songId", songId);
        fd.append("rightsConfirmed", "true");

        const res = await fetch("/api/admin/audio", { method: "POST", body: fd });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "अपलोड अयशस्वी.");
        }
      }

      setMessage("ऑडिओ जतन केले.");
      setPreviewFile(null);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "अपलोड अयशस्वी.");
    } finally {
      setUploading(false);
    }
  }

  async function removeAudio() {
    if (!songId || !confirm("ऑडिओ काढायचा?")) return;
    await fetch("/api/admin/audio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId }),
    });
    setMessage("ऑडिओ काढले.");
    router.refresh();
  }

  function onFileChange() {
    const file = fileRef.current?.files?.[0];
    if (file) setPreviewFile(URL.createObjectURL(file));
  }

  const ytPreviewId = extractYouTubeVideoId(form.youtubeUrl);

  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="गीताचे नाव">
          <input
            className="admin-input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>
        <Field label="Latin Title">
          <input
            className="admin-input"
            value={form.latinTitle}
            onChange={(e) => setForm({ ...form, latinTitle: e.target.value })}
          />
        </Field>
        <Field label="गायक / गायिका (comma-separated)">
          <input
            className="admin-input"
            value={Array.isArray(form.singers) ? form.singers.join(", ") : form.singers}
            onChange={(e) =>
              setForm({
                ...form,
                singers: e.target.value.split(",").map((s) => s.trim()),
              })
            }
          />
        </Field>
        <Field label="गीतकार">
          <input
            className="admin-input"
            value={form.lyricist}
            onChange={(e) => setForm({ ...form, lyricist: e.target.value })}
          />
        </Field>
        <Field label="संगीतकार">
          <input
            className="admin-input"
            value={form.composer}
            onChange={(e) => setForm({ ...form, composer: e.target.value })}
          />
        </Field>
        <Field label="चित्रपट / अल्बम">
          <input
            className="admin-input"
            value={form.filmOrAlbum}
            onChange={(e) => setForm({ ...form, filmOrAlbum: e.target.value })}
          />
        </Field>
        <Field label="वर्ष">
          <input
            className="admin-input"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
        </Field>
        <Field label="प्रकार">
          <input
            className="admin-input"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
        </Field>
        <Field label="राग">
          <input
            className="admin-input"
            value={form.raga}
            onChange={(e) => setForm({ ...form, raga: e.target.value })}
          />
        </Field>
        <Field label="ताल">
          <input
            className="admin-input"
            value={form.taal}
            onChange={(e) => setForm({ ...form, taal: e.target.value })}
          />
        </Field>
        <Field label="Tags (comma-separated)">
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
        </Field>
      </div>

      <TextAreaField
        label="गीताचा संदर्भ"
        value={linesToText(form.context)}
        onChange={(v) => setForm({ ...form, context: textToLines(v) })}
      />
      <TextAreaField
        label="भावार्थ"
        value={linesToText(form.meaning)}
        onChange={(v) => setForm({ ...form, meaning: textToLines(v) })}
      />
      <TextAreaField
        label="संगीतविश्लेषण"
        value={linesToText(form.musicAnalysis)}
        onChange={(v) => setForm({ ...form, musicAnalysis: textToLines(v) })}
      />
      <TextAreaField
        label="सांस्कृतिक संदर्भ"
        value={linesToText(form.culturalContext)}
        onChange={(v) => setForm({ ...form, culturalContext: textToLines(v) })}
      />
      <TextAreaField
        label="आजचा वारसा"
        value={linesToText(form.legacy)}
        onChange={(v) => setForm({ ...form, legacy: textToLines(v) })}
      />

      <section className="rounded-xl border hairline p-6">
        <h2 className="font-deva text-lg text-pale">YouTube Video</h2>
        <Field label="YouTube URL">
          <input
            className="admin-input mt-3"
            value={form.youtubeUrl}
            onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Field>
        {ytPreviewId && (
          <div className="mt-6 max-w-sm">
            <YouTubeEmbed videoId={ytPreviewId} title={form.title || "Preview"} />
          </div>
        )}
      </section>

      {!isNew && (
        <section className="rounded-xl border hairline p-6">
          <h2 className="font-deva text-lg text-pale">ऑडिओ</h2>
          {initial?.audioAsset ? (
            <div className="mt-4 space-y-4">
              <AudioPlayer src={initial.audioAsset.audioUrl} title={form.title} />
              <p className="font-label text-[9px] text-dim">
                {initial.audioAsset.audioFilename}
                {initial.audioAsset.uploadedAt &&
                  ` • ${new Date(initial.audioAsset.uploadedAt).toLocaleDateString("mr-IN")}`}
              </p>
              <button type="button" onClick={removeAudio} className="admin-btn admin-btn-danger">
                ऑडिओ काढा
              </button>
            </div>
          ) : (
            <p className="font-deva mt-2 text-sm text-muted">कोणताही ऑडिओ अपलोड केलेला नाही.</p>
          )}

          <div className="mt-6 space-y-4">
            <input ref={fileRef} type="file" accept=".mp3,.wav,.m4a,.ogg,audio/*" onChange={onFileChange} />
            {previewFile && <audio controls src={previewFile} className="w-full" />}
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={rightsConfirmed}
                onChange={(e) => setRightsConfirmed(e.target.checked)}
                className="mt-1"
              />
              <span className="font-deva text-sm text-pale-2">
                मला या ऑडिओ फाइलचा वापर/होस्ट करण्याचा अधिकार आहे.
              </span>
            </label>
            <button type="button" onClick={uploadAudio} disabled={uploading} className="admin-btn admin-btn-primary">
              {uploading ? "अपलोड…" : "ऑडिओ जतन करा"}
            </button>
          </div>
        </section>
      )}

      {error && <p className="font-deva text-sm text-red-400">{error}</p>}
      {message && <p className="font-deva text-sm text-teal-bright">{message}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => save("DRAFT")} disabled={saving} className="admin-btn">
          जतन करा
        </button>
        <button
          type="button"
          onClick={() => save("PUBLISHED")}
          disabled={saving}
          className="admin-btn admin-btn-primary"
        >
          प्रकाशित करा
        </button>
        {!isNew && (
          <a href={`/geete/${initial!.slug}`} target="_blank" rel="noreferrer" className="admin-btn">
            पूर्वावलोकन →
          </a>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span className="admin-label">{label}</span>
      {children}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label>
      <span className="admin-label">{label}</span>
      <textarea
        className="admin-input mt-1 min-h-[120px] resize-y"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export { emptySong };
