"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Sparkles,
  Camera,
  Vote,
  ShieldCheck,
  Megaphone,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Users,
  EyeOff,
  UserPlus,
  LogIn,
  HeartHandshake,
  ChevronDown,
  Layers,
  Smile,
  PlusCircle,
  Clock,
  Pin,
} from "lucide-react";

// Fast dynamic import with zero SSR delay
const ThreeHeroCanvas = dynamic(
  () => import("@/components/ThreeHeroCanvas").then((mod) => mod.ThreeHeroCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[380px] sm:h-[460px] lg:h-[500px] flex items-center justify-center bg-slate-100 dark:bg-[#0d1424]/40 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse">
        <span className="text-xs font-mono text-blue-600 dark:text-sky-400">3D Akıllı Yerleşke Yükleniyor...</span>
      </div>
    ),
  }
);

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState<"akis" | "sohbet" | "anket" | "ariza">("akis");
  const [likedPosts, setLikedPosts] = React.useState<Record<number, boolean>>({ 1: true });
  const [likeCounts, setLikeCounts] = React.useState<Record<number, number>>({ 1: 19, 2: 32 });
  const [demoVote, setDemoVote] = React.useState<number | null>(0);
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const heroRef = React.useRef<HTMLDivElement>(null);
  const statsRef = React.useRef<HTMLDivElement>(null);
  const bentoRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-stagger",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
        }
      );

      if (statsRef.current) {
        gsap.fromTo(
          ".stat-item",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      if (bentoRef.current) {
        gsap.fromTo(
          ".bento-card",
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bentoRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  const handleLike = (id: number) => {
    setLikedPosts((prev) => {
      const isLiked = !prev[id];
      setLikeCounts((c) => ({
        ...c,
        [id]: (c[id] || 0) + (isLiked ? 1 : -1),
      }));
      return { ...prev, [id]: isLiked };
    });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-950 dark:selection:text-blue-200 transition-colors">
      <Navbar />

      {/* ══════════════════════════════════════════════════════════
          HERO SECTION: DUAL THEME (LIGHT & DARK ARCHITECTURAL)
      ══════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative pt-6 pb-14 lg:pt-12 lg:pb-20 overflow-hidden border-b border-slate-300 dark:border-slate-800/80 bg-radial from-blue-50/60 via-slate-100 to-white dark:from-[#0c1836] dark:via-[#070b14] dark:to-[#04060c] transition-colors"
      >
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 text-left">
              {/* Badge */}
              <div className="hero-stagger flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900/90 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-sky-300 text-xs font-semibold shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>Apartman &amp; Site Dijital Yönetimi</span>
                </div>
                <Link
                  href="/fiyatlandirma"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-transform hover:scale-105"
                >
                  <span>🔥 TÜM PAKETLERDE %70 İNDİRİM</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Main Headline */}
              <h1 className="hero-stagger text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                WhatsApp Kaosuna Son.{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 dark:from-blue-400 dark:via-indigo-300 dark:to-sky-400 bg-clip-text text-transparent">
                  Görsel &amp; Canlı
                </span>{" "}
                Komşuluk Ağı.
              </h1>

              {/* Subtitle */}
              <p className="hero-stagger text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal">
                Numaranızı yabancılara vermeden komşularınızla hikayeler paylaşın, fotoğraf ve duyuru akışında buluşun.
                Ödünç eşya isteyin, komşuluk anketlerine katılın ve güvenli DM ile mesajlaşın.
              </p>

              {/* Action Buttons */}
              <div className="hero-stagger flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <Link
                  href="/kayit"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md hover:shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sitenizi Ücretsiz Başlatın</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-xs"
                >
                  <LogIn className="h-4 w-4 text-blue-600 dark:text-sky-400" />
                  <span>Giriş Yap</span>
                </Link>
              </div>

              {/* Social Pillars */}
              <div className="hero-stagger pt-4 border-t border-slate-300 dark:border-slate-800/80 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <EyeOff className="h-4 w-4 text-blue-600 dark:text-sky-400 shrink-0" />
                    <span>Gizli Numara</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Sadece Daire No &amp; İsim</p>
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Camera className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    <span>Fotoğraf &amp; Hikaye</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Canlı komşu akışı</p>
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Vote className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>Canlı Anketler</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Tek tıkla bina kararları</p>
                </div>
              </div>
            </div>

            {/* Right: Three.js 3D Interactive Scene */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-700/70 bg-white/80 dark:bg-[#090e1a]/80 backdrop-blur-xl shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-cyan-950/40">
                <ThreeHeroCanvas />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          LIVE INTERACTIVE DEMO: SOCIAL FEED
      ══════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white dark:bg-[#090e1b] relative border-b border-slate-200/90 dark:border-slate-800/80 transition-colors">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-sky-400 font-semibold">
              İnteraktif Komşuluk Akışı
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              Apartmanınızın Özel Sosyal Ağı
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Aşağıdaki butonlarla modüller arasında geçiş yapabilir, gönderileri beğenebilir ve komşuluk demosunu canlı test edebilirsiniz.
            </p>
          </div>

          <div className="bg-slate-100/90 dark:bg-[#0e1628] rounded-3xl p-4 sm:p-6 border-2 border-slate-300 dark:border-slate-700/80 shadow-xl shadow-slate-300/50 dark:shadow-2xl transition-colors ring-1 ring-slate-900/5">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-slate-400 inline-block" />
                <span className="h-3 w-3 rounded-full bg-slate-400 inline-block" />
                <span className="h-3 w-3 rounded-full bg-slate-400 inline-block" />
                <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 ml-2">
                  Zümrüt Sitesi • Sosyal Komşuluk Portalı
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>KVKK Numara Kalkanı Aktif</span>
              </div>
            </div>

            {/* Stories Bar */}
            <div className="py-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-4 overflow-x-auto scrollbar-none">
              {[
                { name: "Siz (D.14)", label: "Hikaye Ekle", active: false, isUser: true },
                { name: "Yönetim", label: "Duyuru 📌", active: true, color: "from-blue-600 to-indigo-600" },
                { name: "Daire 6", label: "Çay Saati ☕️", active: true, color: "from-cyan-500 to-blue-600" },
                { name: "Daire 9", label: "Kedi Bulundu 🐱", active: true, color: "from-amber-500 to-orange-500" },
                { name: "Daire 12", label: "Matkap Lazım 🔧", active: true, color: "from-emerald-500 to-teal-600" },
                { name: "Daire 18", label: "Temiz Masa 🎁", active: true, color: "from-blue-500 to-sky-400" },
              ].map((st, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                  <div
                    className={`h-14 w-14 rounded-full p-[2px] transition-transform group-hover:scale-105 ${
                      st.isUser
                        ? "border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-white dark:bg-slate-800"
                        : `bg-gradient-to-tr ${st.color}`
                    }`}
                  >
                    <div className="h-full w-full rounded-full bg-white dark:bg-[#0d1424] flex items-center justify-center font-bold text-xs text-slate-800 dark:text-white">
                      {st.isUser ? <PlusCircle className="h-5 w-5 text-blue-600 dark:text-sky-400" /> : st.name.split(" ")[0]}
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-sky-300 text-center max-w-[65px] truncate">
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tab Selectors */}
            <div className="grid grid-cols-4 gap-2 my-4">
              {[
                { id: "akis", label: "Sosyal Akış", icon: Camera },
                { id: "sohbet", label: "Grup & DM", icon: MessageCircle },
                { id: "anket", label: "Anketler", icon: Vote },
                { id: "ariza", label: "Arıza & İstek", icon: Wrench },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex items-center justify-center gap-2 px-2.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white font-extrabold shadow-md shadow-blue-600/20"
                        : "bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT */}
            <div className="bg-white dark:bg-[#090d18] rounded-2xl p-4 sm:p-5 border-2 border-slate-300 dark:border-slate-800 min-h-[340px] shadow-sm transition-colors">
              {/* TAB 1: SOCIAL POST FEED */}
              {activeTab === "akis" && (
                <div className="space-y-4 max-w-xl mx-auto">
                  {/* Post 1 */}
                  <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border-2 border-slate-300 dark:border-slate-800 overflow-hidden shadow-xs">
                    <div className="p-3.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 p-[1.5px]">
                          <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-sky-300">
                            D.6
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Zeynep &amp; Ali Bey</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">• 42 dk önce</span>
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Daire 6 • Bahçe Katı</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30">
                        🔒 Numara Gizli
                      </span>
                    </div>

                    <div className="p-4 space-y-3">
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                        Merhabalar komşular! ☕️ Bahçedeki kamelyada komşularla akşam çayı ve kurabiye etkinliği yapıyoruz.
                        Müsait olan tüm komşularımızı ve çocukları bekleriz!
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-blue-700 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full font-mono border border-blue-200 dark:border-blue-800/50">
                          #KomşulukÇayı
                        </span>
                        <span className="text-[10px] text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full font-mono border border-sky-200 dark:border-sky-800/50">
                          #BahçeBuluşması
                        </span>
                      </div>
                    </div>

                    <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleLike(1)}
                          className={`flex items-center gap-1.5 font-bold transition-transform active:scale-125 cursor-pointer ${
                            likedPosts[1] ? "text-blue-600 dark:text-sky-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${likedPosts[1] ? "fill-blue-600 dark:fill-sky-400 text-blue-600 dark:text-sky-400" : ""}`} />
                          <span>{likeCounts[1]} Beğeni</span>
                        </button>
                        <button type="button" className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                          <MessageCircle className="h-4 w-4" />
                          <span>6 Yorum</span>
                        </button>
                      </div>
                      <Bookmark className="h-4 w-4 text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 cursor-pointer" />
                    </div>
                  </div>

                  {/* Post 2 */}
                  <div className="bg-slate-50 dark:bg-slate-900/90 rounded-2xl border-2 border-slate-300 dark:border-slate-800 overflow-hidden shadow-xs">
                    <div className="p-3.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                          YNT
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>Bina Yönetimi (Resmi)</span>
                            <Pin className="h-3 w-3 text-amber-500" />
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Sabitlenmiş Duyuru</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-blue-700 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/50">
                        Tüm Bina
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                        Sayın sakinlerimiz, yarın 14:00 - 15:30 saatleri arasında asansör yıllık periyodik muayenesi yapılacaktır.
                        Kısa süreli servis dışı kalacaktır, bilgilerinize sunarız.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SOHBET & GRUPLAR */}
              {activeTab === "sohbet" && (
                <div className="space-y-3 max-w-xl mx-auto">
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/90 p-3 rounded-xl border border-slate-300 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <HeartHandshake className="h-5 w-5 text-blue-600 dark:text-sky-400" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">#Yardımlaşma &amp; İmece Kanalı</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Komşular arası matkap, merdiven, çocuk gereçleri</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                      🔒 Telefonlar Gizli
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <div className="flex flex-col items-start">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 ml-1 mb-0.5">
                        Daire 8 • Fatma K.
                      </span>
                      <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-3 rounded-2xl rounded-bl-xs text-xs border border-slate-300 dark:border-slate-700/80 max-w-md shadow-xs">
                        Merhaba komşular, bugün için matkap ödünç verebilecek biri var mı? 1 saatte geri teslim edeceğim.
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-sky-400 mr-1 mb-0.5">
                        Daire 14 • Siz (Mehmet Y.)
                      </span>
                      <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-br-xs text-xs max-w-md shadow-xs font-medium">
                        Merhabalar Fatma Hanım, bende darbeli matkap var, gelip Daire 14&apos;ten alabilirsiniz.
                      </div>
                    </div>

                    <div className="flex flex-col items-start">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 ml-1 mb-0.5">
                        Daire 8 • Fatma K.
                      </span>
                      <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-3 rounded-2xl rounded-bl-xs text-xs border border-slate-300 dark:border-slate-700/80 max-w-md shadow-xs">
                        Çok teşekkürler Mehmet Bey, hemen uğruyorum! 🙏
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ANKETLER */}
              {activeTab === "anket" && (
                <div className="space-y-4 max-w-lg mx-auto bg-slate-50 dark:bg-slate-900/90 p-5 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 dark:text-sky-300 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800/60 flex items-center gap-1.5">
                      <Vote className="h-3.5 w-3.5" /> Canlı Komşu Anketi
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">24 Oy Verildi</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Bahçe kamelyası yanına ortak barbekü ve piknik masası yapılsın mı?
                  </h3>

                  <div className="space-y-2">
                    {[
                      { text: "Evet, kesinlikle yapılsın 🎉", count: 18, percent: 75 },
                      { text: "Daha sonra değerlendirilsin", count: 4, percent: 17 },
                      { text: "Gerek yok", count: 2, percent: 8 },
                    ].map((opt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDemoVote(idx)}
                        className={`w-full text-left relative overflow-hidden rounded-xl p-3 text-xs border-2 transition-all cursor-pointer ${
                          demoVote === idx
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-950/60 font-bold text-slate-900 dark:text-white"
                            : "border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div
                          className="absolute inset-y-0 left-0 bg-blue-600/15 dark:bg-blue-500/20"
                          style={{ width: `${opt.percent}%` }}
                        />
                        <div className="relative flex items-center justify-between z-10">
                          <span className="flex items-center gap-2">
                            {demoVote === idx && <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-sky-400" />}
                            {opt.text}
                          </span>
                          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                            %{opt.percent} ({opt.count} oy)
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center font-mono">
                    👆 Seçeneklere tıklayarak canlı oylama simülasyonunu test edebilirsiniz.
                  </p>
                </div>
              )}

              {/* TAB 4: ARIZA & İSTEK */}
              {activeTab === "ariza" && (
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">B Blok Asansör Kapı Sensörü Arızası</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Daire 12 tarafından fotoğraflandı • Yetkili servise iletildi.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 px-2.5 py-1 rounded border border-cyan-200 dark:border-cyan-500/30">
                      İşlemde
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">Bahçe Otomatik Sulama Hattı Onarımı</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Bahçıvan tarafından vana değiştirilerek fotoğraf yüklendi.</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-500/30">
                      Çözüldü
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          NUMBERS & PLATFORM GUARANTEES (DÜRÜST & ŞEFFAF TAAHHÜTLER)
      ══════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="py-12 bg-slate-100/60 dark:bg-[#070b14] border-b border-slate-300 dark:border-slate-800/80 transition-colors">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-700 dark:text-sky-300 font-bold bg-blue-100 dark:bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-300 dark:border-blue-800">
              ŞEFFAFLIK VE GÜVEN TAAHHÜTLERİMİZ
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="stat-item p-5 rounded-2xl bg-white dark:bg-[#0d1424] border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-200/60 dark:shadow-xs ring-1 ring-slate-900/5 transition-colors">
              <p className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">%100</p>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200 font-bold mt-1">Gizli Numara (KVKK)</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Telefonunuz sakinlerle asla paylaşılmaz</p>
            </div>
            <div className="stat-item p-5 rounded-2xl bg-white dark:bg-[#0d1424] border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-200/60 dark:shadow-xs ring-1 ring-slate-900/5 transition-colors">
              <p className="text-3xl sm:text-5xl font-black text-blue-600 dark:text-sky-400 tracking-tight tabular-nums">60 Gün</p>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200 font-bold mt-1">Lansmana Özel Deneme</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Kredi kartı gerekmez, ilk 60 gün 0 ₺</p>
            </div>
            <div className="stat-item p-5 rounded-2xl bg-white dark:bg-[#0d1424] border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-200/60 dark:shadow-xs ring-1 ring-slate-900/5 transition-colors">
              <p className="text-3xl sm:text-5xl font-black text-sky-600 dark:text-sky-400 tracking-tight tabular-nums">0 TL</p>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200 font-bold mt-1">Kurulum Masrafı</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Gizli maliyet yok, %70 indirimli</p>
            </div>
            <div className="stat-item p-5 rounded-2xl bg-white dark:bg-[#0d1424] border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-200/60 dark:shadow-xs ring-1 ring-slate-900/5 transition-colors">
              <p className="text-3xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight tabular-nums">1 Tıkla</p>
              <p className="text-xs font-mono uppercase tracking-wider text-slate-800 dark:text-slate-200 font-bold mt-1">Kodla Katılım</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Davet koduyla saniyeler içinde aktif</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BENTO GRID: WHY APARTMENTS PREFER THIS SOCIAL NETWORK
      ══════════════════════════════════════════════════════════ */}
      <section ref={bentoRef} className="py-20 bg-slate-100/70 dark:bg-[#090d18] relative transition-colors border-b border-slate-300 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-700 dark:text-sky-300 font-semibold bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-300 dark:border-blue-800">
              Modern Komşuluk Çözümü
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 leading-tight">
              Sıkıcı Yönetim Programı Değil, Yaşayan Bir Komşuluk Sosyal Ağı.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-3">
              Yöneticileri kaostan kurtaran, apartman sakinlerine ise huzurlu, samimi ve güvenli bir dijital komşuluk sunan altyapı.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Bento 1: Large Card (Span 7) */}
            <div className="bento-card md:col-span-7 bg-white dark:bg-[#0d1424] rounded-3xl p-6 sm:p-8 border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-200/60 dark:shadow-none ring-1 ring-slate-900/5 flex flex-col justify-between group hover:border-blue-500/50 dark:hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-sky-300 border border-blue-300 dark:border-blue-800 text-xs font-semibold">
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>%100 Telefon Maskeleme</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Numara İfşasız Güvenli Komşuluk
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  WhatsApp gruplarına girdiğiniz an telefon numaranız onlarca yabancıya açılır.
                  Sistemimizde telefon numaraları ve e-postalar tamamen gizlidir; sadece Daire No ve isim görünür.
                </p>
              </div>

              <div className="mt-6 bg-slate-50 dark:bg-[#070b14] p-4 rounded-2xl border border-slate-300 dark:border-slate-800 text-xs flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-sky-300 font-bold">
                    D.8
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Fatma Hanım</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Tel: +90 ••• ••• •• 84 (Gizli)</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30 font-bold">
                  Korumalı
                </span>
              </div>
            </div>

            {/* Bento 2: Medium Card (Span 5) */}
            <div className="bento-card md:col-span-5 bg-white dark:bg-[#0d1424] rounded-3xl p-6 sm:p-8 border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-200/60 dark:shadow-none ring-1 ring-slate-900/5 flex flex-col justify-between group hover:border-sky-500/50 dark:hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 text-xs font-semibold">
                  <Camera className="h-3.5 w-3.5" />
                  <span>Fotoğraflı Komşuluk Akışı</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Duyurular, Paylaşımlar ve Etkinlikler
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Bina içi yardımlaşma, ödünç eşya talepleri, bahçe etkinlikleri ve komşuluk duyurularını özel komşuluk akışınızdan keyifle takip edin.
                </p>
              </div>

              <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-[#070b14] border border-slate-300 dark:border-slate-800 text-xs font-mono text-sky-700 dark:text-sky-300 flex items-center gap-2 shadow-xs">
                <Heart className="h-4 w-4 text-blue-600 fill-blue-600" />
                <span className="font-semibold">Canlı Etkileşim, Yorum ve DM Desteği</span>
              </div>
            </div>

            {/* Bento 3: (Span 4) */}
            <div className="bento-card md:col-span-4 bg-white dark:bg-[#0d1424] rounded-3xl p-6 sm:p-8 border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-200/60 dark:shadow-none ring-1 ring-slate-900/5 space-y-3 group hover:border-teal-500/50 dark:hover:border-slate-700 transition-all">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-400 border border-teal-300 dark:border-teal-500/30 text-xs font-semibold">
                <Vote className="h-3.5 w-3.5" />
                <span>Hızlı Oylama</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Canlı Komşu Anketleri</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Yılda bir kez yapılan toplantıları beklemeden; temizlik saati, bahçe düzeni veya boya rengini tek tıkla oylamaya açın.
              </p>
            </div>

            {/* Bento 4: (Span 4) */}
            <div className="bento-card md:col-span-4 bg-white dark:bg-[#0d1424] rounded-3xl p-6 sm:p-8 border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-200/60 dark:shadow-none ring-1 ring-slate-900/5 space-y-3 group hover:border-amber-500/50 dark:hover:border-slate-700 transition-all">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 text-xs font-semibold">
                <Megaphone className="h-3.5 w-3.5" />
                <span>Resmi Duyuru</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sabitlenen Yönetici Panosu</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Geyik mesajları arasında kaybolan duyurulara son. Yalnızca yönetimin yazdığı resmi kanaldan tüm bina haberdar olur.
              </p>
            </div>

            {/* Bento 5: (Span 4) */}
            <div className="bento-card md:col-span-4 bg-white dark:bg-[#0d1424] rounded-3xl p-6 sm:p-8 border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-200/60 dark:shadow-none ring-1 ring-slate-900/5 space-y-3 group hover:border-indigo-500/50 dark:hover:border-slate-700 transition-all">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-500/30 text-xs font-semibold">
                <Wrench className="h-3.5 w-3.5" />
                <span>Fotoğraflı Takip</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Arıza ve Çözüm Akışı</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                Sakinler bozuk lamba veya asansör arızasını fotoğrafla bildirir; yönetici tamir ettirip çözüldü görseliyle yanıt verir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SIKÇA SORULAN SORULAR
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-100/90 dark:bg-[#070b14] border-b border-slate-300 dark:border-slate-800/80 transition-colors">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-700 dark:text-sky-300 font-semibold bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
              SSS
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Telefon numaram diğer komşular tarafından görülür mü?",
                a: "Hayır. Sistemimiz %100 KVKK ve gizlilik odaklıdır. Komşularınız yalnızca daire numaranızı ve isminizi görür. Telefon numaranız ve e-posta adresiniz asla diğer sakinlerle paylaşılmaz.",
              },
              {
                q: "Apartman sakinlerinin sisteme katılması zor mu?",
                a: "Çok kolay! Sakinler sadece bir davet bağlantısına tıklayarak saniyeler içinde ad-soyad ve daire numarasıyla kayıt olur. Yönetici onay verdiği anda komşuluk akışına, hikayelere ve sohbetlere erişirler.",
              },
              {
                q: "Yönetici olarak uygunsuz mesajları veya gönderileri silebilir miyim?",
                a: "Evet. Yönetici panelinden tüm gönderileri, yorumları ve mesajları anında modere edebilir, resmi duyuru kanallarını sadece yönetimin yazabileceği şekilde kilitleyebilirsiniz.",
              },
              {
                q: "Mobil uygulama gibi telefon ana ekranına eklenebilir mi?",
                a: "Evet! Sistemimiz tam PWA (Progressive Web App) uyumludur. Safari veya Chrome üzerinden 'Ana Ekrana Ekle' diyerek tıpkı yerel bir mobil uygulama gibi ana ekranınızdan tek tıkla kullanabilirsiniz.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#0d1424] rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-200/40 dark:shadow-xs overflow-hidden ring-1 ring-slate-900/5 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 font-bold text-slate-900 dark:text-white flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? "rotate-180 text-blue-600 dark:text-sky-400" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-slate-900 via-[#0b1329] to-[#04060c] text-white text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Apartmanınızda Yeni Bir Komşuluk Dönemi Başlatın
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Lansmana özel 60 gün boyunca tüm özellikleri ücretsiz deneyin. Kredi kartı gerekmez, kurulum dakikalar içinde tamamlanır.
          </p>
          <div className="pt-2">
            <Link
              href="/kayit"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-xl shadow-blue-500/20 transition-all hover:scale-105"
            >
              <UserPlus className="h-4 w-4" />
              <span>Sitenizi Şimdi Ücretsiz Kaydedin</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
