"use client";

import * as React from "react";
import Link from "next/link";
import { CreditCard, Download, Printer, CheckCircle2, ChevronRight, X, Sparkles, ArrowLeft } from "lucide-react";
import { useAlert } from "@/components/ModalProvider";
import { downloadReceiptPdf, printReceiptPdf } from "@/lib/receipt-pdf";

interface Payment {
  id: string;
  period: string;
  amount: number;
  date: string;
  status: string;
  type: string;
}

export default function ResidentPaymentsPage() {
  const showAlert = useAlert();
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null);
  const [loadErr, setLoadErr] = React.useState("");
  const [residentName, setResidentName] = React.useState("Sakin");
  const [apartmentMeta, setApartmentMeta] = React.useState("");

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw) as { name?: string; apartmentNo?: string | null };
        if (typeof u?.name === "string" && u.name.trim()) setResidentName(u.name.trim());
        const apt = typeof u.apartmentNo === "string" ? u.apartmentNo.trim() : "";
        setApartmentMeta(apt ? `Daire ${apt}` : "—");
      }
    } catch {
      /* ignore */
    }

    let cancelled = false;
    (async () => {
      setLoadErr("");
      const res = await fetch("/api/payments", { credentials: "include" });
      const j: unknown = await res.json().catch(() => null);
      if (!res.ok || !Array.isArray(j)) {
        if (!cancelled) {
          setLoadErr("Ödeme kayıtları yüklenemedi.");
          setPayments([]);
        }
        return;
      }
      if (!cancelled) setPayments(j as Payment[]);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPaid = payments.filter((p) => p.status === "Tamamlandı").reduce((a, p) => a + p.amount, 0);
  const debt = payments.filter((p) => p.status === "Bekliyor").reduce((a, p) => a + p.amount, 0);

  const handlePrint = async (payment: Payment) => {
    printReceiptPdf({
      paymentId: payment.id,
      residentName,
      apartmentNo: apartmentMeta,
      period: payment.period,
      type: payment.type,
      amount: payment.amount,
      date: payment.date,
      status: payment.status,
    });
  };

  const handleDownload = async (payment: Payment) => {
    downloadReceiptPdf({
      paymentId: payment.id,
      residentName,
      apartmentNo: apartmentMeta,
      period: payment.period,
      type: payment.type,
      amount: payment.amount,
      date: payment.date,
      status: payment.status,
    });
    await showAlert({ title: "İndirildi", message: "Dekont PDF olarak indirildi.", variant: "success" });
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto text-slate-900 dark:text-slate-100 transition-colors">
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
              Aidat &amp; Ödemeler
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Ödeme geçmişinizi takip edin ve dekontlarınızı indirin.
            </p>
          </div>
        </div>
      </div>

      {loadErr && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm font-semibold text-amber-900 dark:text-amber-200">
          {loadErr}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs transition-colors">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Toplam Ödenen</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {totalPaid.toLocaleString("tr-TR")} ₺
          </p>
        </div>
        <div className="bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs transition-colors">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">İşlem Adedi</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{payments.length} Adet</p>
        </div>
        <div className="bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Güncel Borç</p>
            <p
              className={`text-2xl font-black mt-1 ${debt > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
            >
              {debt.toLocaleString("tr-TR")} ₺
            </p>
          </div>
          <span
            className={`p-2.5 rounded-xl ${debt > 0 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300/40 dark:border-amber-700/40" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-300/40 dark:border-emerald-700/40"}`}
          >
            <CheckCircle2 className="h-5 w-5" />
          </span>
        </div>
      </div>

      {/* Payments Table/List */}
      <div className="bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Ödeme Geçmişi</h2>
        </div>

        {payments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 border border-blue-100 dark:border-blue-900/30">
              <CreditCard className="h-6 w-6" />
            </div>
            <p className="font-bold text-slate-800 dark:text-slate-200">Kayıtlı herhangi bir ödeme bulunamadı.</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Yönetim tarafından oluşturulmuş aidat veya ödemeler burada listelenir.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-[#090e1b] border-b border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">İşlem ID</th>
                  <th className="px-6 py-4">Ödeme Dönemi</th>
                  <th className="px-6 py-4">Ödeme Türü</th>
                  <th className="px-6 py-4">Tarih</th>
                  <th className="px-6 py-4 text-right">Tutar</th>
                  <th className="px-6 py-4 text-center">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">{p.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">{p.period}</span>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] rounded-full font-bold ${
                            p.status === "Bekliyor"
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40"
                              : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{p.type}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{p.date}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                      {p.amount.toLocaleString("tr-TR")} ₺
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        type="button"
                        onClick={() => setSelectedPayment(p)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Dekont Gör <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receipt Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0d1424] border border-slate-200/80 dark:border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-7 relative text-slate-900 dark:text-slate-100 transition-colors">
            <button 
              type="button"
              onClick={() => setSelectedPayment(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Kapat"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center border-b border-slate-100 dark:border-slate-800/80 pb-6 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 border border-blue-100 dark:border-blue-900/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">Ödeme Dekontu</h3>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">{selectedPayment.id}</p>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Üye Adı Soyadı</span>
                <span className="font-semibold text-slate-900 dark:text-white">{residentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Daire Bilgisi</span>
                <span className="font-semibold text-slate-900 dark:text-white">{apartmentMeta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Ödeme Dönemi</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedPayment.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Ödeme Türü</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedPayment.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Ödeme Tarihi</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedPayment.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Durum</span>
                <span className={`font-bold ${selectedPayment.status === "Bekliyor" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                  {selectedPayment.status}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 text-base">
                <span className="font-bold text-slate-900 dark:text-white">Toplam Tutar</span>
                <span className="font-black text-blue-600 dark:text-blue-400">{selectedPayment.amount.toLocaleString("tr-TR")} ₺</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-7">
              <button 
                type="button"
                onClick={() => handlePrint(selectedPayment)}
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-sm"
              >
                <Printer className="h-4 w-4" /> Yazdır
              </button>
              <button 
                type="button"
                onClick={() => handleDownload(selectedPayment)}
                className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer text-sm"
              >
                <Download className="h-4 w-4" /> İndir (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
