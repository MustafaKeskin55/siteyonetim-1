import Link from "next/link";
import { Building2, Mail, Phone, MapPin, ShieldCheck, Heart } from "lucide-react";
import { SiteLogo } from "@/components/SiteLogo";

const footerLinks = {
  moduller: {
    title: "Platform & Özellikler",
    links: [
      { href: "/ozellikler", label: "Tüm Özellikler" },
      { href: "/ozellikler#aidat", label: "Aidat & Finans Takibi" },
      { href: "/ozellikler#duyuru", label: "Duyuru Yönetimi" },
      { href: "/ozellikler#ariza", label: "Arıza & Talep Sistemi" },
      { href: "/fiyatlandirma", label: "Fiyatlandırma Paketleri" },
    ],
  },
  kurumsal: {
    title: "Kurumsal & Destek",
    links: [
      { href: "/destek", label: "Yardım & Destek Merkezi" },
      { href: "/hakkimizda", label: "Hakkımızda & Vizyon" },
      { href: "/iletisim", label: "İletişim & Ofis" },
      { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
      { href: "/kullanim-sartlari", label: "Kullanım Şartları" },
    ],
  },
  hesap: {
    title: "Kullanıcı İşlemleri",
    links: [
      { href: "/kayit", label: "Hesap Aç / Kayıt Ol" },
      { href: "/login", label: "Yönetici & Sakin Girişi" },
      { href: "/sifremi-unuttum", label: "Şifre Sıfırlama" },
    ],
  },
};

export function Footer() {
  const y = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-300 dark:border-slate-800 bg-slate-100/90 dark:bg-[#04060c] text-slate-700 dark:text-slate-400 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Marka & Tanıtım */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center h-10 w-10 shrink-0 rounded-xl overflow-hidden ring-1 ring-slate-300 dark:ring-slate-700 bg-white dark:bg-slate-900 shadow-xs">
                <SiteLogo width={36} height={36} rounded className="rounded-md" alt="Site Yönetimi logosu" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  Site Yönetimi
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Kat Mülkiyeti Kanunu Uyumlu Platform
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-slate-600 dark:text-slate-400">
              Apartman, site ve toplu yapı yönetimlerini dijitalleştiren, komşuluk iletişimini keyifli hale getiren bulut tabanlı sosyal yönetim çözümü.
            </p>
            <div className="space-y-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-sky-400" />
                <a href="mailto:destek@siteyonetim.keskindev.com" className="hover:text-blue-600 dark:hover:text-sky-300 transition-colors">
                  destek@siteyonetim.keskindev.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-sky-400" />
                <span>0 (850) 123 45 67</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-sky-400" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>

          {/* Link kolonları */}
          {Object.values(footerLinks).map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-slate-900 dark:text-slate-200">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alt Bilgi & Güvenlik Rozetleri */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            <span>256-Bit SSL Şifreleme &amp; KVKK Uyumlu Güvenli Veri Saklama</span>
          </div>
          <p>© {y} Site Yönetimi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
