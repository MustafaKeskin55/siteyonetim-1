import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getPublicSiteUrl } from "@/lib/site-url";
import { PublicContactForm } from "@/components/PublicContactForm";

const iletisimCanonical = `${getPublicSiteUrl()}/iletisim`;

export const metadata: Metadata = {
  title: "İletişim | Site Yönetimi",
  description:
    "Site Yönetimi iletişim bilgileri, ofis adresi, müşteri temsilcisi telefon numarası ve mesaj gönderme formu.",
  alternates: { canonical: iletisimCanonical },
};

export default function Iletisim() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Header */}
      <section className="pt-16 pb-12 bg-slate-50 dark:bg-[#090e1b] border-b border-slate-300 dark:border-slate-800 text-center transition-colors">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-700 dark:text-sky-300 font-semibold bg-blue-50 dark:bg-blue-950/80 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
            KURUMSAL İLETİŞİM
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-4 mb-4">
            Bize Ulaşın
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Satış öncesi sorularınız, kurumsal teklif talepleri ve iş birliği görüşmeleri için bize dilediğiniz zaman ulaşabilirsiniz.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* İletişim Bilgileri */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Merkez Ofis &amp; İletişim</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Müşteri temsilcilerimiz mesai saatleri içinde ortalama 15 dakika içinde geri dönüş sağlamaktadır.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-start p-5 bg-white dark:bg-[#0d1424] rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm ring-1 ring-slate-900/5 transition-colors">
                <div className="bg-blue-50 dark:bg-blue-950/80 p-3 rounded-xl text-blue-600 dark:text-sky-400 shrink-0 border border-blue-200 dark:border-blue-800">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Ofis Adresi</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Büyükdere Caddesi, Levent Plaza No:142 Kat:8<br />
                    Şişli / İstanbul, Türkiye
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start p-5 bg-white dark:bg-[#0d1424] rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm ring-1 ring-slate-900/5 transition-colors">
                <div className="bg-cyan-50 dark:bg-cyan-950/80 p-3 rounded-xl text-cyan-600 dark:text-cyan-400 shrink-0 border border-cyan-200/60 dark:border-cyan-500/30">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Telefon &amp; Destek Hattı</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    0 (850) 123 45 67 &bull; 0 (212) 555 01 23
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-5 bg-white dark:bg-[#0d1424] rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm ring-1 ring-slate-900/5 transition-colors">
                <div className="bg-blue-50 dark:bg-blue-950/80 p-3 rounded-xl text-blue-600 dark:text-sky-400 shrink-0 border border-blue-200 dark:border-blue-800">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">E-Posta Adresi</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <a href="mailto:destek@siteyonetim.keskindev.com" className="text-blue-600 dark:text-sky-400 hover:underline">
                      destek@siteyonetim.keskindev.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-5 bg-white dark:bg-[#0d1424] rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm ring-1 ring-slate-900/5 transition-colors">
                <div className="bg-teal-50 dark:bg-teal-950/80 p-3 rounded-xl text-teal-600 dark:text-teal-400 shrink-0 border border-teal-200/60 dark:border-teal-500/30">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Çalışma Saatleri</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Pazartesi - Cuma: 09:00 - 18:00<br />
                    Cumartesi: 10:00 - 14:00 (Nöbetçi Canlı Destek)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <PublicContactForm defaultSource="iletisim" headline="Bize Mesaj Gönderin" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
