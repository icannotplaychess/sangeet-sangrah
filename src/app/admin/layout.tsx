import type { ReactNode } from "react";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-ink">{children}</div>;
}
