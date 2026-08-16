"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatDuration } from "@/lib/audio";

interface AudioPlayerProps {
  src: string;
  title: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => setCurrent(el.currentTime);
    const onMeta = () => setDuration(el.duration || 0);
    const onEnd = () => setPlaying(false);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("durationchange", onMeta);
    el.addEventListener("ended", onEnd);

    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("durationchange", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const pct = Number(e.target.value);
    el.currentTime = (pct / 100) * duration;
    setCurrent(el.currentTime);
  };

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div className="audio-player rounded-xl border hairline bg-ink-2/60 p-5 md:p-6">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border hairline text-teal-bright transition hover:border-teal-bright/70 hover:shadow-[0_0_20px_rgba(42,165,189,0.25)]"
          aria-label={playing ? "विराम" : "प्ले"}
        >
          <span className="font-label text-sm">{playing ? "❚❚" : "▶"}</span>
        </button>
        <p className="font-deva min-w-0 flex-1 truncate text-base text-pale md:text-lg">{title}</p>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="font-mono shrink-0 text-[10px] text-dim">{formatDuration(current)}</span>
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={pct}
          onChange={seek}
          className="audio-progress flex-1"
          aria-label="प्रगती"
        />
        <span className="font-mono shrink-0 text-[10px] text-dim">{formatDuration(duration)}</span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="font-label shrink-0 text-[8px] text-dim">व्हॉल्यूम</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="audio-volume w-full max-w-[120px]"
            aria-label="व्हॉल्यूम"
          />
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="font-label rounded-full border hairline px-3 py-1.5 text-[9px] text-dim hover:text-teal-bright"
            aria-label="अधिक पर्याय"
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="absolute right-0 bottom-full z-10 mb-2 min-w-[140px] rounded-lg border hairline bg-ink-3 py-2 shadow-lg">
              <a
                href={src}
                download
                className="block px-4 py-2 font-label text-[9px] text-pale-2 hover:text-teal-bright"
              >
                डाउनलोड
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
