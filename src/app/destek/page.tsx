import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  LifeBuoy,
  Mail,
  HelpCircle,
  Camera,
  UserCheck,
  Wrench,
  BookOpen,
  Phone,
  MessageSquare,
} from "lucide-react";
import { getPublicSiteUrl } from "@/lib/site-url";
import { PublicContactForm } from "@/components/PublicContactForm";

const u = `${getPublicSiteUrl()}/destek`;

export const metadata: Metadata = {
  title: "Destek ve Yardım Merkezi | Site Yönetimi",
  description:
    "Apartman ve site yönetimi sistemi ile ilgili sıkça sorulan sorular, kullanım rehberleri ve doğrudan teknik destek formu.",
  alternates: { canonical: u },
};

const guideTopics = [
  {
    icon: UserCheck,
    title: "Kayıt ve Yönetici Onayı",
    desc: "Hesap açma formunu doldurduktan sonra yöneticiniz onayladığında SMS/e-posta ile anında bilgilendirilirsiniz.",
  },
  {
    icon: Camera,
    title: "Sosyal Akış & Hikayeler",
    desc: "Komşuluk akışında fotoğraf paylaşma, ödünç eşya isteme ve etkinlik oluşturma rehberi.",
  },
  {
    icon: Wrench,
    title: "Fotoğraflı Arıza İletme",
    desc: "Bina içerisindeki ortak alan arızalarını fotoğraf ekleyerek yöneticiye doğrudan iletebilirsiniz.",
  },
  {
    icon: BookOpen,
    title: "Yönetici Rehberi",
    desc: "Daire tanımlama, sakin onaylama, duyuru sabitleme ve canlı anket başlatma adımları.",
  },
];

export default function DestekPublicPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Header */}
      <section className="pt-16 pb-12 bg-slate-50 dark:bg-[#090e1b] border-b border-slate-300 dark:border-slate-800 text-center transition-colors">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-xs font-mono uppercase tracking-widest text-blue-700 dark:text-sky-300 font-semibold bg-blue-50 dark:bg-blue-950/80 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
            YARDIM VE DESTEK MERKEZİ
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-4 mb-4">
            Size nasıl yardımcı olabiliriz?
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Sistem kullanımı, hesap onayı ve teknik konular hakkında merak ettikleriniz için rehberlerimizi inceleyin veya bize yazın.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 w-full space-y-16">
        
        {/* Quick Knowledge Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guideTopics.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <div
                key={i}
                className="bg-white dark:bg-[#0d1424] p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm hover:shadow-md ring-1 ring-slate-900/5 transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-sky-400 flex items-center justify-center mb-4 border border-blue-200 dark:border-blue-800">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">{topic.title}</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{topic.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Support Form & Direct Contact */}
        <div className="grid lg:grid-cols-5 gap-12 items-start pt-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 text-xs font-bold mb-3 border border-cyan-200 dark:border-cyan-500/30">
                <LifeBuoy className="h-4 w-4" />
                Doğrudan Destek Ekibi
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                Sorunuzu Bize İletin
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                Aşağıdaki formu doldurduğunuzda destek talebiniz doğrudan teknik ekibimize iletilir ve en kısa sürede e-posta ile yanıtlanır.
              </p>
            </div>

            <div className="rounded-3xl border-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0d1424] p-6 space-y-4 shadow-sm ring-1 ring-slate-900/5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">E-Posta ile İletişim</h3>
                  <a
                    href="mailto:destek@siteyonetim.keskindev.com"
                    className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline"
                  >
                    destek@siteyonetim.keskindev.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-200/60 dark:border-cyan-500/30">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Telefon Destek Hattı</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">0 (850) 123 45 67 (Hafta içi 09:00 - 18:00)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <PublicContactForm defaultSource="destek" headline="Destek Bileti Oluşturun" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
