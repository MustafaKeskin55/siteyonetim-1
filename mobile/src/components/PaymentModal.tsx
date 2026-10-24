import React, { useState } from 'react';
import {
  Building2,
  Copy,
  Check,
  X,
  Upload,
  AlertCircle,
  Clock,
  ShieldCheck,
  FileText,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { formatCurrency } from '../lib/security';

export const PaymentModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    selectedPayment,
    refreshPayments,
    site,
    user,
    siteSettings,
  } = useApp();

  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isPaymentModalOpen || !selectedPayment) return null;

  // Gerçek veritabanındaki site banka hesap bilgileri
  const bankInfo = {
    bankName: siteSettings.bankName || 'Site Yönetimi Banka Hesabı',
    accountHolder: siteSettings.managerName || `${site?.name || 'Site'} Yöneticiliği`,
    iban: siteSettings.iban || 'Yönetici henüz IBAN girmemiş',
    transferDescription: `${user?.block ? user.block + ' ' : ''}Daire ${user?.apartmentNo || '-'} ${user?.name || ''} - ${selectedPayment.period}`,
  };

  const handleCopyIban = () => {
    navigator.clipboard?.writeText(bankInfo.iban.replace(/\s+/g, ''));
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleCopyDesc = () => {
    navigator.clipboard?.writeText(bankInfo.transferDescription);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  const handleNotifyPayment = async () => {
    setIsSubmitting(true);
    // Havale bildirimi ve yönetici onay sürecini simüle et
    setTimeout(async () => {
      await api.payDue(selectedPayment.id);
      await refreshPayments();
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsPaymentModalOpen(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs animate-fade-in select-none p-0 sm:p-4"
      onClick={() => setIsPaymentModalOpen(false)}
    >
      <div
        className="bg-white rounded-t-[28px] sm:rounded-3xl w-full max-w-sm max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100/90 p-5 pb-7 sm:pb-5 animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* WhatsApp Çekmece Tutamağı */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3.5 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#008069] flex items-center justify-center">
              <Building2 className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111b21]">Banka Havalesi / FAST</h3>
              <p className="text-[11px] text-[#667781]">Güvenli aidat ödeme bilgileri</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPaymentModalOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-[#d9fdd3] text-[#008069] rounded-full flex items-center justify-center mx-auto shadow-xs animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="font-bold text-base text-[#111b21]">Ödeme Bildirimi Alındı</h4>
            <p className="text-xs text-[#667781] max-w-xs mx-auto leading-relaxed">
              Havale / FAST bildiriminiz site yöneticisine başarıyla iletildi. Hesap kontrol edildikten sonra aidatınız onaylanacaktır.
            </p>
          </div>
        ) : (
          <div className="py-3.5 space-y-3.5">
            {/* Amount Banner - WhatsApp Yeşil Kapsülü */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#d9fdd3]/80 to-emerald-50 border border-[#d1f4cb] flex items-center justify-between shadow-2xs">
              <div>
                <p className="text-[11px] font-semibold text-[#008069]">{selectedPayment.period}</p>
                <h4 className="font-extrabold text-2xl text-[#111b21] mt-0.5 tracking-tight">
                  {formatCurrency(selectedPayment.amount)}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-white bg-[#008069] px-2.5 py-1 rounded-md shadow-2xs">
                  FAST / Havale
                </span>
                <p className="text-[10.5px] text-[#667781] mt-1 font-medium">Son Gün: {selectedPayment.dueDate || '30 Eylül'}</p>
              </div>
            </div>

            {/* Bank details card */}
            <div className="bg-[#f0f2f5]/80 rounded-2xl p-3.5 border border-slate-200/80 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-[#667781]">Banka:</span>
                <span className="font-bold text-[#111b21]">{bankInfo.bankName}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-[#667781]">Alıcı Adı:</span>
                <span className="font-bold text-[#111b21]">{bankInfo.accountHolder}</span>
              </div>

              {/* IBAN Copy Box */}
              <div className="space-y-1">
                <span className="text-[#667781] text-[11px] font-medium">Site Yönetimi IBAN:</span>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-mono font-bold text-[#111b21] tracking-tight text-xs">
                    {bankInfo.iban}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyIban}
                    className={`ml-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition-all active:scale-95 ${
                      copiedIban
                        ? 'bg-[#00a884] text-white shadow-2xs'
                        : 'bg-emerald-50 text-[#008069] hover:bg-emerald-100'
                    }`}
                  >
                    {copiedIban ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIban ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
              </div>

              {/* Description Copy Box */}
              <div className="space-y-1">
                <span className="text-[#667781] text-[11px] font-medium">Havale Açıklaması:</span>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="font-medium text-slate-800 text-[11px] truncate">
                    {bankInfo.transferDescription}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyDesc}
                    className={`ml-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition-all active:scale-95 shrink-0 ${
                      copiedDesc
                        ? 'bg-[#00a884] text-white shadow-2xs'
                        : 'bg-emerald-50 text-[#008069] hover:bg-emerald-100'
                    }`}
                  >
                    {copiedDesc ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDesc ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Receipt upload / confirmation */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Dekont veya İşlem Belgesi (Opsiyonel)
              </label>
              <label
                className={`p-3 border-2 border-dashed rounded-2xl flex items-center justify-center space-x-2 text-xs cursor-pointer transition-colors ${
                  receiptFile
                    ? 'border-[#00a884] bg-emerald-50/70 text-[#008069] font-medium'
                    : 'border-slate-300 hover:border-[#00a884]/60 text-slate-600 bg-[#f0f2f5]/40'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const sz =
                        f.size >= 1024 * 1024
                          ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
                          : `${(f.size / 1024).toFixed(0)} KB`;
                      setReceiptFile(`${f.name} (${sz})`);
                    }
                  }}
                  className="hidden"
                />
                {receiptFile ? (
                  <>
                    <Check className="w-4 h-4 text-[#00a884]" />
                    <span className="truncate">{receiptFile} seçildi</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-[#008069]" />
                    <span>Cihazdan Dekont Fotoğrafı / PDF Seç</span>
                  </>
                )}
              </label>
            </div>

            {/* Note */}
            <div className="flex items-start space-x-2 p-2.5 bg-amber-50/80 rounded-xl text-[11px] text-amber-900 border border-amber-200/60 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Bankanızdan transferi gerçekleştirdikten sonra aşağıdaki butona dokunarak yöneticiye bildiriniz.
              </span>
            </div>

            {/* Submit Notification */}
            <button
              type="button"
              onClick={handleNotifyPayment}
              disabled={isSubmitting}
              className="w-full py-3 bg-[#00a884] hover:bg-[#008f6f] active:bg-[#007a5e] text-white font-semibold rounded-2xl transition-all shadow-sm active:scale-[0.99] text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Bildirim İletiliyor...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Havale / FAST Yaptım, Bildir</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
