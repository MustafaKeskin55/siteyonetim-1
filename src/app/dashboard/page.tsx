"use client";

import * as React from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Wrench,
  Shield,
  Plus,
  ArrowRight,
  Clock,
  MessagesSquare,
  Vote,
  Sparkles,
  ChevronRight,
  Send,
  Building2,
  Camera,
  Heart,
  MessageCircle,
  Share2,
  PlusCircle,
  Image as ImageIcon,
  ShieldCheck,
  User,
  Coffee,
  Gift,
  HelpCircle,
  Check,
  X,
  Phone,
  Bookmark,
} from "lucide-react";

interface Story {
  id: string;
  name: string;
  label: string;
  apt: string;
  color: string;
  isUser?: boolean;
  content: string;
  time: string;
  image?: string;
}

interface FeedPost {
  id: string;
  authorName: string;
  authorApt: string;
  authorRole?: string;
  timeAgo: string;
  content: string;
  tags?: string[];
  isPinned?: boolean;
  image?: string;
  likes: number;
  liked: boolean;
  comments: { author: string; apt: string; text: string; time: string }[];
  poll?: {
    question: string;
    totalVotes: number;
    userVote?: number;
    options: { text: string; votes: number }[];
  };
}

export default function DashboardPage() {
  const [residentName, setResidentName] = React.useState("Komşu");
  const [apartmentNo, setApartmentNo] = React.useState("14");
  const [siteName, setSiteName] = React.useState("Zümrüt Sitesi");
  const [balance, setBalance] = React.useState(0);
  const [activeStory, setActiveStory] = React.useState<Story | null>(null);
  const [newPostText, setNewPostText] = React.useState("");
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);

  // Initial rich social feed data
  const [posts, setPosts] = React.useState<FeedPost[]>([
    {
      id: "post-announcement",
      authorName: "Site Yönetim Kurulu",
      authorApt: "Yönetim Ofisi",
      authorRole: "YÖNETİCİ RESMİ DUYURUSU",
      isPinned: true,
      timeAgo: "2 saat önce",
      content:
        "Değerli sakinlerimiz, perşembe günü 10:00 - 13:00 saatleri arasında merkezi asansör ve hidrofor sistemlerinin periyodik güvenlik denetimi yapılacaktır. Kısa süreli su basıncı düşüşü yaşanabilir. Anlayışınız için teşekkür ederiz.",
      tags: ["#ResmiDuyuru", "#BakımOnarım"],
      likes: 34,
      liked: false,
      comments: [
        {
          author: "Murat Bey",
          apt: "D.8",
          text: "Bilgilendirme için teşekkürler yönetim.",
          time: "1 saat önce",
        },
      ],
    },
    {
      id: "post-social-1",
      authorName: "Zeynep & Ali Bey",
      authorApt: "Daire 6",
      timeAgo: "45 dk önce",
      content:
        "Merhabalar komşular! ☕️🍪 Havalar güzelleşmişken bahçedeki kamelyada komşuluk çayı ve ev yapımı kurabiye ikramı hazırladık. Müsait olan tüm komşularımızı ve çocukları bekleriz!",
      tags: ["#KomşulukÇayı", "#BahçeBuluşması"],
      likes: 28,
      liked: true,
      comments: [
        {
          author: "Kemal Bey",
          apt: "D.12",
          text: "15 dakikaya çay bardağımı alıp iniyorum!",
          time: "30 dk önce",
        },
        {
          author: "Ayşe Hanım",
          apt: "D.3",
          text: "Ellerinize sağlık, börek de ben getiriyorum 🥐",
          time: "12 dk önce",
        },
      ],
    },
    {
      id: "post-poll-1",
      authorName: "Ortak Yaşam Komitesi",
      authorApt: "D.11 & Yönetim",
      timeAgo: "3 saat önce",
      content:
        "Bina sakinlerimizin ortak kararıyla: Bahçe peyzajında kullanılmayan atıl çim alanına çocuklar için güvenli kauçuk zeminli mini oyun parkı yapılsın mı?",
      tags: ["#DemokratikOylama", "#BinaGelişimi"],
      likes: 42,
      liked: false,
      comments: [],
      poll: {
        question: "Çocuk oyun parkı alanı genişletilsin mi?",
        totalVotes: 25,
        userVote: 0,
        options: [
          { text: "Evet, kauçuk zeminli çocuk parkı yapılsın", votes: 19 },
          { text: "Hayır, mevcut yeşil çim alan korunsun", votes: 6 },
        ],
      },
    },
    {
      id: "post-borrow-1",
      authorName: "Ahmet Yılmaz",
      authorApt: "Daire 9",
      timeAgo: "5 saat önce",
      content:
        "Komşular selam, salona avize takmak için 2 saatliğine yüksek merdiveni olan komşum var mıdır? İşim biter bitmez teslim ederim.",
      tags: ["#ÖdünçEşya", "#Yardımlaşma"],
      likes: 12,
      liked: false,
      comments: [
        {
          author: "Selin Kaya",
          apt: "D.4",
          text: "Ahmet Bey bizde 5 basamaklı alüminyum merdiven var, kapıdayım alabilirsiniz.",
          time: "4 saat önce",
        },
        {
          author: "Ahmet Yılmaz",
          apt: "D.9",
          text: "Harikasınız Selin Hanım, 5 dakikaya çalıyorum zilinizi!",
          time: "4 saat önce",
        },
      ],
    },
  ]);

  const stories: Story[] = [
    {
      id: "s0",
      name: `Siz (D.${apartmentNo})`,
      label: "Hikaye Ekle",
      apt: `D.${apartmentNo}`,
      color: "border-dashed border-2 border-slate-300 dark:border-slate-700",
      isUser: true,
      content: "Komşularınızla anlık fotoğraf veya not paylaşın.",
      time: "Şimdi",
    },
    {
      id: "s1",
      name: "Yönetim",
      label: "Duyuru 📌",
      apt: "YNT",
      color: "bg-gradient-to-tr from-blue-600 to-indigo-600",
      content: "Asansör periyodik güvenlik denetimi perşembe günü yapılacaktır.",
      time: "2 saat önce",
    },
    {
      id: "s2",
      name: "Daire 6",
      label: "Çay Saati ☕️",
      apt: "D.6",
      color: "bg-gradient-to-tr from-cyan-500 to-blue-600",
      content: "Kamelyada komşuluk çayı başladı, çayınızı alıp gelin!",
      time: "45 dk önce",
    },
    {
      id: "s3",
      name: "Daire 9",
      label: "Kedi Bulundu 🐱",
      apt: "D.9",
      color: "bg-gradient-to-tr from-amber-500 to-orange-500",
      content: "Bina girişinde tasmali gri bir tekir kedi bulundu. Sahibini arıyoruz.",
      time: "3 saat önce",
    },
    {
      id: "s4",
      name: "Daire 12",
      label: "Matkap Lazım 🔧",
      apt: "D.12",
      color: "bg-gradient-to-tr from-emerald-500 to-teal-600",
      content: "Darbeli matkabı olan var mı? 1 delik delip iade edeceğim.",
      time: "4 saat önce",
    },
    {
      id: "s5",
      name: "Daire 18",
      label: "Temiz Masa 🎁",
      apt: "D.18",
      color: "bg-gradient-to-tr from-blue-500 to-sky-400",
      content: "İhtiyacı olan komşumuza az kullanılmış beyaz çalışma masasını hediye ediyoruz.",
      time: "5 saat önce",
    },
  ];

  // User info fetch from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u.name) setResidentName(u.name);
        if (u.apartmentNo) setApartmentNo(u.apartmentNo);
        if (u.siteName) setSiteName(u.siteName);
      }
    } catch {}

    // Mock aidat bakiye check
    fetch("/api/payments")
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => {
        if (Array.isArray(list)) {
          const unpaid = list
            .filter((p: any) => p.status === "Bekliyor")
            .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);
          setBalance(unpaid);
        }
      })
      .catch(() => {});
  }, []);

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
        };
      })
    );
  };

  const handleVote = (postId: string, optionIndex: number) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId || !p.poll) return p;
        const currentVote = p.poll.userVote;
        if (currentVote === optionIndex) return p;

        const newOptions = p.poll.options.map((opt, idx) => {
          if (idx === optionIndex) return { ...opt, votes: opt.votes + 1 };
          if (currentVote !== undefined && idx === currentVote) return { ...opt, votes: Math.max(0, opt.votes - 1) };
          return opt;
        });

        const newTotal = currentVote === undefined ? p.poll.totalVotes + 1 : p.poll.totalVotes;

        return {
          ...p,
          poll: {
            ...p.poll,
            userVote: optionIndex,
            totalVotes: newTotal,
            options: newOptions,
          },
        };
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      authorName: residentName,
      authorApt: `Daire ${apartmentNo}`,
      timeAgo: "Az önce",
      content: newPostText.trim(),
      tags: selectedTag ? [selectedTag] : ["#Komşuluk"],
      likes: 1,
      liked: true,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    setSelectedTag(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* ══════════════════════════════════════════════════════════
          TOP GREETING & BUILDING IDENTITY BAR
      ══════════════════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════════════════
          TOP GREETING & BUILDING IDENTITY BAR
      ══════════════════════════════════════════════════════════ */}
      <div className="border-b-2 border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0b101d] sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
              D.{apartmentNo}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {residentName}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-sky-400 border border-blue-200 dark:border-blue-800 shrink-0">
                  Daire {apartmentNo}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="truncate">{siteName}</span>
                </span>
                <span>•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
                  <ShieldCheck className="h-3 w-3 shrink-0" /> Telefonunuz Saklı (KVKK)
                </span>
              </p>
            </div>
          </div>

          {/* Quick Badges */}
          <div className="flex items-center gap-2 text-xs shrink-0 flex-wrap">
            <div className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 ${
              balance > 0 
                ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700" 
                : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
            }`}>
              <CreditCard className="h-3.5 w-3.5 shrink-0" />
              <span>{balance > 0 ? `₺${balance.toLocaleString("tr-TR")} Borç` : "Borç Yok"}</span>
            </div>

            <Link
              href="/dashboard/topluluk"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <MessagesSquare className="h-3.5 w-3.5 shrink-0" />
              <span>Komşu Sohbeti</span>
            </Link>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-20">

        {/* ══════════════════════════════════════════════════════════
            1. LIVE STORIES CAROUSEL (SOSYAL HİKAYELER)
        ══════════════════════════════════════════════════════════ */}
        <div className="bg-white dark:bg-[#0d1424] rounded-3xl p-4 sm:p-5 border-2 border-slate-300 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <Camera className="h-4 w-4 text-blue-600 dark:text-sky-400 shrink-0" />
              <span>Komşuluk Hikayeleri (24 Saatlik)</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
              Yalnızca bina sakinlerine açık
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-1 px-1">
            {stories.map((st) => (
              <div
                key={st.id}
                onClick={() => !st.isUser && setActiveStory(st)}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group select-none"
              >
                <div
                  className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full p-[2px] transition-transform duration-200 group-hover:scale-105 shrink-0 ${
                    st.isUser
                      ? "border-2 border-dashed border-blue-400 dark:border-blue-500 bg-slate-50 dark:bg-slate-900 flex items-center justify-center"
                      : st.color
                  }`}
                >
                  <div className="h-full w-full rounded-full bg-white dark:bg-[#0d1424] flex items-center justify-center font-bold text-xs text-slate-800 dark:text-white overflow-hidden p-1">
                    {st.isUser ? (
                      <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-sky-400" />
                    ) : st.apt === "YNT" || st.apt === "Yönetim" ? (
                      <Building2 className="h-5 w-5 text-blue-600 dark:text-sky-400" />
                    ) : (
                      <span className="truncate max-w-full text-[11px] sm:text-xs">{st.apt}</span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-sky-300 text-center max-w-[68px] sm:max-w-[76px] truncate">
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            MAIN GRID: SOCIAL FEED (70%) & WIDGETS (30%)
        ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* ════════════════════════════════════════════════
              LEFT COLUMN: SOCIAL COMMUNITY FEED (8 COLUMNS)
          ════════════════════════════════════════════════ */}
          <div className="col-span-1 md:col-span-7 lg:col-span-8 space-y-5">
            
            {/* Quick Post Box */}
            <div className="bg-white dark:bg-[#0d1424] rounded-3xl p-5 border-2 border-slate-300 dark:border-slate-800 shadow-sm transition-colors">
              <form onSubmit={handleCreatePost} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    D.{apartmentNo}
                  </div>
                  <textarea
                    rows={2}
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder={`Komşularınızla ne paylaşmak istersiniz, ${residentName.split(" ")[0]}?`}
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 resize-none transition-all"
                  />
                </div>

                {/* Quick Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold mr-1">Etiket:</span>
                  {["#Yardımlaşma", "#ÖdünçEşya", "#İkinciEl", "#Duyuru", "#BahçeÇayı"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-semibold transition-colors cursor-pointer ${
                        selectedTag === tag
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Actions & Submit */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                      title="Fotoğraf Ekle"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                    <Link
                      href="/dashboard/topluluk"
                      className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                      title="Anket Başlat"
                    >
                      <Vote className="h-4 w-4" />
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={!newPostText.trim()}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Gönder</span>
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </form>
            </div>

            {/* Post Feed Items */}
            <div className="space-y-4">
              {posts.map((post) => {
                const isAnnouncement = post.isPinned || post.authorRole;
                return (
                  <article
                    key={post.id}
                    className={`rounded-3xl p-5 sm:p-6 border-2 transition-colors ${
                      isAnnouncement
                        ? "bg-blue-50/60 dark:bg-[#0c162d] border-blue-300 dark:border-blue-800 shadow-sm"
                        : "bg-white dark:bg-[#0d1424] border-slate-300 dark:border-slate-800 shadow-sm"
                    }`}
                  >
                    {/* Post Top Header */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200/90 dark:border-slate-800/80">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isAnnouncement
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700"
                        }`}>
                          {post.authorApt.startsWith("D.") ? post.authorApt : post.authorApt.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {post.authorName}
                            </h3>
                            {post.authorRole && (
                              <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white">
                                {post.authorRole}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {post.authorApt} &bull; {post.timeAgo}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30 shrink-0">
                        🔒 Numara Gizli
                      </span>
                    </div>

                    {/* Post Content */}
                    <div className="py-4 space-y-3">
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>

                      {/* Embedded Poll Card */}
                      {post.poll && (
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3 my-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                              <Vote className="h-4 w-4 text-blue-600 dark:text-sky-400" />
                              Bina İçi Canlı Oylama
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {post.poll.totalVotes} daire oy kullandı
                            </span>
                          </div>

                          <div className="space-y-2">
                            {post.poll.options.map((opt, oi) => {
                              const isVoted = post.poll?.userVote === oi;
                              const percent = post.poll?.totalVotes 
                                ? Math.round((opt.votes / post.poll.totalVotes) * 100) 
                                : 0;
                              return (
                                <button
                                  key={oi}
                                  type="button"
                                  onClick={() => handleVote(post.id, oi)}
                                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold relative overflow-hidden transition-all cursor-pointer ${
                                    isVoted
                                      ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-slate-900 dark:text-white ring-1 ring-blue-500"
                                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                                  }`}
                                >
                                  {/* Progress bar fill */}
                                  <div
                                    className="absolute inset-y-0 left-0 bg-blue-500/15 dark:bg-blue-500/20 pointer-events-none transition-all duration-500"
                                    style={{ width: `${percent}%` }}
                                  />
                                  <div className="relative z-10 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                                        isVoted ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 dark:border-slate-600"
                                      }`}>
                                        {isVoted && <Check className="h-2.5 w-2.5" />}
                                      </span>
                                      <span>{opt.text}</span>
                                    </div>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white shrink-0">
                                      %{percent} ({opt.votes})
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {post.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono text-blue-700 dark:text-sky-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/60"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Bottom Action Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/90 dark:border-slate-800/80 text-xs">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                            post.liked
                              ? "text-blue-600 dark:text-sky-400"
                              : "text-slate-600 dark:text-slate-400 hover:text-blue-600"
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${post.liked ? "fill-blue-600 dark:fill-sky-400" : ""}`} />
                          <span>{post.likes}</span>
                        </button>

                        <button
                          type="button"
                          className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments.length} Yorum</span>
                        </button>
                      </div>

                      <Link
                        href="/dashboard/topluluk"
                        className="text-[11px] text-blue-600 dark:text-sky-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Sohbete Katıl</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>

                    {/* Comments preview */}
                    {post.comments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        {post.comments.map((cm, ci) => (
                          <div key={ci} className="text-xs bg-slate-50 dark:bg-slate-900/70 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-2">
                            <span className="font-bold text-blue-700 dark:text-sky-300 shrink-0">
                              {cm.apt} &bull; {cm.author}:
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">{cm.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

          </div>

          {/* ════════════════════════════════════════════════
              RIGHT COLUMN: BUILDING STATUS & ACTIONS (4 COLUMNS)
          ════════════════════════════════════════════════ */}
          <div className="col-span-1 md:col-span-5 lg:col-span-4 space-y-5">
            
            {/* 1. Komşuluk İmecesi & Aktif Oylama Kartı */}
            <div className="bg-white dark:bg-[#0d1424] rounded-3xl p-5 sm:p-6 border-2 border-slate-300 dark:border-slate-800 shadow-sm transition-colors space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Vote className="h-4 w-4 text-blue-600 dark:text-sky-400" />
                  Günün Karar Oylaması
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Canlı Oylama
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  Güneş Enerjili Çevre Aydınlatması Kurulsun mu?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  18 komşumuz oy kullandı. Oylama perşembe 18:00&apos;de sona erecek.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    const el = document.getElementById("post-poll");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full py-3 px-4 rounded-xl text-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Vote className="h-3.5 w-3.5" />
                  <span>Oylamaya Katıl &amp; Oy Ver</span>
                </button>

                <Link
                  href="/dashboard/topluluk"
                  className="w-full py-2.5 px-3 rounded-xl text-center text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-400 font-semibold block transition-colors"
                >
                  Tüm Komşuluk Kararları &rarr;
                </Link>
              </div>
            </div>

            {/* 2. Arıza & Teknik İstek Kartı */}
            <div className="bg-white dark:bg-[#0d1424] rounded-3xl p-5 sm:p-6 border-2 border-slate-300 dark:border-slate-800 shadow-sm transition-colors space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Arıza &amp; İstek Takibi
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-sky-400 border border-blue-200 dark:border-blue-800">
                  1 İşlemde
                </span>
              </div>

              {/* Active Ticket Item */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    3. Kat Koridor Lambası
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 font-bold">
                    İşlemde
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  Elektrikçiye iş emri verildi, parça bekleniyor.
                </p>
              </div>

              <Link
                href="/dashboard/requests"
                className="w-full py-3 px-4 rounded-xl text-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 block"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Fotoğraflı Yeni Arıza Bildir</span>
              </Link>
            </div>

            {/* 3. Komşuluk Kanalları Hızlı Menü */}
            <div className="bg-white dark:bg-[#0d1424] rounded-3xl p-5 sm:p-6 border-2 border-slate-300 dark:border-slate-800 shadow-sm transition-colors space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <MessagesSquare className="h-4 w-4 text-blue-600 dark:text-sky-400" />
                <span>Tematik Komşuluk Odaları</span>
              </h3>
              
              <div className="space-y-1.5">
                {[
                  { name: "#Genel-Sohbet", desc: "Tüm bina sakinleri" },
                  { name: "#Yardimlasma-Odunc", desc: "Alet ve eşya ödünç alma" },
                  { name: "#Ikinci-El-Esya", desc: "Devir ve paylaşım" },
                  { name: "#Bahce-ve-Evcil-Hayvan", desc: "Kediler, köpekler, peyzaj" },
                ].map((ch) => (
                  <Link
                    key={ch.name}
                    href="/dashboard/topluluk"
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 transition-all flex items-center justify-between text-xs group"
                  >
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-sky-400">
                        {ch.name}
                      </span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{ch.desc}</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600" />
                  </Link>
                ))}
              </div>
            </div>

            {/* 4. Yöneticiye Hızlı İletişim */}
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-[#0c162d] dark:to-[#0a0f1c] rounded-3xl p-5 border-2 border-blue-200 dark:border-blue-900/40 text-xs space-y-2">
              <div className="flex items-center gap-2 text-blue-700 dark:text-sky-300 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>Apartman Yönetimi</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Kişisel telefon numaraları kapalıdır. Sorularınızı veya resmi dilekçelerinizi doğrudan panel üzerinden yönetime iletebilirsiniz.
              </p>
              <Link
                href="/dashboard/topluluk"
                className="inline-flex items-center gap-1.5 text-blue-600 dark:text-sky-400 font-bold hover:underline pt-1"
              >
                <span>Yöneticiye Özel Mesaj Gönder</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════
          STORY VIEWER MODAL
      ══════════════════════════════════════════════════════════ */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-sm sm:max-w-md bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-700 shadow-2xl p-5 sm:p-6 space-y-4">
            {/* Story Top Progress Line */}
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-full animate-pulse" />
            </div>

            {/* Story Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {activeStory.apt === "YNT" || activeStory.apt === "Yönetim" ? (
                    <Building2 className="h-5 w-5 text-white" />
                  ) : (
                    <span className="truncate max-w-[32px]">{activeStory.apt}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">{activeStory.name}</h4>
                    {(activeStory.apt === "YNT" || activeStory.apt === "Yönetim") && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 shrink-0">
                        Resmi Yönetim
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-0.5">{activeStory.time}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                title="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Story Body */}
            <div className="py-6 sm:py-8 text-center space-y-3 px-2">
              <div className="inline-flex p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-3xl shadow-inner">
                ☕️
              </div>
              <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed max-w-sm mx-auto">
                {activeStory.content}
              </p>
            </div>

            {/* Story Footer Action */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Komşuya Cevap Ver</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
