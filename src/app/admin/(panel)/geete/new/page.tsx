import { SongEditor } from "@/components/admin/SongEditor";

export default function NewSongPage() {
  return (
    <div>
      <h1 className="font-deva mb-8 text-3xl text-pale">नवीन गीत तयार करा</h1>
      <SongEditor isNew />
    </div>
  );
}
