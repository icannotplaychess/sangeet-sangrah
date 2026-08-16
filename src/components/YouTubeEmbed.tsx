import { buildYouTubeEmbedUrl } from "@/lib/youtube";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const src = buildYouTubeEmbedUrl(videoId);

  return (
    <div className="youtube-embed overflow-hidden rounded-xl border hairline bg-ink-2/40">
      <div className="relative aspect-square w-full">
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
