import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Sparkles, Users, Lock, Award, HeartHandshake, ArrowRight, Camera } from "lucide-react";
import { getPublicSiteUrl } from "@/lib/site-url";
const canon = `${getPublicSiteUrl()}/hakkimizda`;

export const metadata: Metadata = {
  title: "Hakkımızda & Vizyonumuz | Site Yönetimi",
  description:
    "Apartman ve toplu yaşam alanlarında huzur, numarasız güvenli iletişim ve sosyal komşuluk sağlayan yönetim platformumuz hakkında bilgi edinin.",
  alternates: { canonical: canon },
};

export default function Hakkimizda() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Header */}
      <section className="pt-16 pb-12 bg-slate-50 dark:bg-[#090e1b] border-b border-slate-300 dark:border-slate-800 text-center transition-colors">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-700 dark:text-sky-300 font-semibold bg-blue-50 dark:bg-blue-950/80 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
            BİZ KİMİZ?
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-4 mb-4">
            Komşulukta Güven ve Canlı Sosyal Yaşam
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Apartman ve site yaşamının karşılaştığı iletişim kaosu, numara ifşası ve organizasyon zorluklarını modern sosyal teknolojiyle çözüyoruz.
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-16 w-full space-y-16">
        
        {/* Story Section */}
        <section className="bg-white dark:bg-[#0d1424] rounded-3xl p-8 sm:p-12 border-2 border-slate-300 dark:border-slate-800 shadow-md ring-1 ring-slate-900/5 space-y-6 transition-colors">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Neden Buradayız?</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            WhatsApp gruplarında telefon numaralarının yabancılara açılması, geyik mesajları arasında kaybolan önemli duyurular ve komşuların birbirini tanıyamaması apartman yaşamını soğuklaştırmaktadır.
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Site Yönetimi olarak vizyonumuz; %100 KVKK uyumlu numarasız güvenli bir profil ile görsel hikayeler, yardımlaşma kanalları ve tek tıkla demokratik oylamaları buluşturan sıcak, modern bir komşuluk köprüsü kurmaktır.
          </p>
        </section>

        {/* Core Pillars */}
        <section className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#0d1424] p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-sky-400 flex items-center justify-center mb-4 border border-blue-200 dark:border-blue-800">
              <Camera className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Sosyal Komşuluk</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Görsel fotoğraf akışı ve hikayeler ile bahçe çayları, ödünç eşya ve bina içi yardımlaşma kolaylaşır.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0d1424] p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 border border-cyan-200/60 dark:border-cyan-500/30">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">KVKK Numara Kalkanı</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Telefon numaraları ve e-postalar tamamen gizlenir, sakinler sadece Daire No ve isimle güvenle iletişim kurar.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0d1424] p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 border border-teal-200/60 dark:border-teal-500/30">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Huzurlu Ortak Yaşam</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Fotoğraflı arıza takibi ve tek tıkla canlı bina oylamaları ile toplantı stresine girmeden kararlar alınır.
            </p>
          </div>
        </section>

        {/* Call to action */}
        <section className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-[#0d1424] dark:to-[#090e1b] border-2 border-blue-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-md ring-1 ring-slate-900/5">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Siz de Sitenizi Dijitalleştirin</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Lansmana özel 60 günlük ücretsiz deneme ile binanızın yönetimini modernleştirin.
          </p>
          <div className="pt-2">
            <Link
              href="/kayit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all text-sm shadow-sm"
            >
              <span>Hemen Başla</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
