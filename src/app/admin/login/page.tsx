import { Suspense } from "react";
import AdminLoginForm from "./AdminLoginForm";
import { hasDatabase } from "@/lib/db-url";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type SetupStatus = {
  dbConfigured: boolean;
  dbReady: boolean;
  passwordSet: boolean;
  blobConfigured: boolean;
};

async function getSetupStatus(): Promise<SetupStatus> {
  const dbConfigured = hasDatabase();
  let dbReady = false;
  if (dbConfigured) {
    try {
      await prisma.adminSession.count();
      dbReady = true;
    } catch {
      dbReady = false;
    }
  }
  return {
    dbConfigured,
    dbReady,
    passwordSet: Boolean(process.env.ADMIN_PASSWORD),
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  };
}

function StatusRow({ ok, label, hint }: { ok: boolean; label: string; hint?: string }) {
  return (
    <li className="flex items-start gap-3 py-2">
      <span className={`mt-0.5 font-label text-[11px] ${ok ? "text-teal-bright" : "text-red-400"}`}>
        {ok ? "✓" : "✗"}
      </span>
      <span>
        <span className={`font-deva block text-sm ${ok ? "text-pale-2" : "text-pale"}`}>{label}</span>
        {!ok && hint && <span className="font-deva mt-1 block text-xs leading-relaxed text-muted">{hint}</span>}
      </span>
    </li>
  );
}

export default async function AdminLoginPage() {
  const status = await getSetupStatus();
  const allReady = status.dbConfigured && status.dbReady && status.passwordSet;

  return (
    <div className="px-5 pb-20">
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <AdminLoginForm />
      </Suspense>

      {!allReady && (
        <div className="mx-auto -mt-6 w-full max-w-md rounded-xl border hairline bg-ink-2/50 p-6">
          <p className="font-label text-[9px] text-dim">SETUP STATUS</p>
          <ul className="mt-3 divide-y divide-[rgba(113,134,139,0.12)]">
            <StatusRow
              ok={status.dbConfigured}
              label="Database connected"
              hint="Vercel → तुमचा project → Storage tab → Create Database → Neon (Postgres) → project ला connect करा. नंतर Redeploy करा."
            />
            <StatusRow
              ok={status.dbReady}
              label="Database ready"
              hint={
                status.dbConfigured
                  ? "Database जोडला आहे, पण tables तयार नाहीत. Vercel → Deployments → ⋯ → Redeploy करा."
                  : "आधी database connect करा, मग Redeploy केल्यावर tables आपोआप तयार होतात."
              }
            />
            <StatusRow
              ok={status.passwordSet}
              label="Admin password set"
              hint="Vercel → Settings → Environment Variables → ADMIN_PASSWORD जोडा, नंतर Redeploy करा."
            />
            <StatusRow
              ok={status.blobConfigured}
              label="Audio storage (Blob) connected"
              hint="MP3 अपलोडसाठी: Storage tab → Create → Blob → connect करा. (हे नंतरही करता येईल.)"
            />
          </ul>
          <p className="font-deva mt-4 text-xs leading-relaxed text-dim">
            प्रत्येक बदलानंतर Vercel मध्ये <strong>Redeploy</strong> करणे आवश्यक आहे — नवीन settings
            फक्त नव्या deployment मध्ये लागू होतात.
          </p>
        </div>
      )}
    </div>
  );
}
