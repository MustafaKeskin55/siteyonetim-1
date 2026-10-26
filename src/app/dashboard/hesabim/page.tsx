"use client";

import * as React from "react";
import Link from "next/link";
import { readJsonError } from "@/lib/json-error";
import { KeyRound, Mail, User, ShieldAlert, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";

type ResidentAccountInfo = {
  id: string;
  name: string;
  emailOrPhone: string;
  role: string;
  apartmentNo?: string | null;
  siteName?: string | null;
};

export default function ResidentAccountPage() {
  const [info, setInfo] = React.useState<ResidentAccountInfo | null>(null);
  const [name, setName] = React.useState("");
  const [login, setLogin] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [showNewPass, setShowNewPass] = React.useState(false);
  const [confirmPass, setConfirmPass] = React.useState("");
  const [showConfirmPass, setShowConfirmPass] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [msg, setMsg] = React.useState("");

  // Hesap Silme
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deletePassword, setDeletePassword] = React.useState("");
  const [showDeletePassword, setShowDeletePassword] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteErr, setDeleteErr] = React.useState("");

  const load = React.useCallback(async () => {
    setErr("");
    try {
      const res = await fetch("/api/admin/account", { credentials: "include" });
      const j: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        setErr(readJsonError(j, "Hesap bilgisi alınamadı."));
        return;
      }
      const data = j as ResidentAccountInfo;
      setInfo(data);
      setName(data.name);
      setLogin(data.emailOrPhone);
    } catch {
      setErr("Sunucuya bağlanılamadı.");
    }
  }, []);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      await load();
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr("");
    setMsg("");

    const payload: Record<string, string> = {
      name: name.trim(),
      emailOrPhone: login.replace(/\s+/g, "").trim(),
    };
    if (newPass.trim()) {
      if (newPass.length < 6) {
        setErr("Yeni şifre en az 6 karakter olmalıdır.");
        setSaving(false);
        return;
      }
      if (newPass !== confirmPass) {
        setErr("Yeni şifreler eşleşmiyor.");
        setSaving(false);
        return;
      }
      payload.newPassword = newPass;
      payload.confirmPassword = confirmPass;
    }

    try {
      const res = await fetch("/api/admin/account", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j: unknown = await res.json().catch(() => null);
      setSaving(false);

      if (!res.ok) {
        setErr(readJsonError(j, "Bilgiler kaydedilemedi."));
        return;
      }

      setMsg("Hesap bilgileriniz başarıyla güncellendi.");
      setNewPass("");
      setConfirmPass("");
      await load();
    } catch {
      setErr("Sunucuya bağlanılamadı.");
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!deletePassword) {
      setDeleteErr("Lütfen mevcut şifrenizi girin.");
      return;
    }
    setDeleting(true);
    setDeleteErr("");

    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = (await res.json().catch(() => null)) as { error?: string; ok?: boolean } | null;

      if (!res.ok) {
        setDeleteErr(data?.error || "Hesap silinemedi. Lütfen şifrenizi kontrol edin.");
        setDeleting(false);
        return;
      }

      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch {}
      window.location.replace("/login?deleted=1");
    } catch {
      setDeleteErr("Sunucuya bağlanırken bir hata oluştu.");
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-8 space-y-6 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1424] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs"
          title="Geri Dön"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Hesabım &amp; Profil</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kişisel bilgilerinizi ve şifrenizi güncelleyin.</p>
        </div>
      </div>

      {(err || msg) && (
        <div className="space-y-2 animate-in fade-in">
          {err && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 text-xs font-semibold flex items-center gap-2.5">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{err}</span>
            </div>
          )}
          {msg && !err && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold flex items-center gap-2.5">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{msg}</span>
            </div>
          )}
        </div>
      )}

      {/* Profil Güncelleme Kartı */}
      <section className="bg-white dark:bg-[#0d1424] rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-5 transition-colors">
        <form onSubmit={save} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <User className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              Ad Soyad
            </label>
            <input
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 px-4 py-3 bg-slate-50 dark:bg-[#090e1b] text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              placeholder="Adınız ve Soyadınız"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              E‑posta veya Telefon (Giriş Bilgisi)
            </label>
            <input
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 px-4 py-3 bg-slate-50 dark:bg-[#090e1b] text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              disabled={loading}
              placeholder="ornek@domain.com veya 05XX..."
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Şifre Değiştir</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1 mb-1.5">
                  <KeyRound className="h-3 w-3 text-slate-400" />
                  Yeni Şifre
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 pl-4 pr-11 py-2.5 bg-slate-50 dark:bg-[#090e1b] text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-[#070b14] focus:border-blue-600 transition placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Boş bırakırsanız değişmez"
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                    tabIndex={-1}
                    aria-label={showNewPass ? "Şifreyi gizle" : "Şifreyi göster"}
                    title={showNewPass ? "Şifreyi gizle" : "Şifreyi göster"}
                  >
                    {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">Yeni Şifre (Tekrar)</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 pl-4 pr-11 py-2.5 bg-slate-50 dark:bg-[#090e1b] text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-[#070b14] focus:border-blue-600 transition placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Yeni şifreyi doğrulayın"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                    tabIndex={-1}
                    aria-label={showConfirmPass ? "Şifreyi gizle" : "Şifreyi göster"}
                    title={showConfirmPass ? "Şifreyi gizle" : "Şifreyi göster"}
                  >
                    {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || loading}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Kaydediliyor…" : "Bilgileri Güncelle"}
          </button>
        </form>
      </section>

      {/* Tehlikeli Bölge: Hesabı Kalıcı Olarak Sil */}
      <section className="rounded-3xl bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-6 space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              Hesabı Kalıcı Olarak Sil
            </h2>
            <p className="text-xs text-rose-700 dark:text-rose-400/90 mt-1 leading-relaxed">
              Hesabınızı sildiğinizde daire kaydınız, profiliniz ve mesajlarınız <strong className="text-rose-800 dark:text-rose-200">kalıcı olarak geri getirilemez şekilde silinir (KVKK uyumlu)</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm shadow-rose-600/20 cursor-pointer self-start sm:self-auto"
          >
            Hesabı Sil
          </button>
        </div>
      </section>

      {/* Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#0d1424] rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center font-bold text-xl shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Hesabı Kalıcı Olarak Sil</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Bu işlem geri alınamaz.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Hesabınızı ve daire erişiminizi kalıcı olarak silmek istediğinizden emin misiniz? Onaylamak için lütfen <strong className="text-slate-900 dark:text-white">mevcut şifrenizi</strong> girin:
            </p>

            {deleteErr && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 text-xs font-medium">
                {deleteErr}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">Mevcut Şifreniz</label>
              <div className="relative">
                <input
                  type={showDeletePassword ? "text" : "password"}
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 pl-4 pr-11 py-3 bg-slate-50 dark:bg-[#090e1b] text-slate-900 dark:text-white text-sm focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition outline-none"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Mevcut şifrenizi yazın"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showDeletePassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  title={showDeletePassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeleteErr("");
                }}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting || !deletePassword}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm shadow-rose-600/20 disabled:opacity-50 transition cursor-pointer"
              >
                {deleting ? "Siliniyor…" : "Kalıcı Olarak Sil"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
