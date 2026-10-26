"use client";

import * as React from "react";
import Link from "next/link";
import { Wrench, PlusCircle, Clock, CheckCircle2, AlertCircle, XCircle, X, ArrowLeft, Send, Camera, ImageIcon } from "lucide-react";
import { useAlert } from "@/components/ModalProvider";

interface RequestItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  date: string;
  status: "Bekliyor" | "İşlemde" | "Çözüldü" | "Reddedildi";
  resolutionNote?: string | null;
  resolutionImageUrl?: string | null;
  rejectedNote?: string | null;
  rejectedImageUrl?: string | null;
}

export default function ResidentRequestsPage() {
  const showAlert = useAlert();
  const [requests, setRequests] = React.useState<RequestItem[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("Arıza");
  const [description, setDescription] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [loadErr, setLoadErr] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function reload() {
    setLoadErr("");
    const res = await fetch("/api/requests", { credentials: "include" });
    const j: unknown = await res.json().catch(() => null);
    if (!res.ok || !Array.isArray(j)) {
      setLoadErr("Talepler yüklenemedi.");
      setRequests([]);
      return;
    }
    setRequests(j as RequestItem[]);
  }

  React.useEffect(() => {
    void reload();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      void showAlert({ message: "Fotoğraf en fazla 8MB olabilir.", variant: "error" });
      return;
    }
    setUploadingImage(true);
    try {
      // Otomatik olarak görseli optimize et (maks 1200px, hafif JPEG)
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.src = ev.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            setImageUrl(canvas.toDataURL("image/jpeg", 0.8));
          } else {
            setImageUrl(img.src);
          }
          setUploadingImage(false);
        };
        img.onerror = () => {
          setImageUrl(ev.target?.result as string);
          setUploadingImage(false);
        };
      };
      reader.onerror = () => {
        setUploadingImage(false);
        void showAlert({ message: "Görsel okunamadı.", variant: "error" });
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          description,
          imageUrl: imageUrl || null,
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string; success?: boolean } | null;
      if (!res.ok) {
        await showAlert({
          title: "Hata",
          message: data?.error || "Talep gönderilemedi. Lütfen bilgilerinizi kontrol edin.",
          variant: "error",
        });
        return;
      }

      setTitle("");
      setDescription("");
      setImageUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowForm(false);
      await reload();
      await showAlert({ message: "Talebiniz yönetime başarıyla iletildi.", variant: "success" });
    } catch {
      await showAlert({ title: "Hata", message: "Sunucuya bağlanırken bir sorun oluştu.", variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Bekliyor":
        return <Clock className="h-4 w-4 text-amber-500 shrink-0" />;
      case "İşlemde":
        return <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />;
      case "Çözüldü":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case "Reddedildi":
        return <XCircle className="h-4 w-4 text-rose-500 shrink-0" />;
      default:
        return null;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Bekliyor":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40";
      case "İşlemde":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-300/40 dark:border-blue-700/40";
      case "Çözüldü":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40";
      case "Reddedildi":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-300/40 dark:border-rose-700/40";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700";
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1424] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition shadow-xs"
            title="Geri Dön"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Taleplerim &amp; Bildirimler
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Siteye ait arıza, bakım veya genel önerilerinizi fotoğraflı olarak buradan iletin.
            </p>
          </div>
        </div>

        {!showForm && (
          <button 
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md shadow-blue-600/20 transition-all cursor-pointer shrink-0"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            <span>Yeni Talep Aç</span>
          </button>
        )}
      </div>

      {loadErr && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm font-semibold text-amber-900 dark:text-amber-200">
          {loadErr}
        </div>
      )}

      {/* New Request Form Card */}
      {showForm && (
        <div className="bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm relative animate-in fade-in slide-in-from-top-4 duration-300 transition-colors">
          <button 
            type="button"
            onClick={() => {
              setShowForm(false);
              setImageUrl(null);
            }}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Yeni Arıza / Destek Talebi</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Arızanın fotoğrafını ekleyerek teknik ekibe doğrudan iletin.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Talep Başlığı
                </label>
                <input 
                  type="text" 
                  required 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#090e1b] py-3 px-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-sm transition-all"
                  placeholder="Örn: Koridor Lambası Arızası" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Kategori
                </label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#090e1b] py-3 px-4 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-sm transition-all cursor-pointer"
                >
                  <option value="Arıza" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🛠️ Teknik / Arıza</option>
                  <option value="Temizlik" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🧹 Temizlik</option>
                  <option value="Güvenlik" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🔒 Güvenlik</option>
                  <option value="Diğer" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">📝 Diğer / Öneri</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Açıklama
              </label>
              <textarea 
                required 
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#090e1b] py-3 px-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#070b14] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-sm resize-none transition-all" 
                placeholder="Lütfen arızanın yerini ve detaylarını net bir şekilde yazın..."
              />
            </div>

            {/* Arıza Fotoğrafı Yükleme (Doğrudan Cihazdan Karşıdan Yükleme) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Arıza / Durum Fotoğrafı (İsteğe Bağlı)
              </label>

              {imageUrl ? (
                <div className="relative inline-block w-full sm:w-auto">
                  <img
                    src={imageUrl}
                    alt="Arıza fotoğrafı önizleme"
                    className="h-44 w-full sm:w-72 object-cover rounded-2xl border border-slate-300 dark:border-slate-700 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition shadow-md cursor-pointer"
                    title="Fotoğrafı Kaldır"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-[#090e1b]/50 group"
                >
                  {uploadingImage ? (
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Görsel yükleniyor...</p>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                        <Camera className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Fotoğraf Çek veya Galeriden Seç
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        JPG, PNG, WebP — En fazla 3MB
                      </p>
                    </div>
                  )}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setImageUrl(null);
                }}
                className="px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? "Gönderiliyor..." : "Talebi Gönder"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ticket List Section */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">Taleplerinizin Durumu</h2>

        {requests.length === 0 ? (
          <div className="bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-10 sm:p-14 text-center transition-colors shadow-xs">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-100 dark:border-blue-900/30">
              <Wrench className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Henüz Talep Bulunmuyor</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto">
              Site veya dairenizle ilgili herhangi bir arıza ya da öneriniz varsa yukarıdaki butonla fotoğraflı olarak talep oluşturabilirsiniz.
            </p>
          </div>
        ) : (
          requests.map((req) => (
            <div 
              key={req.id} 
              className="bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:border-blue-300 dark:hover:border-blue-700/60 transition-all duration-200"
            >
              {/* Resolution Note */}
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

              {/* Rejection Note */}
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

              <div className="p-6 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 p-3 rounded-2xl h-fit border border-blue-100 dark:border-blue-900/30 shrink-0">
                    <Wrench className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400 font-semibold">{req.id}</span>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        {req.category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{req.date}</span>
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mt-1.5">{req.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 leading-relaxed">{req.description}</p>

                    {/* Arıza Fotoğrafı */}
                    {req.imageUrl && (
                      <div className="mt-3.5">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <ImageIcon className="h-3.5 w-3.5 text-blue-600 dark:text-sky-400" />
                          Arıza Görseli:
                        </p>
                        <img
                          src={req.imageUrl}
                          alt="Arıza fotoğrafı"
                          className="max-h-48 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer hover:opacity-95 transition"
                          onClick={() => window.open(req.imageUrl!, "_blank")}
                          title="Büyük boyutta açmak için tıklayın"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:self-center shrink-0">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusStyles(req.status)}`}>
                    {getStatusIcon(req.status)}
                    <span>{req.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
