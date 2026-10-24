"use client";

import * as React from "react";
import Link from "next/link";
import {
  Vote,
  Users,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  RefreshCw,
  Plus,
  Megaphone,
  Wrench,
  ChevronRight,
  Building2,
  UserCheck,
  MessagesSquare,
  Sparkles,
  ShieldCheck,
  EyeOff,
  Camera,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { ClientRequestItem } from "@/lib/request-ui";
import { browserApiUrl } from "@/lib/browser-api-base";
import { useAlert } from "@/components/ModalProvider";

type ResidentRow = {
  id: string;
  name: string;
  emailOrPhone: string;
  status?: string;
  daire: string;
  blok?: string;
};

interface PollBreakdown {
  text: string;
  count: number;
  percent: number;
}

interface PollSummary {
  id: string;
  question: string;
  totalVotes: number;
  channelName: string | null;
  createdAt: string;
  breakdown: PollBreakdown[];
}

function StatCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-12 w-12 rounded-xl bg-slate-200" />
        <div className="h-6 w-14 rounded-full bg-slate-200" />
      </div>
      <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
      <div className="h-7 w-28 bg-slate-200 rounded" />
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  Çözüldü: "bg-emerald-50 text-emerald-700 border-emerald-200",
  İşlemde: "bg-blue-50 text-blue-700 border-blue-200",
  Bekliyor: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function AdminDashboardPage() {
  const showAlert = useAlert();
  const [mounted, setMounted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [loadErr, setLoadErr] = React.useState("");
  const [approvingId, setApprovingId] = React.useState<string | null>(null);

  const [stats, setStats] = React.useState({
    totalResidents: 0,
    approvedResidents: 0,
    pendingResidents: 0,
    pendingRequests: 0,
    activePollsCount: 0,
    totalVotesCount: 0,
  });

  const [recentRequests, setRecentRequests] = React.useState<ClientRequestItem[]>([]);
  const [pendingResidentsList, setPendingResidentsList] = React.useState<ResidentRow[]>([]);
  const [polls, setPolls] = React.useState<PollSummary[]>([]);

  // Fast Quick Poll Modal from Dashboard
  const [showQuickPollModal, setShowQuickPollModal] = React.useState(false);
  const [quickQuestion, setQuickQuestion] = React.useState("");
  const [quickOptions, setQuickOptions] = React.useState(["Evet, kesinlikle", "Gerek yok / Hayır"]);
  const [savingQuickPoll, setSavingQuickPoll] = React.useState(false);

  const loadData = React.useCallback(async (cancelled: { v: boolean }) => {
    setLoadErr("");
    setLoading(true);
    try {
      const [reqRes, resRes, pollRes] = await Promise.all([
        fetch(browserApiUrl("/api/requests"), { credentials: "include" }),
        fetch(browserApiUrl("/api/admin/residents"), { credentials: "include" }),
        fetch(browserApiUrl("/api/admin/polls"), { credentials: "include" }),
      ]);

      const requests = reqRes.ok ? ((await reqRes.json()) as ClientRequestItem[]) : [];
      const residents = resRes.ok ? ((await resRes.json()) as ResidentRow[]) : [];
      const pollData = pollRes.ok ? ((await pollRes.json()) as PollSummary[]) : [];

      if (cancelled.v) return;

      const pendingReq = requests.filter((r) => r.status === "Bekliyor").length;
      const pendingRes = residents.filter((r) => r.status === "PENDING");
      const approvedRes = residents.filter((r) => r.status !== "PENDING");
      const totalVotes = pollData.reduce((acc, p) => acc + (p.totalVotes || 0), 0);

      setStats({
        totalResidents: residents.length,
        approvedResidents: approvedRes.length,
        pendingResidents: pendingRes.length,
        pendingRequests: pendingReq,
        activePollsCount: pollData.length,
        totalVotesCount: totalVotes,
      });

      setRecentRequests(requests.slice(0, 5));
      setPendingResidentsList(pendingRes.slice(0, 4));
      setPolls(pollData.slice(0, 3));
    } catch (e) {
      if (!cancelled.v) setLoadErr(e instanceof Error ? e.message : "Veriler alınamadı.");
    } finally {
      if (!cancelled.v) setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setMounted(true);
    const cancelled = { v: false };
    loadData(cancelled);
    return () => {
      cancelled.v = true;
    };
  }, [loadData]);

  // 1-Click Resident Approve / Reject directly from Home
  const handleQuickApprove = async (userId: string, action: "APPROVE" | "REJECT") => {
    setApprovingId(userId);
    try {
      const res = await fetch("/api/admin/residents/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, action }),
      });
      if (!res.ok) throw new Error("İşlem başarısız");
      showAlert({
        title: action === "APPROVE" ? "Sakin Onaylandı" : "Başvuru Reddedildi",
        message:
          action === "APPROVE"
            ? "Sakin sisteme kabul edildi ve komşuluk akışına erişimi açıldı."
            : "Kayıt başvurusu reddedildi.",
        variant: action === "APPROVE" ? "success" : "info",
      });
      loadData({ v: false });
    } catch {
      showAlert({ title: "Hata", message: "Onay işlemi yapılamadı.", variant: "error" });
    } finally {
      setApprovingId(null);
    }
  };

  const handleCreateQuickPoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    setSavingQuickPoll(true);
    try {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);

      const res = await fetch("/api/admin/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question: quickQuestion.trim(),
          options: quickOptions.filter((o) => o.trim()),
          expiresAt: expiry.toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Anket başlatılamadı");

      setShowQuickPollModal(false);
      setQuickQuestion("");
      showAlert({
        title: "Oylama Başlatıldı",
        message: "Yeni bina kararı tüm sakinlerin akışında canlı oylamaya sunuldu.",
        variant: "success",
      });
      loadData({ v: false });
    } catch {
      showAlert({ title: "Hata", message: "Oylama oluşturulamadı.", variant: "error" });
    } finally {
      setSavingQuickPoll(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2 border border-blue-200">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>NUMARASIZ &amp; GÜVENLİ KOMŞULUK YÖNETİM MERKEZİ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Site &amp; Apartman Yönetim Paneli
          </h1>
          <p className="text-slate-600 mt-1 text-sm">
            Canlı bina kararları, KVKK korumalı sakin listesi, fotoğraflı arıza takibi ve komşuluk akışı.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Sakin portalını yeni sekmede görüntüle"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Sakin Görünümü</span>
          </Link>

          <button
            onClick={() => {
              const c = { v: false };
              loadData(c);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Yenile
          </button>
        </div>
      </div>

      {/* Onay Bekleyen Sakinler Alert Banner */}
      {stats.pendingResidents > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-base shrink-0 shadow-sm">
                {stats.pendingResidents}
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <span>Onayınızı Bekleyen Yeni Sakin Başvuruları Var</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 font-bold">
                    Davet Kodlu
                  </span>
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  Web üzerinden katılım sağlayan komşularınız onayınızın ardından komşuluk portalına ve grup sohbetine erişebilecektir.
                </p>
              </div>
            </div>

            <Link
              href="/admin/residents"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all shrink-0"
            >
              Tüm Başvuruları İncele ({stats.pendingResidents}) &rarr;
            </Link>
          </div>

          {/* Quick inline approval list */}
          {pendingResidentsList.length > 0 && (
            <div className="mt-4 pt-3 border-t border-amber-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {pendingResidentsList.map((res) => (
                <div
                  key={res.id}
                  className="bg-white/90 p-3 rounded-2xl border border-amber-200 flex items-center justify-between gap-2 shadow-xs"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{res.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">Daire: {res.daire || "—"}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={approvingId === res.id}
                      onClick={() => handleQuickApprove(res.id, "APPROVE")}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer disabled:opacity-50"
                      title="Onayla"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={approvingId === res.id}
                      onClick={() => handleQuickApprove(res.id, "REJECT")}
                      className="p-1.5 rounded-lg bg-slate-200 hover:bg-rose-100 hover:text-rose-600 text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
                      title="Reddet"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            {/* Stat 1: Demokratik Kararlar & Anketler */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-blue-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Demokratik Kararlar
                </span>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Vote className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.activePollsCount} Aktif Karar
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-600 font-medium">Toplam {stats.totalVotesCount} oy</span>
                <Link href="/admin/anketler" className="text-blue-600 font-bold hover:underline">
                  Oylamalar &rarr;
                </Link>
              </div>
            </div>

            {/* Stat 2: Sakinler & KVKK Koruması */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Kayıtlı Sakinler
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.approvedResidents} Sakin
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <EyeOff className="h-3 w-3" /> %100 Gizli Numara
                </span>
                <Link href="/admin/residents" className="text-emerald-600 font-bold hover:underline">
                  Liste &rarr;
                </Link>
              </div>
            </div>

            {/* Stat 3: Fotoğraflı Arıza & Çözüm */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-indigo-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Arıza &amp; Talepler
                </span>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Wrench className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats.pendingRequests} Açık Talep
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-600 font-medium">Fotoğraflı takip</span>
                <Link href="/admin/requests" className="text-indigo-600 font-bold hover:underline">
                  İşlemler &rarr;
                </Link>
              </div>
            </div>

            {/* Stat 4: Onay Bekleyenler */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Onay Bekleyenler
                </span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <UserCheck className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-amber-600">
                {stats.pendingResidents} Yeni Komşu
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-600 font-medium">Kodla katılım</span>
                <Link href="/admin/residents" className="text-amber-600 font-bold hover:underline">
                  Onayla &rarr;
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Action Hub */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Hızlı Yönetim İşlemleri
          </span>
          <span className="text-[11px] text-slate-500">Bina kontrol merkezi</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setShowQuickPollModal(true)}
            className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/80 border border-slate-200 hover:border-blue-200 transition-all group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Vote className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">Oylama Başlat</span>
              <span className="text-[11px] text-slate-500 truncate block">Anlık bina kararı</span>
            </div>
          </button>

          <Link
            href="/admin/announcements"
            className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-200 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Megaphone className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">Duyuru Yayınla</span>
              <span className="text-[11px] text-slate-500 truncate block">Tüm sakinlere</span>
            </div>
          </Link>

          <Link
            href="/admin/topluluk"
            className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-cyan-50/80 border border-slate-200 hover:border-cyan-200 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MessagesSquare className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">Komşuluk Akışı</span>
              <span className="text-[11px] text-slate-500 truncate block">Kanallar &amp; Moderasyon</span>
            </div>
          </Link>

          <Link
            href="/admin/requests"
            className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200 hover:border-indigo-200 transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 block truncate">Talepleri Yönet</span>
              <span className="text-[11px] text-slate-500 truncate block">Fotoğraflı arızalar</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Two Column Section: Live Polls Preview & Recent Maintenance Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Canlı Karar Oylamaları */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Vote className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Canlı Karar Oylamaları</h2>
                  <p className="text-xs text-slate-500">Demokratik apartman anketleri</p>
                </div>
              </div>
              <Link href="/admin/anketler" className="text-xs font-bold text-blue-600 hover:underline">
                Tümünü Yönet &rarr;
              </Link>
            </div>

            {polls.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-xs text-slate-500">Aktif bir bina oylaması bulunmuyor.</p>
                <button
                  type="button"
                  onClick={() => setShowQuickPollModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Oylama Başlat</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {polls.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[260px]">{p.question}</span>
                      <span className="text-[11px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {p.totalVotes} Oy
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {p.breakdown.slice(0, 2).map((opt, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-700">{opt.text}</span>
                            <span className="font-mono font-bold text-slate-600">%{opt.percent}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${i === 0 ? "bg-blue-600" : "bg-emerald-500"}`}
                              style={{ width: `${opt.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Sakinler telefonlarından oy kullanır
            </span>
            <Link href="/admin/anketler" className="font-bold text-blue-600">
              Detaylı Dağılım
            </Link>
          </div>
        </div>

        {/* Right: Son Fotoğraflı Arıza & İstek Talepleri */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Son Arıza &amp; Talepler</h2>
                  <p className="text-xs text-slate-500">Sakinlerden fotoğraflı bildirimler</p>
                </div>
              </div>
              <Link href="/admin/requests" className="text-xs font-bold text-indigo-600 hover:underline">
                Tüm Talepler ({recentRequests.length}) &rarr;
              </Link>
            </div>

            {recentRequests.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">Henüz açılmış bir talep bulunmuyor.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentRequests.map((req) => (
                  <div key={req.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">{req.title}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            STATUS_STYLES[req.status] || "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {req.category || "Genel Bakım"} &bull; {req.date}
                      </span>
                    </div>

                    <Link
                      href="/admin/requests"
                      className="px-3 py-1 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg shrink-0 transition-colors"
                    >
                      İncele
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-indigo-600" />
              Çözüldü fotoğraflarıyla yanıt verin
            </span>
            <Link href="/admin/requests" className="font-bold text-indigo-600">
              Yeni Talep Aç
            </Link>
          </div>
        </div>

      </div>

      {/* Community Participation & Activity Visual Stats */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Haftalık Bina Etkileşimi &amp; Katılım Ritmi</h2>
            <p className="text-xs text-slate-500 mt-0.5">Komşuluk akışındaki paylaşımlar ve karar oylaması katılımları</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
              <span className="text-slate-600 font-medium">Sosyal Gönderiler</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-600 font-medium">Karar Oyları</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Pzt", Gönderi: 14, Oylama: 32 },
                { name: "Sal", Gönderi: 22, Oylama: 45 },
                { name: "Çar", Gönderi: 18, Oylama: 39 },
                { name: "Per", Gönderi: 26, Oylama: 58 },
                { name: "Cum", Gönderi: 35, Oylama: 72 },
                { name: "Cmt", Gönderi: 31, Oylama: 48 },
                { name: "Paz", Gönderi: 28, Oylama: 41 },
              ]}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="Gönderi" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Oylama" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ══════════ MODAL: FAST QUICK POLL ══════════ */}
      {showQuickPollModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Vote className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Hızlı Karar Oylaması Başlat</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQuickPollModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuickPoll} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Oylama Sorusu
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Asansör periyodik bakım firması değiştirilsin mi?"
                  value={quickQuestion}
                  onChange={(e) => setQuickQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Seçenekler
                </label>
                <div className="space-y-2">
                  {quickOptions.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const copy = [...quickOptions];
                        copy[i] = e.target.value;
                        setQuickOptions(copy);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuickPollModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={savingQuickPoll}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50"
                >
                  {savingQuickPoll ? "Başlatılıyor..." : "Oylamayı Yayınla"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
