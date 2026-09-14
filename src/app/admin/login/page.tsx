import { Suspense } from "react";
import AdminLoginForm from "./AdminLoginForm";
import { hasAdminPassword } from "@/lib/auth";
import { ensureDatabaseUrl, getDatabaseDiagnostics, hasDatabase } from "@/lib/db-url";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type SetupStatus = {
  dbConfigured: boolean;
  dbReady: boolean;
  passwordSet: boolean;
  blobConfigured: boolean;
  dbSource: string | null;
  envKeysFound: string[];
};

async function getSetupStatus(): Promise<SetupStatus> {
  const diagnostics = getDatabaseDiagnostics();
  const dbConfigured = hasDatabase();
  ensureDatabaseUrl();
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
    passwordSet: hasAdminPassword(),
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    dbSource: diagnostics.source,
    envKeysFound: diagnostics.envKeysFound,
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
              hint={
                status.envKeysFound.length > 0
                  ? `Database variables सापडल्या (${status.envKeysFound.slice(0, 4).join(", ")}${status.envKeysFound.length > 4 ? "…" : ""}) पण URL resolve झाला नाही. Vercel → Storage → तुमचा database → Projects tab → Connect Project → Production check करा, नंतर Redeploy.`
                  : "कोणतीही database variable सापडली नाही. Vercel → Storage → database → Projects tab → Connect Project → Production साठी connect करा, नंतर Redeploy."
              }
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
              hint="Vercel → Settings → Environment Variables → Key: SANGEET_ADMIN_PASSWORD, Value: तुमचा password. Production साठी check करा, Save, नंतर Redeploy."
            />
            <StatusRow
              ok={status.blobConfigured}
              label="Audio storage (Blob) connected"
              hint="MP3 अपलोडसाठी: Storage tab → Create → Blob → connect करा. (हे नंतरही करता येईल.)"
            />
          </ul>
          {status.dbConfigured && status.dbSource && (
            <p className="font-label mt-3 text-[8px] text-teal-bright">
              DB detected via {status.dbSource}
            </p>
          )}
          {status.envKeysFound.length > 0 && (
            <p className="font-label mt-3 text-[8px] text-dim">
              Env keys on server: {status.envKeysFound.join(", ")}
            </p>
          )}
          <p className="font-deva mt-4 text-xs leading-relaxed text-dim">
            प्रत्येक बदलानंतर Vercel मध्ये <strong>Redeploy</strong> करणे आवश्यक आहे — नवीन settings
            फक्त नव्या deployment मध्ये लागू होतात.
          </p>
          <p className="font-deva mt-2 text-xs leading-relaxed text-dim">
            महत्वाचे: database तयार केल्यानंतर <strong>Projects tab</strong> मध्ये तुमचा Vercel project
            निवडून <strong>Connect</strong> करा — फक्त database तयार करणे पुरे नाही.
          </p>
        </div>
      )}
    </div>
  );
}
