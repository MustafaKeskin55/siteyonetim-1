"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, AlertTriangle, ShieldAlert, Sparkles, Phone, ArrowRight, LogOut } from "lucide-react";

interface SiteFrozenBarrierProps {
  role?: string | null;
  siteName?: string | null;
  planName?: string | null;
}

export function SiteFrozenBarrier({
  role = "ADMIN",
  siteName = "Binanız",
  planName = "Hizmet Paketi",
}: SiteFrozenBarrierProps) {
  const router = useRouter();
  const isManager = role === "ADMIN" || role === "SUPER_ADMIN";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-[#0d1424] rounded-3xl border-2 border-amber-400 dark:border-amber-500/60 p-6 sm:p-10 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-200">
        
        {/* Icon Header */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center ring-8 ring-amber-100 dark:ring-amber-950/40">
          <Lock className="h-8 w-8" />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            60 Günlük Lansman Deneme Süresi Doldu
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
            {siteName}
          </span>
        </div>

        {/* Main Title & Description */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Binanın Tüm İşlemleri ve Erişimi Donduruldu
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            Apartman / Sitenize lansmana özel tanımlanan <strong>60 günlük ücretsiz deneme süresi</strong> tamamlanmıştır. 
            Mevcut sakin kayıtlarınız, aidat verileriniz ve arşiviniz güvendedir; ancak yeni işlem yapma ve sistem erişimi geçici olarak durdurulmuştur.
          </p>
        </div>

        {/* Manager vs Resident Specific Blocks */}
        {isManager ? (
          <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 text-left space-y-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Yönetici Bilgilendirmesi: Hizmeti Yeniden Aktif Edin
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Binanızın ({planName}) paket aboneliğini başlatarak sakinlerinizin ve yönetim kurulunuzun erişimini anında yeniden açabilirsiniz.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/fiyatlandirma"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Paket Aboneliğini Başlat</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:08501234567"
                className="w-full sm:w-auto py-3 px-4 rounded-xl text-center bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4" />
                <span>0 (850) 123 45 67</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 text-left space-y-3">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Sakin Bilgilendirmesi
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Apartman yönetiminiz abonelik paketini aktifleştirdiğinde bina içi işlemler ve komşuluk akışınız otomatik olarak açılacaktır. Lütfen bina yöneticinizle irtibat kurunuz.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <Link href="/destek" className="hover:text-blue-600 dark:hover:text-sky-400 hover:underline">
            Yardım ve Destek Merkezi
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 hover:underline font-semibold cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Oturumu Kapat</span>
          </button>
        </div>

      </div>
    </div>
  );
}
