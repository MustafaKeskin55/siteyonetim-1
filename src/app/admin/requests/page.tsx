"use client";

import * as React from "react";
import { Wrench, Clock, AlertCircle, CheckCircle2, XCircle, Search, X, ImageIcon } from "lucide-react";
import { useAlert } from "@/components/ModalProvider";

interface RequestItem {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  status: "Bekliyor" | "İşlemde" | "Çözüldü" | "Reddedildi";
  resolutionNote?: string | null;
  resolutionImageUrl?: string | null;
  rejectedNote?: string | null;
  rejectedImageUrl?: string | null;
}

export default function AdminRequestsPage() {
  const showAlert = useAlert();
  const [requests, setRequests] = React.useState<RequestItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("Hepsi");
  const [loadErr, setLoadErr] = React.useState("");

  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState<"Çözüldü" | "Reddedildi">("Çözüldü");
  const [modalRequestId, setModalRequestId] = React.useState("");
  const [modalNote, setModalNote] = React.useState("");
  const [modalImageUrl, setModalImageUrl] = React.useState<string | null>(null);
  const [modalUploading, setModalUploading] = React.useState(false);
  const [modalSubmitting, setModalSubmitting] = React.useState(false);
  const modalFileRef = React.useRef<HTMLInputElement>(null);

  async function loadRequests() {
    setLoadErr("");
    const res = await fetch("/api/requests", { credentials: "include" });
    const raw: unknown = await res.json().catch(() => null);
    if (!res.ok || !Array.isArray(raw)) {
      setLoadErr("Talepler veritabanından okunamıyor.");
      setRequests([]);
      return;
    }
    setRequests(raw as RequestItem[]);
  }

  React.useEffect(() => {
    void loadRequests();
  }, []);

  const openModal = (id: string, type: "Çözüldü" | "Reddedildi") => {
    setModalRequestId(id);
    setModalType(type);
    setModalNote("");
    setModalImageUrl(null);
    setModalOpen(true);
  };

  const handleModalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      void showAlert({ message: "Görsel en fazla 2MB olabilir.", variant: "error" });
      return;
    }
    setModalUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setModalImageUrl(reader.result as string);
      setModalUploading(false);
    };
    reader.onerror = () => setModalUploading(false);
    reader.readAsDataURL(file);
  };

  const submitModal = async () => {
    if (modalSubmitting) return;
    setModalSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: modalRequestId,
          status: modalType,
          note: modalNote || null,
          imageUrl: modalImageUrl || null,
        }),
      });
      if (!res.ok) {
        await showAlert({ message: "Durum güncellenemedi.", variant: "error" });
        return;
      }
      setModalOpen(false);
      await loadRequests();
      await showAlert({ message: `Talep "${modalType}" olarak kaydedildi.`, variant: "success" });
    } finally {
      setModalSubmitting(false);
    }
  };

  const updateStatus = async (id: string, newStatus: "Bekliyor" | "İşlemde") => {
    const res = await fetch("/api/requests", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (!res.ok) {
      await showAlert({ message: "Durum güncellenemedi.", variant: "error" });
      return;
    }
    await loadRequests();
    await showAlert({ message: `Talep durumu "${newStatus}" olarak kaydedildi.`, variant: "success" });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Bekliyor": return <Clock className="h-4 w-4 text-amber-500 shrink-0" />;
      case "İşlemde": return <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />;
      case "Çözüldü": return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case "Reddedildi": return <XCircle className="h-4 w-4 text-rose-500 shrink-0" />;
      default: return null;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Bekliyor": return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40";
      case "İşlemde": return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-300/40 dark:border-blue-700/40";
      case "Çözüldü": return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40";
      case "Reddedildi": return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-300/40 dark:border-rose-700/40";
      default: return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700";
    }
  };

  const filtered = requests.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Hepsi" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto pb-16 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Arıza &amp; Talepler</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sakinlerden gelen bildirimleri takip edin, çözüm veya red notu ekleyin.</p>
        {loadErr && <p className="text-sm text-rose-600 dark:text-rose-400 mt-2 font-semibold">{loadErr}</p>}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4 items-center transition-colors">
        <div className="relative md:col-span-2">
          <input 
            type="text" 
            placeholder="Talep adı veya ID ara..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#090e1b] py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
          />
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#090e1b] py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900 dark:text-white transition-all cursor-pointer"
          >
            <option value="Hepsi" className="bg-white dark:bg-slate-900">Tüm Talepler</option>
            <option value="Bekliyor" className="bg-white dark:bg-slate-900">Bekleyenler</option>
            <option value="İşlemde" className="bg-white dark:bg-slate-900">İşlemdekiler</option>
            <option value="Çözüldü" className="bg-white dark:bg-slate-900">Çözülenler</option>
            <option value="Reddedildi" className="bg-white dark:bg-slate-900">Reddedilenler</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center transition-colors shadow-xs">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-900/30">
              <Wrench className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Filtrelere Uygun Talep Bulunamadı</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Arama terimini değiştirerek veya filtreyi sıfırlayarak tekrar deneyin.</p>
          </div>
        ) : (
          filtered.map((req) => (
            <div 
              key={req.id} 
              className="bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
            >
              {/* Resolution/Rejection Note */}
              {req.status === "Çözüldü" && req.resolutionNote && (
                <div className="px-6 py-3.5 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/40">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    Çözüm Notu
                  </p>
                  <p className="text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed">{req.resolutionNote}</p>
                  {req.resolutionImageUrl && (
                    <img src={req.resolutionImageUrl} alt="Çözüm görseli" className="mt-2.5 max-h-36 rounded-xl object-cover border border-emerald-200 dark:border-emerald-800" />
                  )}
                </div>
              )}
              {req.status === "Reddedildi" && req.rejectedNote && (
                <div className="px-6 py-3.5 bg-rose-50 dark:bg-rose-950/30 border-b border-rose-100 dark:border-rose-900/40">
                  <p className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                    Red Nedeni
                  </p>
                  <p className="text-sm text-rose-950 dark:text-rose-200 leading-relaxed">{req.rejectedNote}</p>
                  {req.rejectedImageUrl && (
                    <img src={req.rejectedImageUrl} alt="Red görseli" className="mt-2.5 max-h-36 rounded-xl object-cover border border-rose-200 dark:border-rose-800" />
                  )}
                </div>
              )}

              <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 p-3.5 rounded-2xl shrink-0 border border-blue-100 dark:border-blue-900/30 h-fit">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">{req.id.slice(0, 8)}…</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                        {req.category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{req.date}</span>
                    </div>
                    <h4 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1.5">{req.title}</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 leading-relaxed max-w-xl">{req.description}</p>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex flex-col justify-center gap-2.5 md:items-end shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800/80">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(req.status)}`}>
                    {getStatusIcon(req.status)}
                    <span>{req.status}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {req.status !== "Bekliyor" && (
                      <button 
                        type="button"
                        onClick={() => void updateStatus(req.id, "Bekliyor")}
                        className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 dark:border-amber-700/60 dark:text-amber-300 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 transition-colors cursor-pointer"
                      >
                        Beklet
                      </button>
                    )}
                    {req.status !== "İşlemde" && (
                      <button 
                        type="button"
                        onClick={() => void updateStatus(req.id, "İşlemde")}
                        className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-blue-300 text-blue-800 bg-blue-50 hover:bg-blue-100 dark:border-blue-700/60 dark:text-blue-300 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                      >
                        İşleme Al
                      </button>
                    )}
                    {req.status !== "Çözüldü" && (
                      <button 
                        type="button"
                        onClick={() => openModal(req.id, "Çözüldü")}
                        className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-700/60 dark:text-emerald-300 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
                      >
                        Çözüldü
                      </button>
                    )}
                    {req.status !== "Reddedildi" && (
                      <button 
                        type="button"
                        onClick={() => openModal(req.id, "Reddedildi")}
                        className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-rose-300 text-rose-800 bg-rose-50 hover:bg-rose-100 dark:border-rose-700/60 dark:text-rose-300 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                      >
                        Reddet
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolution/Rejection Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-4 text-slate-900 dark:text-slate-100 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {modalType === "Çözüldü" ? "Talebi Çöz" : "Talebi Reddet"}
              </h3>
              <button 
                type="button" 
                onClick={() => setModalOpen(false)} 
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                {modalType === "Çözüldü" ? "Çözüm Açıklaması" : "Red Nedeni"}
              </label>
              <textarea
                rows={3}
                value={modalNote}
                onChange={(e) => setModalNote(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#090e1b] py-3 px-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none resize-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm transition-all"
                placeholder={modalType === "Çözüldü" ? "Nasıl çözüldüğünü açıklayın..." : "Red nedenini yazın..."}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Görsel (isteğe bağlı)
              </label>
              {modalImageUrl ? (
                <div className="relative inline-block w-full">
                  <img src={modalImageUrl} alt="Önizleme" className="w-full max-h-40 object-cover rounded-2xl border border-slate-300 dark:border-slate-700" />
                  <button
                    type="button"
                    onClick={() => { setModalImageUrl(null); if (modalFileRef.current) modalFileRef.current.value = ""; }}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors shadow-md cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => modalFileRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-[#090e1b]/50"
                >
                  {modalUploading ? (
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Yükleniyor...</p>
                  ) : (
                    <>
                      <ImageIcon className="h-6 w-6 mx-auto mb-1 text-slate-400 dark:text-slate-500" />
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Görsel yüklemek için tıklayın (Max 2MB)</p>
                    </>
                  )}
                </div>
              )}
              <input ref={modalFileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleModalImageUpload} className="hidden" />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={submitModal}
                disabled={modalSubmitting}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold text-white shadow-md transition-all cursor-pointer disabled:opacity-50 ${
                  modalType === "Çözüldü"
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                    : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                }`}
              >
                {modalSubmitting ? "Kaydediliyor..." : modalType === "Çözüldü" ? "Çözüldü Olarak Kaydet" : "Reddet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
