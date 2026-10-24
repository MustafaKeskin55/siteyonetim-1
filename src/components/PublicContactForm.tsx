"use client";

import { useState } from "react";

type Props = {
  defaultSource?: "iletisim" | "destek";
  headline?: string;
};

export function PublicContactForm({ defaultSource = "iletisim", headline = "Mesaj Gönderin" }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus("sending");
    try {
      const finalSubject = subject.trim() || `${defaultSource === "destek" ? "Teknik Destek Talebi" : "İletişim Başvurusu"} (${name.trim()})`;

      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          subject: finalSubject,
          body: message.trim(),
          source: defaultSource,
        }),
      });

      const j = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        setErrorMessage(j?.error || "Mesaj gönderilemedi. Lütfen alanları kontrol edin.");
        setStatus("err");
        return;
      }

      setStatus("ok");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch {
      setErrorMessage("Sunucuya ulaşılamadı. Lütfen internet bağlantınızı kontrol edin.");
      setStatus("err");
    }
  };

  if (status === "ok") {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-500/40 rounded-3xl p-8 text-center shadow-lg animate-in fade-in duration-200">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          ✓
        </div>
        <p className="text-emerald-900 dark:text-emerald-100 font-bold text-lg">Mesajınız Başarıyla İletildi!</p>
        <p className="text-emerald-700 dark:text-emerald-300 text-sm mt-2 leading-relaxed">
          Talebiniz destek ekibimiz tarafından incelenecek ve <strong>{email || "e-posta adresiniz"}</strong> üzerinden en kısa sürede yanıtlanacaktır.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
        >
          Yeni Mesaj Gönder
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0d1424] p-6 sm:p-8 rounded-3xl border-2 border-slate-300 dark:border-slate-800 shadow-xl ring-1 ring-slate-900/5 transition-colors">
      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">{headline}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Adınız Soyadınız <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Örn: Ahmet Yılmaz"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all shadow-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              E-Posta Adresi <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              placeholder="ahmet@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Telefon Numarası
            </label>
            <input
              type="tel"
              placeholder="0 (5XX) XXX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Konu Başlığı
          </label>
          <input
            type="text"
            placeholder={defaultSource === "destek" ? "Örn: Sakin kaydı onayı hakkında" : "Örn: Kurumsal fiyat teklifi"}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all shadow-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
            Mesajınız <span className="text-rose-500">*</span>
          </label>
          <textarea
            placeholder="Mesajınızı, sorunuzu veya destek talebinizi ayrıntılı olarak yazın…"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all resize-none shadow-xs"
          />
        </div>

        {status === "err" && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-300 dark:border-rose-500/40 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-semibold">
            {errorMessage || "Bir hata oluştu. Lütfen tekrar deneyin."}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer"
        >
          {status === "sending" ? "Gönderiliyor..." : "Mesajı İlet"}
        </button>
      </form>
    </div>
  );
}
