"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { SiteLogo } from "@/components/SiteLogo";
import { NotificationBell } from "@/components/NotificationBell";
import { SITE_BRAND_NAME } from "@/lib/brand";
import {
  Home,
  Megaphone,
  Wrench,
  LogOut,
  MessagesSquare,
  User,
  Bell,
  Vote,
  ChevronLeft,
} from "lucide-react";
import { SiteFrozenBarrier } from "@/components/SiteFrozenBarrier";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [asideName, setAsideName] = React.useState("Sakin");
  const [asideMeta, setAsideMeta] = React.useState("");
  const [sitePlan, setSitePlan] = React.useState<{
    isFrozen?: boolean;
    planName?: string;
    daysRemaining?: number;
  } | null>(null);

  React.useEffect(() => {
    fetch("/api/site/plan")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) setSitePlan(d);
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw) as { name?: string; apartmentNo?: string | null };
        if (typeof u.name === "string" && u.name.trim()) setAsideName(u.name.trim());
        const apt = typeof u.apartmentNo === "string" ? u.apartmentNo.trim() : "";
        setAsideMeta(apt ? `Daire ${apt}` : "Kayıtlı sakin");
      } else {
        const demoUser = {
          id: "demo-sakin-1",
          name: "Ahmet Yılmaz",
          role: "USER",
          apartmentNo: "14",
          siteName: "Zümrüt Sitesi",
        };
        localStorage.setItem("user", JSON.stringify(demoUser));
        setAsideName("Ahmet Yılmaz");
        setAsideMeta("Daire 14");
      }
    } catch {
      setAsideName("Ahmet Yılmaz");
      setAsideMeta("Daire 14");
    }
  }, []);

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { name: "Komşuluk Akışı", shortName: "Akış", href: "/dashboard", icon: Home },
    { name: "Resmi Duyurular", shortName: "Duyuru", href: "/dashboard/announcements", icon: Megaphone },
    { name: "Komşu Sohbeti", shortName: "Topluluk", href: "/dashboard/topluluk", icon: MessagesSquare },
    { name: "Kararlar & Anketler", shortName: "Oylama", href: "/dashboard/anketler", icon: Vote },
    { name: "Arıza & Taleplerim", shortName: "Talep", href: "/dashboard/requests", icon: Wrench },
    { name: "Bildirimler", shortName: "Bildirim", href: "/dashboard/bildirimler", icon: Bell },
    { name: "Hesabım", shortName: "Hesabım", href: "/dashboard/hesabim", icon: User },
  ];

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 overflow-hidden transition-colors">

      {/* ══════ DESKTOP SIDEBAR (MATCHING ADMIN PANEL 1:1) ══════ */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 h-full transition-all duration-300 ease-in-out relative ${
          collapsed ? "w-[72px]" : "w-[260px]"
        } bg-white dark:bg-[#090e1b] border-r border-slate-200/80 dark:border-slate-800`}
      >
        {/* Logo Header */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-slate-100 dark:border-slate-800 shrink-0 ${collapsed ? "justify-center" : ""}`}>
          <SiteLogo width={36} height={36} rounded className="shrink-0 rounded-lg" alt="" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{SITE_BRAND_NAME}</p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">Sakin Portalı</p>
            </div>
          )}
        </div>

        {/* User Card */}
        {collapsed ? (
          <div className="py-2.5 border-b border-slate-100 dark:border-slate-800/80 flex justify-center shrink-0" title={`${asideName} (${asideMeta})`}>
            <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/40 text-xs font-bold shrink-0">
              {asideName.charAt(0).toUpperCase()}
            </div>
          </div>
        ) : (
          <div className="px-3.5 py-2.5 mx-3 my-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center border border-blue-200 dark:border-blue-900/40 text-xs font-bold shrink-0">
              {asideName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{asideName}</p>
              <p className="text-[11px] font-semibold text-blue-600 dark:text-sky-400 truncate">{asideMeta}</p>
            </div>
          </div>
        )}

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  collapsed ? "justify-center" : ""
                } ${
                  active
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white font-medium"
                }`}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-sky-400"}`} />
                {!collapsed && <span className="text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-slate-100 dark:border-slate-800 p-3 space-y-1 shrink-0">
          <button
            type="button"
            onClick={async () => {
              try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } catch {}
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              window.dispatchEvent(new Event("auth-state-change"));
              router.push("/");
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors w-full cursor-pointer ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Çıkış Yap" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span className="text-sm font-semibold">Çıkış Yap</span>}
          </button>
        </div>

        {/* Collapse toggle button on right edge */}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-20 z-10 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-xs hover:scale-110 transition-all cursor-pointer"
          aria-label={collapsed ? "Genişlet" : "Daralt"}
        >
          <ChevronLeft className={`h-3.5 w-3.5 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </aside>

      {/* ══════ MAIN CONTENT & DESKTOP HEADER AREA ══════ */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-white dark:bg-[#090e1b] border-b border-slate-200/80 dark:border-slate-800 shrink-0 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">Sakin Portalı</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              {asideName} &bull; {asideMeta}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationBell role="USER" align="right" />
            <Link
              href="/"
              className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 px-3 py-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 transition"
            >
              Ana Sayfaya Dön &rarr;
            </Link>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090e1b] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <SiteLogo width={28} height={28} rounded className="rounded-lg" alt="" />
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">Sakin Paneli</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <NotificationBell role="USER" align="right" />
            <button
              type="button"
              onClick={async () => {
                try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } catch {}
                localStorage.removeItem("user");
                router.push("/");
              }}
              className="p-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              title="Çıkış Yap"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain pb-20 lg:pb-0 bg-slate-100 dark:bg-[#070b14]">
          {children}
        </main>
      </div>

      {/* ══════ MOBILE BOTTOM NAV ══════ */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-[#090e1b] border-t border-slate-200/80 dark:border-slate-800 z-50" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex items-center justify-around h-16">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                  active
                    ? "text-blue-600 dark:text-sky-400"
                    : "text-slate-400 dark:text-slate-500 active:text-slate-600"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${active ? "bg-blue-50 dark:bg-blue-950/50" : ""}`}>
                  <item.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{item.shortName}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 60 Günlük Deneme Süresi Dolduğunda Tüm İşlemleri Donduran Bariyer */}
      {sitePlan?.isFrozen && (
        <SiteFrozenBarrier role="USER" planName={sitePlan.planName} />
      )}
    </div>
  );
}
