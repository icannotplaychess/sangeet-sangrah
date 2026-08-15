import type { Metadata } from "next";
import {
  Noto_Serif_Devanagari,
  Cormorant_Garamond,
  Mukta,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const notoSerifDeva = Noto_Serif_Devanagari({
  variable: "--font-noto-serif-deva",
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["devanagari", "latin"],
  weight: ["200", "300", "400", "500"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "संगीत संग्रह — मराठी संगीताचा डिजिटल संग्रह",
    template: "%s — संगीत संग्रह",
  },
  description:
    "मराठी संगीत, कविता आणि साहित्य यांची स्मृती जपणारा एक डिजिटल संग्रह. गायक, संगीतकार, गीतकार, कवी, गीते आणि त्यामागच्या कथा — एका ठिकाणी. स्वर. शब्द. स्मृती.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="mr"
      className={`${notoSerifDeva.variable} ${cormorant.variable} ${mukta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-pale">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
