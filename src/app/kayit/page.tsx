"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Building2,
  User,
  Mail,
  Lock,
  Home,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

type VerifiedSite = {
  id: string;
  name: string;
  address?: string | null;
  inviteCode: string;
  apartmentNo?: string | null;
};

function RegisterFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCode = searchParams.get("kod") || searchParams.get("code") || "";
  const initialDaire = searchParams.get("daire") || searchParams.get("apt") || "";
  const initialPlanParam = (searchParams.get("plan") || searchParams.get("paket") || "").toLowerCase();
  const initialPlan: "starter" | "professional" | "enterprise" =
    initialPlanParam === "starter" || initialPlanParam === "enterprise"
      ? initialPlanParam
      : "professional";

  const initialRoleParam = (searchParams.get("role") || searchParams.get("tip") || "").toUpperCase();
  const initialAccountType: "RESIDENT" | "MANAGER" =
    initialRoleParam === "MANAGER" || initialRoleParam === "YONETICI" || searchParams.has("plan")
      ? "MANAGER"
      : "RESIDENT";

  const [accountType, setAccountType] = React.useState<"RESIDENT" | "MANAGER">(initialAccountType);
  const [selectedPlan, setSelectedPlan] = React.useState<"starter" | "professional" | "enterprise">(initialPlan);
  const [name, setName] = React.useState("");
  const [emailOrPhone, setEmailOrPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(true);

  // Sakin için: Katılım Kodu & Daire
  const [inviteCode, setInviteCode] = React.useState(initialCode);
  const [apartmentNo, setApartmentNo] = React.useState(initialDaire);
  const [verifyingCode, setVerifyingCode] = React.useState(false);
  const [verifiedSite, setVerifiedSite] = React.useState<VerifiedSite | null>(null);
  const [codeError, setCodeError] = React.useState("");

  // Yönetici için: Yeni Site Adı
  const [newSiteName, setNewSiteName] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successData, setSuccessData] = React.useState<{ message: string } | null>(null);

  // Katılım Kodunu Doğrulama Fonksiyonu
  const verifyCode = React.useCallback(async (codeToVerify: string) => {
    const clean = codeToVerify.trim();
    if (!clean || clean.length < 3) {
      setVerifiedSite(null);
      setCodeError("");
      return;
    }

    setVerifyingCode(true);
    setCodeError("");

    try {
      const res = await fetch(`/api/public/sites/verify-code?code=${encodeURIComponent(clean)}`);
      const data = (await res.json()) as { ok?: boolean; valid?: boolean; site?: VerifiedSite; error?: string };

      if (res.ok && data.valid && data.site) {
        setVerifiedSite(data.site);
        setCodeError("");
        if (data.site.apartmentNo && !apartmentNo) {
          setApartmentNo(data.site.apartmentNo);
        }
      } else {
        setVerifiedSite(null);
        setCodeError(data?.error || "Geçersiz katılım kodu. Yöneticinizin verdiği kodu kontrol edin.");
      }
    } catch {
      setVerifiedSite(null);
      setCodeError("Kod kontrol edilirken bağlantı hatası oluştu.");
    } finally {
      setVerifyingCode(false);
    }
  }, [apartmentNo]);

  // URL'den kod geldiyse ilk yüklemede otomatik doğrula
  React.useEffect(() => {
    if (initialCode) {
      void verifyCode(initialCode);
    }
  }, [initialCode, verifyCode]);

  // Kod değiştiğinde 400ms debounce ile doğrula
  React.useEffect(() => {
    if (!inviteCode.trim() || inviteCode === initialCode) return;
    const timer = setTimeout(() => {
      void verifyCode(inviteCode);
    }, 450);
    return () => clearTimeout(timer);
  }, [inviteCode, initialCode, verifyCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Lütfen adınızı ve soyadınızı girin.");
      return;
    }
    if (!emailOrPhone.trim()) {
      setErrorMsg("Lütfen geçerli bir e-posta veya telefon numarası girin.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Şifreniz en az 6 karakter olmalıdır.");
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMsg("Girdiğiniz şifreler birbiriyle eşleşmiyor.");
      return;
    }
    if (!termsAccepted) {
      setErrorMsg("Devam etmek için kullanım şartlarını kabul etmelisiniz.");
      return;
    }

    if (accountType === "RESIDENT") {
      if (!inviteCode.trim()) {
        setErrorMsg("Lütfen yöneticinizin size verdiği Site Katılım Kodunu girin.");
        return;
      }
      if (!apartmentNo.trim()) {
        setErrorMsg("Lütfen daire / kapı numaranızı belirtin.");
        return;
      }
    }

    if (accountType === "MANAGER") {
      if (!newSiteName.trim()) {
        setErrorMsg("Lütfen yöneteceğiniz site / apartman adını belirtin.");
        return;
      }
      if (!selectedPlan) {
        setErrorMsg("Lütfen binanız için bir hizmet paketi seçin.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          emailOrPhone: emailOrPhone.trim().toLowerCase(),
          password,
          accountType,
          inviteCode: accountType === "RESIDENT" ? inviteCode.trim() : undefined,
          siteId: accountType === "RESIDENT" && verifiedSite ? verifiedSite.id : undefined,
          apartmentNo: accountType === "RESIDENT" ? apartmentNo.trim() : undefined,
          newSiteName: accountType === "MANAGER" ? newSiteName.trim() : undefined,
          selectedPlan: accountType === "MANAGER" ? selectedPlan : undefined,
        }),
      });

      const data = (await res.json()) as { error?: string; message?: string };

      if (!res.ok) {
        setErrorMsg(data?.error || "Kayıt işlemi başarısız oldu. Lütfen bilgilerinizi kontrol edin.");
        setSubmitting(false);
        return;
      }

      setSuccessData({
        message: data?.message || "Kaydınız başarıyla oluşturuldu.",
      });
      setSubmitting(false);
    } catch {
      setErrorMsg("Sunucuya bağlanırken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 sm:py-16 w-full flex items-center justify-center">
        {successData ? (
          /* Başarılı Kayıt Bildirim Kartı */
          <div className="w-full max-w-lg bg-white dark:bg-[#0d1424] rounded-3xl p-8 sm:p-10 shadow-xl border-2 border-slate-300 dark:border-slate-800 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/80 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50/50 dark:ring-emerald-900/20">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-300 dark:border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {accountType === "MANAGER" ? "SİTE VE YÖNETİCİ HESABI AKTİF" : "KAYDINIZ TAMAMLANDI"}
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              Hesabınız Başarıyla Oluşturuldu!
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {successData.message}
            </p>

            <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-2xl p-4 text-left space-y-2.5 mb-8 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-900 dark:text-white shrink-0">1. Adım:</span>
                <span>
                  {accountType === "MANAGER"
                    ? "Yönetici panelinize giriş yaparak sitenizi ve sakinlerinizi yönetmeye başlayabilirsiniz."
                    : "Belirlediğiniz şifre ile sisteme hemen giriş yapabilirsiniz."}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-900 dark:text-white shrink-0">2. Adım:</span>
                <span>
                  {accountType === "MANAGER"
                    ? "Panelinizdeki özel 'Site Katılım Kodu'nu apartman sakinlerinizle paylaşın."
                    : "Topluluk sohbetine katılabilir, anketleri oylayabilir ve duyuruları takip edebilirsiniz."}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/login"
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm text-center"
              >
                Giriş Sayfasına Git
              </Link>
              <Link
                href="/"
                className="py-3 px-4 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-center"
              >
                Ana Sayfa
              </Link>
            </div>
          </div>
        ) : (
          /* Kayıt Formu */
          <div className="w-full max-w-xl bg-white dark:bg-[#0d1424] rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-300/40 dark:shadow-2xl border-2 border-slate-300 dark:border-slate-800 transition-colors ring-1 ring-slate-900/5">
            {/* Başlık & Rol Seçici */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-sky-400 mb-3 shadow-xs border border-blue-200/60 dark:border-blue-800">
                <Building2 className="h-6 w-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Yeni Hesap Oluşturun
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                Apartman ve site yönetim sistemine dakikalar içinde katılın
              </p>

              {/* Rol Değiştirme Butonları */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl mt-6 border border-slate-300 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAccountType("RESIDENT")}
                  className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    accountType === "RESIDENT"
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Daire Sakiniyim
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("MANAGER")}
                  className={`py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    accountType === "MANAGER"
                      ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Site Yöneticisiyim
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs sm:text-sm font-medium animate-in fade-in flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Daire Sakini İse: Site Katılım Kodu */}
              {accountType === "RESIDENT" ? (
                <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        Site Katılım Kodu (Davet Kodu) <span className="text-rose-500">*</span>
                      </label>
                      {verifyingCode && (
                        <span className="text-[11px] text-blue-600 dark:text-sky-400 font-semibold flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> Kontrol ediliyor...
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Örn: LALE-8421 veya LALE-8421-D12"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-mono font-bold tracking-wide outline-none transition-all ${
                          verifiedSite
                            ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 focus:ring-2 focus:ring-emerald-200"
                            : codeError
                            ? "border-rose-400 bg-rose-50/40 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 focus:ring-2 focus:ring-rose-200"
                            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Doğrulandıysa Otomatik Site Bilgisi Rozeti */}
                  {verifiedSite ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-300 animate-in fade-in">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-emerald-950 dark:text-emerald-200">
                          Site: {verifiedSite.name}
                        </p>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                          {verifiedSite.address || "Sistemde kayıtlı site"} &bull; Kod: {verifiedSite.inviteCode}
                        </p>
                      </div>
                    </div>
                  ) : codeError ? (
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{codeError}</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      💡 Site yöneticinizin WhatsApp veya panodan paylaştığı katılım kodunu girin. Site adı otomatik eşleşecektir.
                    </p>
                  )}

                  {/* Daire / Kapı No */}
                  <div className="pt-1">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                      Daire / Kapı No <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Örn: Daire 8 veya Blok A - No 14"
                        value={apartmentNo}
                        onChange={(e) => setApartmentNo(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* 2. Yönetici İse: Yeni Site Adı & Zorunlu Paket Seçimi */
                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 dark:bg-slate-900/90 border border-blue-100 dark:border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                      Yöneteceğiniz Site / Apartman Adı <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Örn: Güneş Sitesi veya Huzur Apt."
                        value={newSiteName}
                        onChange={(e) => setNewSiteName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-blue-700 dark:text-sky-400 pt-1">
                      ✨ Kayıt sonrasında sakinlerinize vereceğiniz <strong>Site Katılım Kodu</strong> otomatik üretilecektir.
                    </p>
                  </div>

                  {/* ZORUNLU PAKET SEÇİMİ */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0c1424] border-2 border-slate-300 dark:border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-1 border-b border-slate-200 dark:border-slate-800">
                      <div>
                        <label className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Hizmet Paketi Seçimi <span className="text-rose-500 font-bold">* (Zorunlu)</span>
                        </label>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Binanızın büyüklüğüne göre uygun paketi seçiniz.
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-300 dark:border-emerald-700 w-fit">
                        <Sparkles className="h-3 w-3" />
                        Lansmana Özel 60 Gün Ücretsiz
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {[
                        {
                          id: "starter" as const,
                          name: "Başlangıç",
                          badge: "1 - 50 Daire",
                          price: "₺59",
                          bullets: ["Sakin Kaydı & Onayı", "Resmi Duyuru Panosu", "Fotoğraflı Arıza Takibi", "KVKK Gizli Numara Ağı"],
                        },
                        {
                          id: "professional" as const,
                          name: "Profesyonel",
                          badge: "50 - 200 Daire",
                          isPopular: true,
                          price: "₺109",
                          bullets: ["Başlangıç'a Ek Olarak:", "24s Komşuluk Hikayeleri", "Komşuluk Ağı & DM", "Bina İçi Canlı Anketler", "Mobil PWA Bildirim"],
                        },
                        {
                          id: "enterprise" as const,
                          name: "Kurumsal / VIP",
                          badge: "200+ Daire",
                          price: "₺209",
                          bullets: ["Profesyonel'e Ek Olarak:", "Çoklu Blok Yönetimi", "Dedicated Yönetici Desteği", "Özel Entegrasyon & API", "PageSpeed Analizi"],
                        },
                      ].map((pkg) => {
                        const isSelected = selectedPlan === pkg.id;
                        return (
                          <div
                            key={pkg.id}
                            onClick={() => setSelectedPlan(pkg.id)}
                            className={`relative rounded-xl p-3.5 border-2 cursor-pointer transition-all flex flex-col justify-between ${
                              isSelected
                                ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-500/20"
                                : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                            }`}
                          >
                            {pkg.isPopular && (
                              <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                                En Çok Tercih Edilen
                              </span>
                            )}
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                                  {pkg.name}
                                </h4>
                                <span className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 dark:border-slate-600"
                                }`}>
                                  {isSelected && <CheckCircle2 className="h-3 w-3" />}
                                </span>
                              </div>
                              <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded">
                                {pkg.badge}
                              </span>
                              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-base font-black text-slate-900 dark:text-white">
                                    0 ₺
                                  </span>
                                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
                                    (İlk 60 Gün)
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                  Sonrasında {pkg.price}/ay
                                </p>
                              </div>
                              <ul className="mt-2.5 space-y-1 text-[10px] text-slate-600 dark:text-slate-400">
                                {pkg.bullets.map((b, bi) => (
                                  <li key={bi} className="flex items-start gap-1">
                                    <span className="text-blue-600 dark:text-sky-400 font-bold">✓</span>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-300">
                      <Clock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <div>
                        <strong>Otomatik Dondurma Kuralı:</strong> Lansmana özel 60 günlük ücretsiz deneme süresi sonunda paket yenilenmediği takdirde binanın tüm işlemleri ve sakin erişimleri otomatik olarak dondurulacaktır.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ad Soyad */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Ad Soyad <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Örn: Ahmet Yılmaz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* E-posta veya Telefon */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  E-Posta Adresi veya Telefon <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="ornek@domain.com veya 0532..."
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Onay ve şifre sıfırlama bildirimleri bu adrese iletilecektir.
                </p>
              </div>

              {/* Şifre ve Tekrar */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Şifre <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm transition-all"
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
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Şifre Tekrar <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type={showPasswordConfirm ? "text" : "password"}
                      required
                      placeholder="••••••"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                      tabIndex={-1}
                      aria-label={showPasswordConfirm ? "Şifreyi gizle" : "Şifreyi göster"}
                      title={showPasswordConfirm ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* KVKK ve Şartlar */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    <Link href="/kullanim-sartlari" className="text-blue-600 dark:text-sky-400 underline font-medium">
                      Kullanım Şartları
                    </Link>{" "}
                    ve{" "}
                    <Link href="/gizlilik-politikasi" className="text-blue-600 dark:text-sky-400 underline font-medium">
                      Gizlilik Politikası
                    </Link>
                    &apos;nı okudum, kabul ediyorum.
                  </span>
                </label>
              </div>

              {/* Gönder Butonu */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {submitting ? (
                  <span>Hesap Oluşturuluyor...</span>
                ) : (
                  <>
                    <span>Kaydı Tamamla</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="pt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                Zaten bir hesabınız var mı?{" "}
                <Link href="/login" className="font-bold text-blue-600 dark:text-sky-400 hover:underline">
                  Giriş Yapın
                </Link>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Yükleniyor...</div>}>
      <RegisterFormInner />
    </React.Suspense>
  );
}
