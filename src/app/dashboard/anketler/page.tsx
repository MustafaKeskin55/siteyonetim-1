"use client";

import * as React from "react";
import Link from "next/link";
import {
  Vote,
  CheckCircle2,
  Clock,
  Check,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Building2,
  Users,
  ChevronRight,
  MessagesSquare,
} from "lucide-react";
import { useAlert } from "@/components/ModalProvider";

interface OptionBreakdown {
  text: string;
  count: number;
  percent: number;
}

interface PollItem {
  id: string;
  siteId: string;
  channelId: string;
  channelName: string | null;
  question: string;
  expiresAt: string | null;
  createdAt: string;
  creatorName: string | null;
  totalVotes: number;
  userVote: number | null;
  isExpired: boolean;
  breakdown: OptionBreakdown[];
}

export default function ResidentPollsPage() {
  const showAlert = useAlert();

  const [polls, setPolls] = React.useState<PollItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [votingPollId, setVotingPollId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");

  const fetchPolls = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/community/polls", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPolls(data);
        }
      }
    } catch {
      // sessiz
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const handleVote = async (pollId: string, optionIndex: number) => {
    const targetPoll = polls.find((p) => p.id === pollId);
    if (!targetPoll || targetPoll.isExpired) return;

    if (targetPoll.userVote === optionIndex) {
      // zaten bu seçeneğe oy vermiş
      return;
    }

    setVotingPollId(pollId);

    // Optimistic UI update
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id !== pollId) return p;
        const prevVote = p.userVote;
        const newTotal = prevVote === null ? p.totalVotes + 1 : p.totalVotes;

        const updatedBreakdown = p.breakdown.map((opt, idx) => {
          let newCount = opt.count;
          if (idx === optionIndex) newCount += 1;
          if (prevVote !== null && idx === prevVote) newCount = Math.max(0, newCount - 1);
          const percent = newTotal > 0 ? Math.round((newCount / newTotal) * 100) : 0;
          return { ...opt, count: newCount, percent };
        });

        return {
          ...p,
          totalVotes: newTotal,
          userVote: optionIndex,
          breakdown: updatedBreakdown,
        };
      })
    );

    try {
      const res = await fetch("/api/community/polls/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pollId, optionIndex }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Oy kaydedilemedi");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Oy kaydedilemedi";
      showAlert({ title: "Hata", message: msg, variant: "error" });
      // Geri çek
      fetchPolls();
    } finally {
      setVotingPollId(null);
    }
  };

  const filteredPolls = polls.filter((p) => {
    if (filter === "ACTIVE") return !p.isExpired;
    if (filter === "COMPLETED") return p.isExpired;
    return true;
  });

  const activeCount = polls.filter((p) => !p.isExpired).length;
  const completedCount = polls.filter((p) => p.isExpired).length;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6 pb-20">

        {/* ══════ HEADER ══════ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Vote className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Kararlar &amp; Anketler
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Bina ortak alanları, yatırımlar ve gider kararlarına oy vererek katılın.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchPolls()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Yenile</span>
            </button>

            <Link
              href="/dashboard/topluluk"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs"
            >
              <MessagesSquare className="h-3.5 w-3.5" />
              <span>Komşu Sohbeti</span>
            </Link>
          </div>
        </div>

        {/* ══════ KVKK & TRANSPARENCY NOTICE ══════ */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Şeffaf ve Güvenli Oylama:</strong> Her dairenin 1 oy hakkı bulunur. Oylar sistemde güvenle kayıt altına alınır ve sonuçlar anlık olarak şeffaf biçimde yansıtılır.
            </span>
          </div>
        </div>

        {/* ══════ TABS ══════ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filter === "ALL"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white dark:bg-[#0d1424] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Tüm Kararlar ({polls.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("ACTIVE")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filter === "ACTIVE"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white dark:bg-[#0d1424] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Aktif Oylamalar ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("COMPLETED")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              filter === "COMPLETED"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white dark:bg-[#0d1424] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            Tamamlanan Kararlar ({completedCount})
          </button>
        </div>

        {/* ══════ POLLS LIST ══════ */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600 dark:text-sky-400" />
              <p className="text-xs font-medium">Kararlar ve anketler yükleniyor…</p>
            </div>
          ) : filteredPolls.length === 0 ? (
            <div className="bg-white dark:bg-[#0d1424] rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800/60">
                <Vote className="h-7 w-7" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                {filter === "ACTIVE"
                  ? "Şu Anda Açık Oylama Bulunmuyor"
                  : filter === "COMPLETED"
                  ? "Arşivlenmiş Karar Bulunmuyor"
                  : "Henüz Bir Karar Oylaması Başlatılmamış"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Yönetim veya komşular tarafından bina geneline yeni bir anket veya karar sunulduğunda burada oy kullanabilirsiniz.
              </p>
            </div>
          ) : (
            filteredPolls.map((poll) => {
              const isVoted = poll.userVote !== null;

              return (
                <article
                  key={poll.id}
                  className="bg-white dark:bg-[#0d1424] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors"
                >
                  {/* Top Meta Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          poll.isExpired
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            : "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${poll.isExpired ? "bg-slate-400" : "bg-emerald-500 animate-pulse"}`} />
                        {poll.isExpired ? "Oylama Sona Erdi" : "Oylama Açık"}
                      </span>

                      {poll.channelName && (
                        <span className="font-semibold text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          #{poll.channelName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-[11px] font-mono">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {poll.totalVotes} Daire Oy Verdi
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {poll.expiresAt
                          ? `Bitiş: ${new Date(poll.expiresAt).toLocaleDateString("tr-TR")}`
                          : "Süresiz Oylama"}
                      </span>
                    </div>
                  </div>

                  {/* Soru */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {poll.question}
                    </h3>
                    {poll.creatorName && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Oylamayı Başlatan: <span className="font-semibold">{poll.creatorName}</span>
                      </p>
                    )}
                  </div>

                  {/* Seçenekler Listesi */}
                  <div className="space-y-2.5 pt-1">
                    {poll.breakdown.map((opt, oi) => {
                      const isMyChoice = poll.userVote === oi;

                      return (
                        <button
                          key={oi}
                          type="button"
                          disabled={poll.isExpired || votingPollId === poll.id}
                          onClick={() => handleVote(poll.id, oi)}
                          className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm font-semibold relative overflow-hidden transition-all duration-200 cursor-pointer disabled:cursor-default ${
                            isMyChoice
                              ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-slate-900 dark:text-white ring-1 ring-blue-500"
                              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          {/* Animated Progress Bar */}
                          <div
                            className={`absolute inset-y-0 left-0 pointer-events-none transition-all duration-500 ${
                              isMyChoice
                                ? "bg-blue-500/20 dark:bg-blue-500/30"
                                : "bg-slate-200/50 dark:bg-slate-800/80"
                            }`}
                            style={{ width: `${opt.percent}%` }}
                          />

                          <div className="relative z-10 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                  isMyChoice
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                }`}
                              >
                                {isMyChoice && <Check className="h-3 w-3" />}
                              </span>
                              <span className="font-bold truncate">{opt.text}</span>
                            </div>

                            <div className="flex items-center gap-2 font-mono shrink-0">
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                ({opt.count} oy)
                              </span>
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                %{opt.percent}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Alt Bilgi & Oy Durumu */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div>
                      {isVoted ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-sky-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Oyunuz sisteme kaydedildi.</span>
                          {!poll.isExpired && (
                            <span className="text-slate-400 font-normal ml-1">
                              (Bitişe kadar fikrinizi değiştirebilirsiniz)
                            </span>
                          )}
                        </span>
                      ) : (
                        <span>Oy kullanmak için istediğiniz seçeneğe tıklayın.</span>
                      )}
                    </div>

                    {poll.isExpired && (
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
                        🔒 Nihai Karar Tutanaktadır
                      </span>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
