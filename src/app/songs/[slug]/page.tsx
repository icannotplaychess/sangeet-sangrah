import { redirect } from "next/navigation";

export default async function SongsAliasPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/geete/${slug}`);
}
