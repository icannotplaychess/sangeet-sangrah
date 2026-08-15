export type ArtistCategory = "गायक" | "संगीतकार" | "गीतकार" | "कवी" | "शाहीर";

export interface TimelineEntry {
  year: string; // Devanagari digits, e.g. "१९२९"
  event: string;
}

export interface Artist {
  slug: string;
  name: string;
  latinName: string;
  categories: ArtistCategory[]; // first entry is the primary category
  meta: string; // e.g. "गायिका • पार्श्वगायिका • मराठी संगीत"
  period: string; // e.g. "१९२९ – २०२२"
  intro: string[]; // परिचय
  timeline: TimelineEntry[]; // जीवनप्रवास
  contribution: string[]; // संगीतविश्वातील योगदान
  notableSongSlugs: string[]; // उल्लेखनीय गीते (song slugs)
  notableWorks?: string[]; // for poets/lyricists without song pages
  collaborations: string[]; // सहकार्य (artist slugs)
  style: string[]; // शैली
  facts: string[]; // निवडक तथ्ये
  related: string[]; // संबंधित व्यक्ती (artist slugs)
  tags: string[];
}

export type SongType =
  | "भावगीत"
  | "चित्रपटगीत"
  | "नाट्यगीत"
  | "भक्तिगीत"
  | "अभंग"
  | "गीतरामायण"
  | "स्फूर्तिगीत"
  | "बालगीत"
  | "गझल"
  | "भूपाळी"
  | "विराणी";

export interface Song {
  slug: string;
  title: string;
  latinTitle: string;
  singers: string[]; // display names
  lyricist: string;
  composer: string;
  filmOrAlbum?: string;
  year?: string;
  language: string;
  type: SongType;
  raga?: string;
  taal?: string;
  theme: string;
  excerpt?: string[]; // short, legally-safe excerpt lines
  context: string[]; // गीताचा संदर्भ
  meaning: string[]; // भावार्थ
  musicAnalysis: string[]; // संगीतविश्लेषण
  culturalContext: string[]; // सांस्कृतिक संदर्भ
  relatedArtistSlugs: string[];
  tags: string[];
}

export type PoemCategory =
  | "निसर्गकविता"
  | "प्रेमकविता"
  | "सामाजिक कविता"
  | "भक्ती"
  | "अभंग"
  | "विराणी"
  | "स्फूर्तिकविता"
  | "जीवनविचार"
  | "विरह";

export interface Poem {
  slug: string;
  title: string;
  poetName: string;
  poetSlug?: string;
  category: PoemCategory;
  era: string; // e.g. "१९व्या शतकाचा उत्तरार्ध"
  isPublicDomain: boolean;
  // full text only for public-domain works; otherwise a short excerpt
  text?: string[][]; // stanzas → lines
  excerpt?: string[]; // short quotation for commentary
  about: string[]; // कवितेविषयी
  analysis: string[]; // रसग्रहण
  tags: string[];
}

export type ShayariTheme =
  | "प्रेम"
  | "विरह"
  | "मैत्री"
  | "पाऊस"
  | "आठवणी"
  | "जीवन"
  | "एकटेपणा"
  | "आशा"
  | "निसर्ग";

export interface Shayari {
  id: string;
  theme: ShayariTheme;
  lines: string[];
  attribution: string; // "संग्रह संपादकीय" for original verses
}

export type FactCategory =
  | "कलाकार"
  | "गीते"
  | "चित्रपट"
  | "वाद्ये"
  | "राग"
  | "लोकसंगीत"
  | "इतिहास"
  | "कवी"
  | "गीतकार"
  | "संगीतकार";

export interface Fact {
  id: string;
  category: FactCategory;
  text: string;
}

export type QuizCategory =
  | "कलाकार ओळखा"
  | "गीत ओळखा"
  | "संगीतकार कोण?"
  | "गीतकार कोण?"
  | "दशक ओळखा"
  | "इतिहास"
  | "कविता"
  | "राग आणि संगीत";

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Era {
  slug: string;
  name: string;
  period: string;
  summary: string;
  description: string[];
  keyArtists: string[]; // display names
  keySongs: string[]; // display names
  changes: string[]; // major shifts of the era
}

export interface Film {
  slug: string;
  title: string;
  year: string;
  director?: string;
  composer?: string;
  note: string[];
  songSlugs: string[];
}

export interface Raga {
  slug: string;
  name: string;
  thaat?: string;
  time?: string;
  mood: string;
  description: string[];
  songSlugs: string[];
}

export interface Instrument {
  slug: string;
  name: string;
  kind: string; // e.g. "तंतुवाद्य"
  description: string;
  context: string; // where it is heard in Marathi music
}
