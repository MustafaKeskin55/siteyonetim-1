"use client";

import * as React from "react";
import Link from "next/link";
import { browserApiUrl } from "@/lib/browser-api-base";
import { readJsonError } from "@/lib/json-error";
import { SiteLogo } from "@/components/SiteLogo";

export default function SifremiUnuttumPage() {
  const [email, setEmail] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const [err, setErr] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [emailReady, setEmailReady] = React.useState<boolean | null>(null);
  const [emailMissing, setEmailMissing] = React.useState<string[]>([]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const res = await fetch(browserApiUrl("/api/setup/status"));
      const j: unknown = await res.json().catch(() => null);
      if (!alive) return;
      const ok =
        j !== null &&
        typeof j === "object" &&
        "emailConfigured" in j &&
        (j as { emailConfigured: unknown }).emailConfigured === true;
      setEmailReady(ok);
      const missing =
        j !== null &&
        typeof j === "object" &&
        "emailMissing" in j &&
        Array.isArray((j as { emailMissing: unknown }).emailMissing) ?
          (j as { emailMissing: string[] }).emailMissing
        : [];
      setEmailMissing(missing);
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setBusy(true);
    try {
      const res = await fetch(browserApiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const j: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        setErr(readJsonError(j, "İstek başarısız."));
        setBusy(false);
        return;
      }
      const m =
        j !== null && typeof j === "object" && "message" in j && typeof (j as { message: unknown }).message === "string"
          ? (j as { message: string }).message
          : "İşlem kaydedildi.";
      setMsg(m);
    } catch {
      setErr("Sunucuya ulaşılamadı.");
    }
    setBusy(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#070b14] px-4 py-12 transition-colors">
      <div className="w-full max-w-md p-8 rounded-3xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0d1424] shadow-xl ring-1 ring-slate-900/5 space-y-6">
        <div className="flex justify-center">
          <SiteLogo width={64} height={64} rounded className="rounded-xl ring-1 ring-slate-300 dark:ring-slate-700 shadow-xs" alt="" />
        </div>
        <div className="text-center space-y-1">
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Şifre sıfırlama</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Kayıtlı <strong>e-posta adresinize</strong> sıfırlama bağlantısı gönderilir. Sistemde
            kayıtlı olmayan bir adres için mail gönderilmez.
          </p>
        </div>
        {emailReady === false && (
          <div className="text-xs rounded-xl border-2 border-amber-300 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 p-3 space-y-1">
            <p className="font-semibold">
              Sunucuda e-posta ayarları henüz tamamlanmadı.
              {emailMissing.length > 0 ? (
                <> Eksik değişken: <strong>{emailMissing.join(", ")}</strong></>
              ) : null}
            </p>
            <p className="text-[11px] text-amber-800 dark:text-amber-300">
              Lütfen Cloudflare / Sunucu panelinizden <code>RESEND_API_KEY</code> ortam değişkenini tanımlayın.
            </p>
          </div>
        )}
        {msg ? (
          <div className="text-sm rounded-xl border-2 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 p-3 font-medium">
            {msg}
          </div>
        ) : null}
        {err ? <div className="text-sm text-rose-600 dark:text-rose-400 p-2 font-medium">{err}</div> : null}
        {!msg ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1 block">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-3 px-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 shadow-xs transition-all"
                placeholder="Kayıtlı e-posta adresiniz"
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              disabled={busy || emailReady === false}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-60 cursor-pointer"
            >
              {busy ? "Gönderiliyor..." : "Sıfırlama bağlantısı gönder"}
            </button>
          </form>
        ) : null}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          <Link href="/login" className="underline font-semibold text-blue-600 dark:text-sky-400 hover:underline">
            Girişe dön
          </Link>
        </p>
      </div>
    </div>
  );
}
