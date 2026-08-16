/** Server-side audio file validation */

const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  "audio/mpeg": [".mp3"],
  "audio/wav": [".wav"],
  "audio/x-wav": [".wav"],
  "audio/mp4": [".m4a"],
  "audio/x-m4a": [".m4a"],
  "audio/ogg": [".ogg"],
};

const MAGIC_BYTES: { mime: string; bytes: number[]; offset?: number }[] = [
  { mime: "audio/mpeg", bytes: [0xff, 0xfb] },
  { mime: "audio/mpeg", bytes: [0x49, 0x44, 0x33] }, // ID3
  { mime: "audio/wav", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF
  { mime: "audio/ogg", bytes: [0x4f, 0x67, 0x67, 0x53] }, // OggS
];

const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25 MB

export const AUDIO_EXTENSIONS = [".mp3", ".wav", ".m4a", ".ogg"];

export function isAllowedAudioExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return AUDIO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function validateAudioSize(size: number): string | null {
  if (size <= 0) return "फाइल रिकामी आहे.";
  if (size > MAX_AUDIO_SIZE) return "फाइल २५ MB पेक्षा मोठी असू शकत नाही.";
  return null;
}

export function detectMimeFromBuffer(buffer: Buffer): string | null {
  for (const sig of MAGIC_BYTES) {
    const offset = sig.offset ?? 0;
    if (buffer.length < offset + sig.bytes.length) continue;
    const match = sig.bytes.every((b, i) => buffer[offset + i] === b);
    if (match) return sig.mime;
  }
  // M4A/MP4 — ftyp at offset 4
  if (
    buffer.length >= 12 &&
    buffer[4] === 0x66 &&
    buffer[5] === 0x74 &&
    buffer[6] === 0x79 &&
    buffer[7] === 0x70
  ) {
    return "audio/mp4";
  }
  return null;
}

export function validateAudioFile(
  buffer: Buffer,
  filename: string,
  declaredType: string,
): { ok: true; mimeType: string } | { ok: false; error: string } {
  if (!isAllowedAudioExtension(filename)) {
    return { ok: false, error: "फक्त MP3, WAV, M4A किंवा OGG फाइल स्वीकारली जाते." };
  }

  const sizeError = validateAudioSize(buffer.length);
  if (sizeError) return { ok: false, error: sizeError };

  const detected = detectMimeFromBuffer(buffer);
  if (!detected) {
    return { ok: false, error: "ऑडिओ फाइल ओळखली जाऊ शकली नाही." };
  }

  const allowedExts = ALLOWED_MIME_TYPES[detected];
  if (!allowedExts) {
    return { ok: false, error: "या प्रकारची ऑडिओ फाइल स्वीकारली जात नाही." };
  }

  return { ok: true, mimeType: detected };
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
