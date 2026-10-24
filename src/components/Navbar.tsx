"use client";

import Link from "next/link";
import { SiteLogo } from "@/components/SiteLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { Menu, X, ChevronRight, UserPlus, LogIn } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/ozellikler", label: "Özellikler" },
  { href: "/fiyatlandirma", label: "Fiyatlandırma" },
  { href: "/destek", label: "Destek" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-300 dark:border-slate-800 bg-white/95 dark:bg-[#070b14]/90 backdrop-blur-md text-slate-900 dark:text-slate-100 transition-colors shadow-xs shadow-slate-900/5">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex items-center justify-center h-10 w-10 shrink-0 rounded-xl shadow-xs overflow-hidden ring-1 ring-slate-300 dark:ring-slate-700 bg-white dark:bg-slate-900 group-hover:scale-105 transition-transform">
            <SiteLogo width={36} height={36} rounded className="rounded-md" alt="Site Yönetimi logosu" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight leading-none text-slate-900 dark:text-white">
              Site Yönetimi
            </span>
            <span className="text-[11px] font-medium leading-tight mt-0.5 text-slate-500 dark:text-slate-400">
              Dijital Apartman &amp; Tesis
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-sky-950/60 font-bold border border-blue-200 dark:border-sky-500/20"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Sağ grup (ThemeToggle + Giriş Yap & Hesap Aç) */}
        <div className="hidden sm:flex items-center gap-2.5">
          <ThemeToggle />

          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-300 dark:border-slate-800 rounded-xl transition-all"
          >
            <LogIn className="h-4 w-4 text-blue-600 dark:text-sky-400" />
            <span>Giriş Yap</span>
          </Link>

          <Link
            href="/kayit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm hover:shadow-md transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>Hesap Aç</span>
          </Link>
        </div>

        {/* Mobil Menü Butonu */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-sky-950/80 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-sky-500/30"
          >
            Giriş
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobil menü drawer */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-slate-300 dark:border-slate-800 bg-white dark:bg-[#070b14] px-6 py-4 space-y-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-sky-950/80 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4 opacity-40" />
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <Link
              href="/kayit"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
            >
              <UserPlus className="h-4 w-4" />
              Hesap Aç (Kayıt Ol)
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <LogIn className="h-4 w-4 text-blue-600 dark:text-sky-400" />
              Giriş Yap
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
