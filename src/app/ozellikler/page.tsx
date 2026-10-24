import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  MessagesSquare,
  Vote,
  ShieldCheck,
  Megaphone,
  Wrench,
  CheckCircle2,
  ArrowRight,
  EyeOff,
  Camera,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { getPublicSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Özellikler | Güvenli Komşuluk Ağı & Apartman Sosyal Portalı",
  description:
    "WhatsApp karmaşasına son veren görsel komşuluk akışı, bina içi canlı anketler, fotoğraflı hikayeler ve arıza takip modülleri.",
  alternates: { canonical: `${getPublicSiteUrl()}/ozellikler` },
};

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-16 pb-14 bg-slate-50 dark:bg-[#090e1b] border-b border-slate-300 dark:border-slate-800 text-center transition-colors">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-700 dark:text-sky-300 font-semibold bg-blue-50 dark:bg-blue-950/80 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
            MODÜLLER &amp; SOSYAL ÖZELLİKLER
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-4 mb-4">
            WhatsApp Kaosuna Son: Yaşayan Komşuluk Ağı
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Telefon numarası ifşası olmadan görsel komşuluk akışı, bina içi canlı anketler ve hızlı arıza yönetimi.
          </p>
        </div>
      </section>

      {/* Main Content Modules */}
      <main className="max-w-6xl mx-auto px-6 py-16 space-y-20">

        {/* Modül 1: Komşuluk Ağı & Grup Sohbeti */}
        <section id="topluluk" className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-sky-400 text-xs font-bold mb-4 border border-blue-200 dark:border-blue-800">
              <MessagesSquare className="h-4 w-4" />
              GÜVENLİ KOMŞULUK AĞI &amp; GRUPLAR
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Telefon numaranız gizli, komşuluk iletişimi canlı
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              WhatsApp gruplarında kişisel telefon numaraları onlarca yabancıya açılırken; sistemimizde herkes yalnızca daire numarası ve ismiyle görünür.
              Konusuna göre ayrılmış güvenli kanallar ile düzen sağlanır.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>%100 KVKK Korumalı:</strong> Komşular birbirinin telefon numarasını ve e-postasını göremez.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Tematik Kanallar:</strong> Yardımlaşma, Ödünç Eşya, Evcil Hayvanlar, Bahçe Buluşmaları.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Yönetici Moderasyonu:</strong> Uygunsuz mesajları anında kaldırma ve resmi duyuruları kilitleme imkanı.</span>
              </li>
            </ul>
          </div>
          <div className="bg-white dark:bg-[#0d1424] rounded-3xl p-6 shadow-md border-2 border-slate-300 dark:border-slate-800 ring-1 ring-slate-900/5 transition-colors">
            <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-300 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-white">#Yardımlaşma &amp; Ödünç</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded font-bold border border-emerald-200 dark:border-emerald-500/30">Numaralar Gizli</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white">Daire 4 - Selin K.:</span> &ldquo;Merdiven lazım oldu, 1 saatliğine ödünç alabilir miyim?&rdquo;
                </div>
                <div className="p-2.5 bg-blue-600 text-white rounded-xl font-medium">
                  <span className="font-bold">Daire 9 - Ahmet Y.:</span> &ldquo;Tabii Selin Hanım, kapıdayım verebilirim.&rdquo;
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modül 2: Fotoğraflı Komşuluk Akışı & Hikayeler */}
        <section id="sosyal-akis" className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 bg-white dark:bg-[#0d1424] rounded-3xl p-6 shadow-md border-2 border-slate-300 dark:border-slate-800 ring-1 ring-slate-900/5 transition-colors">
            <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 p-[1.5px]">
                  <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-sky-300">
                    D.6
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Zeynep Hanım (D.6)</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Bahçe Katı</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200">
                Kamelyada çay demledik, müsait olan komşularımızı bekleriz! ☕️🍪
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs border-t border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 text-blue-600 dark:text-sky-400 font-bold">
                  <Heart className="h-3.5 w-3.5 fill-blue-600 dark:fill-sky-400" /> 24 Beğeni
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" /> 7 Yorum
                </span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 text-xs font-bold mb-4 border border-cyan-200 dark:border-cyan-500/30">
              <Camera className="h-4 w-4" />
              CANLI KOMŞULUK AKIŞI &amp; HİKAYELER
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Apartmanınızda gerçek bir sosyal topluluk deneyimi
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Sakinlerin temiz çocuk eşyalarını devrettiği, bahçe çay saatleri düzenlediği ve komşuluk bağlarını güçlendirdiği canlı bir sosyal medya duvarı.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>Fotoğraflı ve hikayeli gönderi paylaşımı</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>Canlı beğeni, yorum ve DM etkileşimi</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Modül 3: Anket & Oylama */}
        <section id="anket" className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 text-xs font-bold mb-4 border border-teal-200 dark:border-teal-500/30">
              <Vote className="h-4 w-4" />
              DEMOKRATİK KARAR ALMA
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Toplantı beklemeden bina kararlarını anında oylayın
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Bina sakinlerinin görüşünü almak için haftalarca toplantı organize etmeye gerek yok.
              Yönetici veya komşular tek tıkla anket başlatır, sakinler oylarını telefonlarından verir.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>Anlık yüzdeler ve katılım oranları</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>Her daire için 1 adil oy hakkı</span>
              </li>
            </ul>
          </div>
          <div className="bg-white dark:bg-[#0d1424] rounded-3xl p-6 shadow-md border-2 border-slate-300 dark:border-slate-800 ring-1 ring-slate-900/5 transition-colors">
            <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-300 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                  <Vote className="h-4 w-4" /> Bina İçi Canlı Oylama
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">18 Oy</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Bahçe aydınlatması saat kaça kadar açık kalsın?</p>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg font-bold flex justify-between text-slate-900 dark:text-white">
                  <span>Gece 01:00&apos;e kadar</span>
                  <span>%75 (14 oy)</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Sabaha kadar açık kalsın</span>
                  <span>%25 (4 oy)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modül 4: Fotoğraflı Arıza & İstek Takibi */}
        <section id="talep" className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 bg-white dark:bg-[#0d1424] rounded-3xl p-6 shadow-md border-2 border-slate-300 dark:border-slate-800 ring-1 ring-slate-900/5 transition-colors">
            <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-300 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-white">Arıza Takip Kartı</span>
                <span className="text-[10px] bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-400 px-2 py-0.5 rounded font-bold border border-cyan-200 dark:border-cyan-500/30">İşlemde</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">3. Kat Aydınlatma Sensörü Çalışmıyor</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Daire 7 • Elektrikçiye iş emri verildi.</p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 text-xs font-bold mb-4 border border-amber-200 dark:border-amber-500/30">
              <Wrench className="h-4 w-4" />
              ARIZA &amp; İSTEK YÖNETİMİ
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Sakinlerden gelen talepleri fotoğraflarla yönetin
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Asansör arızası, çatı akması veya bahçe bakımı gibi sorunları telefonla anlatmak yerine fotoğraflı talep olarak sisteme işleyin.
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>Fotoğraflı bildirim ve durum güncellemeleri</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <span>Çözüldü gerekçeleri ve fotoğrafları</span>
              </li>
            </ul>
          </div>
        </section>

      </main>

      {/* CTA Section */}
      <section className="py-16 bg-slate-50 dark:bg-[#090e1b] border-t border-slate-300 dark:border-slate-800 text-center transition-colors">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Sitenizde güvenli komşuluk ve sosyal düzeni hemen başlatın
          </h2>
          <div className="pt-2">
            <Link
              href="/kayit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all hover:scale-105"
            >
              <span>Ücretsiz Denemeyi Başlat</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
