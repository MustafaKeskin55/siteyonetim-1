"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, UserPlus, ShieldAlert, LogIn, Eye, EyeOff } from "lucide-react";
import { SiteLogo } from "@/components/SiteLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { browserApiUrl, getBrowserApiBase } from "@/lib/browser-api-base";
import { notifyAuthChange } from "@/lib/use-session";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [usernameOrPhone, setUsernameOrPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isPendingNotice, setIsPendingNotice] = React.useState(false);
  const [authChecked, setAuthChecked] = React.useState(false);

  React.useEffect(() => {
    let active = true;

    const timer = setTimeout(() => {
      if (active) setAuthChecked(true);
    }, 1000);

    async function verifySession() {
      try {
        const response = await fetch(browserApiUrl("/api/auth/me"), {
          credentials: "include",
        });
        if (!active) return;

        if (response.ok) {
          const data = (await response.json()) as {
            authenticated?: boolean;
            user?: {
              id: string;
              role: string;
              name: string;
              siteId?: string | null;
              apartmentNo?: string | null;
              mustChangePassword?: boolean;
            };
          };

          if (data?.authenticated && data.user?.role) {
            localStorage.setItem("user", JSON.stringify(data.user));
            notifyAuthChange();
            if (data.user.mustChangePassword) {
              router.push("/sifre-belirle");
              return;
            }
            if (data.user.role === "SUPER_ADMIN" || data.user.role === "ADMIN") {
              window.location.href = "/admin";
            } else {
              window.location.href = "/dashboard";
            }
            return;
          }
        }
        localStorage.removeItem("user");
        setAuthChecked(true);
      } catch {
        if (active) {
          localStorage.removeItem("user");
          setAuthChecked(true);
        }
      } finally {
        clearTimeout(timer);
      }
    }

    verifySession();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrPhone || !password) {
      setErrorMsg("Lütfen tüm alanları doldurun.");
      setIsPendingNotice(false);
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setIsPendingNotice(false);

    try {
      const response = await fetch(browserApiUrl("/api/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernameOrPhone: usernameOrPhone.replace(/\s+/g, ""),
          password,
        }),
      });

      let data: unknown;
      try {
        data = await response.json();
      } catch {
        setErrorMsg(
          "Sunucudan geçerli bir yanıt alınamadı. Lütfen daha sonra tekrar deneyin.",
        );
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const rec =
          data !== null && typeof data === "object" ?
            (data as {
              error?: unknown;
            })
          : {};
        const errText = typeof rec.error === "string" ? rec.error : "Giriş başarısız.";
        setErrorMsg(errText);
        if (errText.includes("onayında") || errText.includes("onay")) {
          setIsPendingNotice(true);
        }
        setLoading(false);
        return;
      }

      const ok = data as {
        mustChangePassword?: boolean;
        user: { role: string; id: string; name: string; siteId?: string | null; apartmentNo?: string | null };
      };

      if (!ok?.user || typeof ok.user.role !== "string") {
        setErrorMsg("Geçersiz sunucu yanıtı.");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(ok.user));
      notifyAuthChange();

      if (ok.mustChangePassword === true) {
        router.push("/sifre-belirle");
        setLoading(false);
        return;
      }

      const targetUrl =
        ok.user.role === "SUPER_ADMIN" || ok.user.role === "ADMIN" ? "/admin" : "/dashboard";
      window.location.href = targetUrl;
    } catch (error) {
      const isNetwork = error instanceof TypeError && /fetch|network|Failed to fetch/i.test(error.message);
      const base = getBrowserApiBase();
      setErrorMsg(
        isNetwork ?
          `Sunucuya ulaşılamadı. ${base || "(mevcut adres)"}`
        : "İstek tamamlanamadı.",
      );
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#070b14] gap-4 px-4 transition-colors">
        <div className="animate-pulse text-slate-500 dark:text-slate-400 text-sm font-medium">Yükleniyor...</div>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("user");
            setAuthChecked(true);
          }}
          className="text-xs text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
        >
          Giriş formunu aç
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-[#070b14] px-4 py-12 transition-colors">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-[#0d1424] p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-300/40 dark:shadow-2xl border-2 border-slate-300 dark:border-slate-800 relative transition-colors ring-1 ring-slate-900/5">
        
        {/* ThemeToggle on top right */}
        <div className="absolute top-5 right-5">
          <ThemeToggle />
        </div>

        {/* Logo and Header */}
        <div className="flex flex-col items-center relative text-center">
          <Link href="/" className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4 shadow-sm ring-1 ring-slate-300 dark:ring-slate-700 bg-white dark:bg-slate-900 hover:scale-105 transition-transform">
            <SiteLogo width={52} height={52} rounded className="rounded-xl" alt="Site Yönetimi logosu" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Sisteme Giriş Yapın
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Site sakini veya yönetici hesabınızla erişin
          </p>
        </div>

        {errorMsg && (
          <div
            className={`p-4 text-sm rounded-2xl border-2 animate-in fade-in duration-200 ${
              isPendingNotice
                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30"
                : "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-300 dark:border-red-500/30"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Kullanıcı Adı, E-Posta veya Telefon
              </label>
              <input
                type="text"
                required
                value={usernameOrPhone}
                onChange={(e) => setUsernameOrPhone(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-sky-900/50 focus:border-blue-600 dark:focus:border-sky-400 outline-none bg-white dark:bg-slate-900 text-sm transition-all shadow-xs"
                placeholder="ornek@domain.com veya telefon no"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Şifre
                </label>
                <Link
                  href="/sifremi-unuttum"
                  className="text-xs font-semibold hover:underline text-blue-600 dark:text-sky-400"
                >
                  Şifremi unuttum?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-300 dark:border-slate-700 py-3 pl-4 pr-11 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-sky-900/50 focus:border-blue-600 dark:focus:border-sky-400 outline-none bg-white dark:bg-slate-900 text-sm transition-all shadow-xs"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  title={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white shadow-md transition-all bg-blue-600 hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span>Giriş Yapılıyor...</span>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Giriş Yap</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* Kayıt Ol Linki */}
        <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-900/90 border border-blue-200 dark:border-slate-800 flex items-center justify-between transition-colors shadow-xs">
          <div className="text-xs">
            <span className="font-bold block text-slate-900 dark:text-white">Hesabınız yok mu?</span>
            <span className="text-slate-600 dark:text-slate-400">Sakin veya yönetici hesabı oluşturun.</span>
          </div>
          <Link
            href="/kayit"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all shrink-0"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Hesap Aç
          </Link>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            &larr; Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
