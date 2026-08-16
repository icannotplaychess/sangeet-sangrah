/** Editorial article content blocks stored as JSON */

export type ArticleBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "divider" }
  | { type: "image"; src: string; caption?: string; alt?: string }
  | { type: "link"; text: string; href: string };

export const ARTICLE_TYPE_LABELS: Record<string, string> = {
  KALAKAR: "कलाकार",
  GEET: "गीत",
  SANGEETKAR: "संगीतकार",
  GEETKAR: "गीतकार",
  KAVI: "कवी",
  KAVITA: "कविता",
  CHITRAPAT: "चित्रपट",
  VADYA: "वाद्य",
  RAG: "राग",
  TAAL: "ताल",
  ITIHAS: "इतिहास",
  PARAMPARA: "परंपरा",
  SANGIT_VISHLESHAN: "संगीत विश्लेषण",
  SAMANYA: "सामान्य लेख",
};

export const SOURCE_TYPE_LABELS: Record<string, string> = {
  BOOK: "पुस्तक",
  NEWSPAPER: "वर्तमानपत्र",
  INTERVIEW: "मुलाखत",
  ARCHIVE: "संग्रह",
  WEBSITE: "संकेतस्थळ",
  ACADEMIC: "शैक्षणिक",
  OTHER: "इतर",
};

export function emptyArticleContent(): ArticleBlock[] {
  return [{ type: "paragraph", text: "" }];
}

export function paragraphsToBlocks(paragraphs: string[]): ArticleBlock[] {
  return paragraphs.map((text) => ({ type: "paragraph" as const, text }));
}

export function blocksToPlainText(blocks: ArticleBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading":
        case "paragraph":
        case "quote":
          return b.text;
        case "list":
          return b.items.join(" ");
        case "link":
          return b.text;
        default:
          return "";
      }
    })
    .join("\n");
}
