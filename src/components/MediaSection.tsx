import Link from "next/link";
import AudioPlayer from "./AudioPlayer";
import YouTubeEmbed from "./YouTubeEmbed";

interface MediaSectionProps {
  title: string;
  audio: { url: string; filename: string | null } | null;
  youtube: { videoId: string } | null;
  isAdmin?: boolean;
  adminHref?: string;
}

export function AudioEmptyState({ isAdmin, adminHref }: { isAdmin?: boolean; adminHref?: string }) {
  return (
    <div className="rounded-xl border hairline bg-ink-2/30 px-6 py-10 text-center">
      <p className="font-deva text-lg text-pale">ऑडिओ उपलब्ध नाही</p>
      <p className="font-deva mt-2 text-sm font-light text-muted">
        या गीतासाठी अद्याप ऑडिओ जोडलेला नाही.
      </p>
      {isAdmin && adminHref && (
        <Link
          href={adminHref}
          className="font-label mt-6 inline-block text-[10px] text-teal-bright link-quiet"
        >
          ऑडिओ जोडायचा आहे? →
        </Link>
      )}
    </div>
  );
}

export function YouTubeEmptyState() {
  return (
    <div className="flex aspect-square items-center justify-center rounded-xl border hairline bg-ink-2/30">
      <div className="text-center px-6">
        <p className="font-label text-[9px] text-dim">YouTube</p>
        <p className="font-deva mt-3 text-sm text-muted">व्हिडिओ उपलब्ध नाही</p>
      </div>
    </div>
  );
}

export default function MediaSection({ title, audio, youtube, isAdmin, adminHref }: MediaSectionProps) {
  return (
    <section className="mt-16 border-t hairline pt-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="font-label mb-5 text-[10px] text-muted">ऑडिओ</p>
          {audio ? (
            <AudioPlayer src={audio.url} title={title} />
          ) : (
            <AudioEmptyState isAdmin={isAdmin} adminHref={adminHref} />
          )}
        </div>
        <div>
          <p className="font-label mb-5 text-[10px] text-muted">YouTube</p>
          {youtube ? (
            <YouTubeEmbed videoId={youtube.videoId} title={title} />
          ) : (
            <YouTubeEmptyState />
          )}
        </div>
      </div>
    </section>
  );
}
