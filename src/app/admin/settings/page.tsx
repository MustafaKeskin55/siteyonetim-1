"use client";

import * as React from "react";
import { Settings, Save, ShieldAlert, CreditCard, Building } from "lucide-react";
import { browserApiUrl } from "@/lib/browser-api-base";
import { useAlert } from "@/components/ModalProvider";

type SettingsShape = {
  aidat: string;
  managerName: string;
  iban: string;
  bankName: string;
  phone: string;
};

export default function AdminSettingsPage() {
  const showAlert = useAlert();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [loadErr, setLoadErr] = React.useState("");
  const [aidat, setAidat] = React.useState("");
  const [managerName, setManagerName] = React.useState("");
  const [iban, setIban] = React.useState("");
  const [bankName, setBankName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [residentCount, setResidentCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadErr("");
      try {
        const [sRes, rRes] = await Promise.all([
          fetch(browserApiUrl("/api/settings"), { credentials: "include" }),
          fetch(browserApiUrl("/api/admin/residents"), { credentials: "include" }),
        ]);
        if (!sRes.ok) {
          const j = (await sRes.json().catch(() => null)) as { error?: string } | null;
          throw new Error(j?.error ?? "Ayarlar yüklenemedi.");
        }
        const s = (await sRes.json()) as SettingsShape;
        if (cancelled) return;
        setAidat(s.aidat ?? "");
        setManagerName(s.managerName ?? "");
        setIban(s.iban ?? "");
        setBankName(s.bankName ?? "");
        setPhone(s.phone ?? "");

        if (rRes.ok) {
          const list = (await rRes.json()) as unknown[];
          if (!cancelled) setResidentCount(Array.isArray(list) ? list.length : 0);
        } else if (!cancelled) {
          setResidentCount(null);
        }
      } catch (e) {
        if (!cancelled) setLoadErr(e instanceof Error ? e.message : "Yükleme hatası.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setLoadErr("");
    try {
      const res = await fetch(browserApiUrl("/api/settings"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aidat,
          managerName,
          iban,
          bankName,
          phone,
        }),
      });
      const j = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(j?.error ?? "Kayıt başarısız.");
      await showAlert({ message: "Site ayarları veritabanına kaydedildi.", variant: "success" });
    } catch (err) {
      await showAlert({ message: err instanceof Error ? err.message : "Kayıt başarısız.", variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto pb-16 text-slate-900 dark:text-slate-100 transition-colors">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400 shrink-0" />
          Site Ayarları
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Aidat tarifesi, banka ve iletişim bilgileri sunucudaki SQLite veritabanında saklanır.
        </p>
      </div>

      {loadErr && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm font-semibold text-amber-900 dark:text-amber-200">
          {loadErr}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 p-5 rounded-3xl border border-blue-200/80 dark:border-blue-900/40">
            <h4 className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider mb-2 text-blue-800 dark:text-blue-300">
              <ShieldAlert className="h-4 w-4" /> Önemli Not
            </h4>
            <p className="text-xs leading-relaxed text-blue-950/90 dark:text-blue-200">
              Burada değiştireceğiniz aidat miktarı, yeni borçlandırmalarda varsayılan değer olarak alınacaktır.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs text-center transition-colors">
            <Building className="h-10 w-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h5 className="font-bold text-sm text-slate-900 dark:text-white">Kayıtlı Sakinler</h5>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {residentCount === null ? "—" : `${residentCount}`}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs transition-colors">
          {loading ? (
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 py-8 text-center">Ayarlar yükleniyor…</p>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Yönetim / Şirket Ünvanı
                </label>
                <input
                  type="text"
                  required
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#090e1b] py-3 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900 dark:text-white font-semibold text-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Aylık Aidat (₺)
                  </label>
                  <input
                    type="number"
                    required
                    value={aidat}
                    onChange={(e) => setAidat(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#090e1b] py-3 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-blue-600 dark:text-blue-400 font-bold text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Yönetim İletişim Tel
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#090e1b] py-3 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900 dark:text-white font-semibold text-sm transition-all"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-5 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" /> Havale/EFT Banka Bilgileri
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Banka Adı
                    </label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#090e1b] py-3 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900 dark:text-white text-sm transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      IBAN Numarası
                    </label>
                    <input
                      type="text"
                      required
                      value={iban}
                      onChange={(e) => setIban(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#090e1b] py-3 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900 dark:text-white font-mono text-xs transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-2xl font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer text-sm"
                >
                  <Save className="h-4.5 w-4.5" />
                  <span>{saving ? "Kaydediliyor…" : "Ayarları Kaydet"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* E-posta & Bildirim Test Paneli */}
      <AdminNotificationTestCard />
    </div>
  );
}

function AdminNotificationTestCard() {
  const [testEmail, setTestEmail] = React.useState("");
  const [emailSending, setEmailSending] = React.useState(false);
  const [emailResult, setEmailResult] = React.useState<{ ok: boolean; message: string } | null>(null);

  const [notifSending, setNotifSending] = React.useState(false);
  const [notifResult, setNotifResult] = React.useState<{ ok: boolean; message: string } | null>(null);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes("@")) return;

    setEmailSending(true);
    setEmailResult(null);

    try {
      const res = await fetch("/api/admin/email/test", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testEmail, type: "default" }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string; error?: string } | null;

      if (res.ok && data?.ok) {
        setEmailResult({ ok: true, message: data.message || "Test e-postası başarıyla gönderildi!" });
      } else {
        setEmailResult({
          ok: false,
          message: data?.error || "E-posta gönderilemedi. Lütfen RESEND_API_KEY anahtarınızı kontrol edin.",
        });
      }
    } catch {
      setEmailResult({ ok: false, message: "Sunucuya bağlanılamadı." });
    } finally {
      setEmailSending(false);
    }
  };

  const handleSendTestNotification = async () => {
    setNotifSending(true);
    setNotifResult(null);

    try {
      const res = await fetch("/api/admin/notifications/test", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Sistem Bildirim Testi 🔔",
          body: `Test başarılı! Saat: ${new Date().toLocaleTimeString("tr-TR")}. Bildirim zili ve sistemi aktif çalışıyor.`,
          type: "SYSTEM",
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; message?: string; error?: string } | null;

      if (res.ok && data?.ok) {
        setNotifResult({ ok: true, message: data.message || "Test bildirimi oluşturuldu! Yukarıdaki zili kontrol edin." });
      } else {
        setNotifResult({ ok: false, message: data?.error || "Bildirim oluşturulamadı." });
      }
    } catch {
      setNotifResult({ ok: false, message: "Sunucuya bağlanılamadı." });
    } finally {
      setNotifSending(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
      <div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Bildirim &amp; E-posta Altyapı Testi
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          E-posta (Resend) ve sistem içi bildirim zili altyapınızı canlı olarak test edin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sistem İçi Bildirim Testi */}
        <div className="bg-slate-50 dark:bg-[#090e1b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between transition-colors">
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              🔔 Sistem İçi Bildirim Testi
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Bu buton ile hesabınıza anında bir test bildirimi gönderilir ve yukarıdaki bildirim zilinde kırmızı rozet belirir.
            </p>
          </div>

          {notifResult && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold ${
                notifResult.ok
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40"
              }`}
            >
              {notifResult.message}
            </div>
          )}

          <button
            type="button"
            onClick={handleSendTestNotification}
            disabled={notifSending}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {notifSending ? "Bildirim Oluşturuluyor…" : "Sistem İçi Bildirim Gönder"}
          </button>
        </div>

        {/* E-posta Gönderim Testi */}
        <div className="bg-slate-50 dark:bg-[#090e1b] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between transition-colors">
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              ✉️ Resend E-posta Gönderim Testi
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Belirttiğiniz e-posta adresine Resend API üzerinden test e-postası iletilir.
            </p>
          </div>

          <form onSubmit={handleSendTestEmail} className="space-y-3">
            <input
              type="email"
              required
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="ornek@alanadiniz.com"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070b14] py-2.5 px-3.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />

            {emailResult && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold leading-relaxed ${
                  emailResult.ok
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                    : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40"
                }`}
              >
                {emailResult.message}
              </div>
            )}

            <button
              type="submit"
              disabled={emailSending}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              {emailSending ? "E-posta Gönderiliyor…" : "Test E-postası Gönder"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
