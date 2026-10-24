"use client";

import * as React from "react";
import {
  Vote,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  Trash2,
  Users,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileCheck2,
  Building2,
  Share2,
} from "lucide-react";
import { useAlert, useConfirm } from "@/components/ModalProvider";

interface Voter {
  name: string;
  apartmentNo: string;
}

interface OptionBreakdown {
  text: string;
  count: number;
  percent: number;
  voters: Voter[];
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
  breakdown: OptionBreakdown[];
}

export default function AdminPollsPage() {
  const showAlert = useAlert();
  const showConfirm = useConfirm();

  const [polls, setPolls] = React.useState<PollItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [expandedPollId, setExpandedPollId] = React.useState<string | null>(null);

  // New Poll Modal
  const [showModal, setShowModal] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [options, setOptions] = React.useState<string[]>([
    "Evet, kesinlikle yapılsın",
    "Gerek yok / Ertelensin",
  ]);
  const [expiresDays, setExpiresDays] = React.useState(7);
  const [saving, setSaving] = React.useState(false);

  const fetchPolls = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/polls", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPolls(data);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      showAlert({ title: "Hata", message: "Lütfen oylama sorusunu yazın.", variant: "error" });
      return;
    }

    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      showAlert({ title: "Hata", message: "En az 2 seçenek gereklidir.", variant: "error" });
      return;
    }

    setSaving(true);
    try {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + expiresDays);

      const res = await fetch("/api/admin/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          question: question.trim(),
          options: cleanOptions,
          expiresAt: expiry.toISOString(),
        }),
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errData?.error || "Oylama başlatılamadı");
      }

      setShowModal(false);
      setQuestion("");
      setOptions(["Evet, kesinlikle yapılsın", "Gerek yok / Ertelensin"]);
      await fetchPolls();
      showAlert({
        title: "Başarılı",
        message: "Yeni bina kararı oylamaya sunuldu ve sakinlerin akışında yayınlandı.",
        variant: "success",
      });
    } catch (err: unknown) {
      showAlert({
        title: "Hata",
        message: err instanceof Error ? err.message : "İşlem başarısız",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, q: string) => {
    const ok = await showConfirm({
      title: "Oylamayı Kaldır",
      message: `"${q}" başlıklı anket ve verilmiş tüm oylar silinecek. Onaylıyor musunuz?`,
      confirmLabel: "Evet, Sil",
      cancelLabel: "Vazgeç",
      variant: "warning",
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/polls?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Silinemedi");
      await fetchPolls();
      showAlert({ title: "Silindi", message: "Oylama kaydı kaldırıldı.", variant: "success" });
    } catch {
      showAlert({ title: "Hata", message: "İşlem başarısız", variant: "error" });
    }
  };

  const addOptionField = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOptionField = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 text-xs font-bold mb-2 border border-blue-200 dark:border-blue-800">
            <Vote className="h-3.5 w-3.5 text-blue-600 dark:text-sky-400" />
            <span>DEMOKRATİK BİNA YÖNETİMİ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Kararlar &amp; Canlı Anketler
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            Toplantı beklemeden apartman kararlarını sakinlerin oylamasına açın ve şeffaf sonuçları takip edin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchPolls}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0d1424] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Yenile</span>
          </button>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-102 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Yeni Karar Oylaması Başlat</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0d1424] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Toplam Oylama</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{polls.length}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center">
            <Vote className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d1424] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Kullanılan Toplam Oy</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {polls.reduce((acc, p) => acc + p.totalVotes, 0)} Oy
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d1424] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Karar Mekanizması</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 flex items-center gap-1.5 text-blue-700 dark:text-sky-400">
              <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-sky-400" />
              1 Daire = 1 Oy Prensibi
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileCheck2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Polls List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white dark:bg-[#0d1424] p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center animate-pulse space-y-3">
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mx-auto" />
            <div className="h-4 w-64 bg-slate-100 dark:bg-slate-800 rounded mx-auto" />
          </div>
        ) : polls.length === 0 ? (
          <div className="bg-white dark:bg-[#0d1424] p-12 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center mx-auto">
              <Vote className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Henüz Açılmış Bir Oylama Yok</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Bahçe düzeni, aidat kararları, boya rengi veya otopark kuralları gibi bina konularını sakinlerin katılımına açmak için hemen yeni bir karar oylaması başlatın.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>İlk Oylamayı Başlat</span>
            </button>
          </div>
        ) : (
          polls.map((poll) => {
            const isExpanded = expandedPollId === poll.id;
            return (
              <div
                key={poll.id}
                className="bg-white dark:bg-[#0d1424] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* Poll Card Header */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800">
                          {poll.channelName || "Genel Oylama"}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="h-3.5 w-3.5" />
                          {poll.createdAt ? new Date(poll.createdAt).toLocaleDateString("tr-TR") : "Bugün"}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                          {poll.totalVotes} Sakin Oy Kullandı
                        </span>
                      </div>

                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{poll.question}</h2>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setExpandedPollId(isExpanded ? null : poll.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <span>{isExpanded ? "Detayı Gizle" : "Daire Bazlı Dağılım"}</span>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(poll.id, poll.question)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Oylamayı Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Options Progress Bars */}
                  <div className="mt-5 space-y-3">
                    {poll.breakdown.map((opt, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{opt.text}</span>
                          <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">
                            %{opt.percent} ({opt.count} oy)
                          </span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              idx === 0
                                ? "bg-blue-600"
                                : idx === 1
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${opt.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded: Which apartment voted for what */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] p-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                      Daire ve Sakin Bazında Oy Dağılımı
                    </h4>
                    {poll.totalVotes === 0 ? (
                      <p className="text-xs text-slate-500">Henüz hiç kimse oy kullanmadı.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {poll.breakdown.map((opt, optIdx) => (
                          <div key={optIdx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">{opt.text}</span>
                              <span className="text-[11px] font-mono font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-sky-300 px-2 py-0.5 rounded">
                                {opt.count} Oy
                              </span>
                            </div>
                            {opt.voters.length === 0 ? (
                              <p className="text-[11px] text-slate-400">Bu seçeneğe oy verilmedi.</p>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {opt.voters.map((v, vIdx) => (
                                  <span
                                    key={vIdx}
                                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                                  >
                                    <span className="font-bold text-blue-600 dark:text-sky-400">D.{v.apartmentNo}</span>
                                    <span>{v.name}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ══════════ MODAL: CREATE POLL ══════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1424] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400">
                  <Vote className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Yeni Karar Oylaması Başlat</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tüm sakinlerin oyuna sunulur</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Oylama Sorusu / Konu Başlığı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Bahçe kamelyası yanına barbekü masası yapılsın mı?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Oylama Seçenekleri
                  </label>
                  {options.length < 6 && (
                    <button
                      type="button"
                      onClick={addOptionField}
                      className="text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
                    >
                      + Seçenek Ekle
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 w-5">{idx + 1}.</span>
                      <input
                        type="text"
                        required
                        placeholder={`Seçenek ${idx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const next = [...options];
                          next[idx] = e.target.value;
                          setOptions(next);
                        }}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOptionField(idx)}
                          className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-2 rounded-lg cursor-pointer"
                          title="Seçeneği Kaldır"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Oylama Süresi
                </label>
                <select
                  value={expiresDays}
                  onChange={(e) => setExpiresDays(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>3 Günlük Hızlı Oylama</option>
                  <option value={7}>7 Gün (Standart)</option>
                  <option value={14}>14 Gün (Geniş Katılımlı)</option>
                  <option value={30}>30 Gün (Yıllık Planlama)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Yayınlanıyor..." : "Oylamayı Başlat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
