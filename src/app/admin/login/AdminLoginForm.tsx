"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("चुकीचा संकेतशब्द.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl border hairline bg-ink-2/50 p-8">
        <h1 className="font-deva text-2xl text-pale">प्रशासक प्रवेश</h1>
        <p className="font-deva mt-2 text-sm text-muted">फक्त अधिकृत संपादकांसाठी.</p>
        <label className="mt-8 block">
          <span className="admin-label">संकेतशब्द</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input"
            required
            autoFocus
          />
        </label>
        {error && <p className="mt-3 font-deva text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading} className="admin-btn admin-btn-primary mt-6 w-full">
          {loading ? "प्रवेश…" : "प्रवेश करा"}
        </button>
      </form>
    </div>
  );
}
