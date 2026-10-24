"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Check, ShieldCheck, Zap } from "lucide-react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: "Başlangıç",
      desc: "1 - 20 dairelik butik apartmanlar ve küçük binalar için",
      originalMonthlyPrice: 189,
      originalAnnualPrice: 149,
      monthlyPrice: 59,
      annualPrice: 45,
      popular: false,
      features: [
        "20 Daireye Kadar Sakin Yönetimi",
        "KVKK Numarasız Komşu Ağı",
        "Görsel Komşu Akışı & Hikayeler",
        "Canlı Komşuluk Anketleri",
        "Dijital Duyuru Panosu",
        "Fotoğraflı Arıza & İstek Takibi",
        "1 Yönetici Hesabı",
        "Standart Destek",
      ],
      cta: "60 Gün Ücretsiz Başla",
      href: "/kayit?plan=starter",
    },
    {
      name: "Profesyonel",
      desc: "21 - 80 dairelik orta ve büyük ölçekli siteler için ideal",
      originalMonthlyPrice: 349,
      originalAnnualPrice: 279,
      monthlyPrice: 109,
      annualPrice: 85,
      popular: true,
      features: [
        "80 Daireye Kadar Sakin Yönetimi",
        "Tüm Başlangıç Özellikleri",
        "Özel Komşuluk Kanalları (İmece, İkinci El)",
        "Yönetici Onaylı Sakin Kayıt Mekanizması",
        "Fotoğraflı Tamir & Çözüm Akışı",
        "3 Yönetici & Denetçi Hesabı",
        "Öncelikli Telefon ve Canlı Destek",
        "Excel Veri İçe/Dışa Aktarma",
      ],
      cta: "60 Gün Ücretsiz Başla",
      href: "/kayit?plan=professional",
    },
    {
      name: "Kurumsal & Tesis",
      desc: "80+ daire, çok bloklu siteler ve profesyonel yönetim firmaları",
      originalMonthlyPrice: 699,
      originalAnnualPrice: 559,
      monthlyPrice: 209,
      annualPrice: 169,
      popular: false,
      features: [
        "Sınırsız Daire ve Blok Tanımlama",
        "Tüm Profesyonel Özellikleri",
        "Çoklu Site Yönetimi Tek Panelden",
        "Özel Alan Adı (Domain) Entegrasyonu",
        "Sınırsız Yönetici ve Görevli Yetkisi",
        "PWA Mobil Uygulama Desteği",
        "7/24 Özel Müşteri Temsilcisi",
        "Özel Veri Yedekleme ve SLA Garantisi",
      ],
      cta: "60 Gün Ücretsiz Başla",
      href: "/kayit?plan=enterprise",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Promosyon Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900 text-white text-center py-2.5 px-4 text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider animate-pulse">
          %70 FIRSATI
        </span>
        <span>Lansmana Özel Tüm Paketlerde <strong>%70 İndirim</strong> Tanımlandı! 60 Gün Koşulsuz Ücretsiz Deneyin.</span>
      </div>

      {/* Header */}
      <section className="pt-14 pb-12 bg-slate-50 dark:bg-[#090e1b] border-b border-slate-300 dark:border-slate-800 text-center transition-colors">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-700 dark:text-sky-300 font-bold bg-blue-50 dark:bg-blue-950/60 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 mb-4">
            <span>🔥 LANSMAN KAMPANYASI • %70 İNDİRİM</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-2 mb-4">
            Şeffaf Fiyatlar, <span className="text-blue-600 dark:text-sky-400 underline decoration-blue-500/40 underline-offset-8">%70 Lansman İndirimiyle</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Gizli masraf yok, taahhüt yok. Lansmana özel 60 gün boyunca tüm sosyal komşuluk ve yönetim özelliklerini tamamen ücretsiz deneyin.
          </p>

          {/* Aylık / Yıllık Geçiş */}
          <div className="inline-flex items-center gap-3 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xs">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`py-2 px-5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                !isAnnual
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Aylık Ödeme
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`py-2 px-5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isAnnual
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Yıllık Ödeme</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 text-[11px] font-extrabold border border-emerald-200 dark:border-emerald-500/30">
                Ekstra Avantaj
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const originalPrice = isAnnual ? plan.originalAnnualPrice : plan.originalMonthlyPrice;
            const savings = originalPrice - price;

            return (
              <div
                key={i}
                className={`relative flex flex-col rounded-3xl p-8 transition-all bg-white dark:bg-[#0d1424] border-2 ${
                  plan.popular
                    ? "border-blue-600 dark:border-sky-400 shadow-xl ring-4 ring-blue-500/10 dark:ring-sky-400/20"
                    : "border-slate-300 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-slate-400 dark:hover:border-slate-700 ring-1 ring-slate-900/5"
                }`}
              >
                {/* 70% İndirim Etiketi */}
                <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <span>%70 İNDİRİM</span>
                </div>

                {plan.popular && (
                  <div className="absolute -top-3.5 left-6 px-3.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                    EN ÇOK TERCİH EDİLEN
                  </div>
                )}

                <div className="mb-6 pt-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 min-h-[36px]">{plan.desc}</p>
                </div>

                <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  {/* Eski Fiyat & İndirim Rozeti */}
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-base sm:text-lg font-bold text-slate-400 dark:text-slate-500 line-through">
                      ₺{originalPrice}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 text-xs font-black border border-red-200 dark:border-red-800">
                      %70 İNDİRİMLİ
                    </span>
                  </div>

                  {/* Güncel İndirimli Fiyat */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                      ₺{price}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">/ ay</span>
                  </div>

                  {/* Tasarruf Bilgisi */}
                  <div className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>✓ Her ay ₺{savings} tasarruf edersiniz</span>
                  </div>
                  {isAnnual && (
                    <span className="block mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Yıllık periyotta faturalandırılır
                    </span>
                  )}
                </div>

                <div className="space-y-3.5 mb-8 flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Dahil Olan Özellikler:</span>
                  {plan.features.map((feat, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.href}
                  className={`w-full py-3.5 px-4 rounded-xl text-center text-sm font-bold transition-all shadow-xs ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-20 bg-white dark:bg-[#0d1424] rounded-3xl p-6 sm:p-10 border-2 border-slate-300 dark:border-slate-800 shadow-md ring-1 ring-slate-900/5 transition-colors">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 text-center">
            Detaylı Paket Karşılaştırması
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white">
                  <th className="py-3 px-4 font-bold">Özellik</th>
                  <th className="py-3 px-4 font-bold text-center">Başlangıç</th>
                  <th className="py-3 px-4 font-bold text-center">Profesyonel</th>
                  <th className="py-3 px-4 font-bold text-center">Kurumsal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-medium">Maksimum Daire Limiti</td>
                  <td className="py-3 px-4 text-center">20 Daire</td>
                  <td className="py-3 px-4 text-center font-bold text-blue-600 dark:text-sky-400">80 Daire</td>
                  <td className="py-3 px-4 text-center font-bold text-cyan-600 dark:text-cyan-400">Sınırsız</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">KVKK Numarasız Komşuluk Ağı</td>
                  <td className="py-3 px-4 text-center">✓</td>
                  <td className="py-3 px-4 text-center">✓</td>
                  <td className="py-3 px-4 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Görsel Komşu Akışı &amp; Hikayeler</td>
                  <td className="py-3 px-4 text-center">✓</td>
                  <td className="py-3 px-4 text-center">✓</td>
                  <td className="py-3 px-4 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Canlı Komşuluk Anketleri</td>
                  <td className="py-3 px-4 text-center">✓</td>
                  <td className="py-3 px-4 text-center">✓</td>
                  <td className="py-3 px-4 text-center">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Özel Alan Adı (Domain) Kurulumu</td>
                  <td className="py-3 px-4 text-center text-slate-300 dark:text-slate-600">—</td>
                  <td className="py-3 px-4 text-center text-slate-300 dark:text-slate-600">—</td>
                  <td className="py-3 px-4 text-center font-bold text-cyan-600 dark:text-cyan-400">Dahil</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Teknik Destek Seviyesi</td>
                  <td className="py-3 px-4 text-center">E-posta</td>
                  <td className="py-3 px-4 text-center">Öncelikli Telefon</td>
                  <td className="py-3 px-4 text-center">7/24 Özel Temsilci</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
