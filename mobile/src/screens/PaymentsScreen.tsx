import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Clock, ArrowUpRight, Download, Wallet, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../lib/security';
import { PaymentItem } from '../types';

export const PaymentsScreen: React.FC = () => {
  const { payments, setSelectedPayment, setIsPaymentModalOpen, site, user } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PAID'>('ALL');

  if (!user) return null;

  const pendingPayments = payments.filter((p) => p.status === 'Bekliyor');
  const totalPending = pendingPayments.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredPayments = payments.filter((p) => {
    if (filter === 'PENDING') return p.status === 'Bekliyor';
    if (filter === 'PAID') return p.status === 'Tamamlandı';
    return true;
  });

  const handlePayClick = (p: PaymentItem) => {
    setSelectedPayment(p);
    setIsPaymentModalOpen(true);
  };

  const handleDownloadReceipt = (p: PaymentItem) => {
    alert(`📄 ${p.period} dönemi için tahsilat makbuzu cihazınıza indirildi.`);
  };

  return (
    <div className="flex-1 overflow-y-auto smooth-scroll px-4 pt-2.5 pb-20 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black font-display text-slate-900 tracking-tight">
            Aidat & Ödemeler
          </h1>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {site?.name || 'Site Yönetimi'} • Daire {user.apartmentNo || '-'}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full glass-card flex items-center justify-center text-indigo-600 shadow-2xs">
          <Wallet className="w-4 h-4" />
        </div>
      </div>

      {/* Kompakt Modern Bakiye Kartı (Ekranı Boğmayan FinTech Kart) */}
      <div className="glass-card rounded-2xl p-4 border border-white/90 shadow-sm relative overflow-hidden space-y-3">
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
            Toplam Bekleyen Borç
          </span>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
              pendingPayments.length > 0
                ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
            }`}
          >
            {pendingPayments.length > 0 ? (
              <>
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{pendingPayments.length} Bekleyen</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Borç Yok</span>
              </>
            )}
          </span>
        </div>

        <div className="flex items-baseline justify-between relative z-10">
          <div className="text-3xl font-black font-display tracking-tight text-slate-900 leading-none">
            {formatCurrency(totalPending)}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {pendingPayments.length > 0 ? 'Ödenmemiş aidat' : 'Tüm aidatlar güncel'}
          </span>
        </div>

        {pendingPayments.length > 0 && (
          <div className="pt-0.5 relative z-10">
            <button
              onClick={() => handlePayClick(pendingPayments[0])}
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs py-2.5 px-3.5 rounded-xl shadow-md shadow-indigo-600/20 active-bounce transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Hemen Öde (FAST / Havale)</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modern Cam Filtreleme Hapları */}
      <div className="flex items-center space-x-1 glass-card p-1 rounded-xl border border-slate-200/70 text-xs">
        <button
          onClick={() => setFilter('ALL')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Tümü ({payments.length})
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
            filter === 'PENDING'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Bekleyen ({pendingPayments.length})
        </button>
        <button
          onClick={() => setFilter('PAID')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
            filter === 'PAID'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Ödenenler ({payments.length - pendingPayments.length})
        </button>
      </div>

      {/* Payments List */}
      <div className="space-y-2">
        {filteredPayments.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center space-y-1.5 border border-slate-200/70">
            <CreditCard className="w-7 h-7 text-slate-300 mx-auto" />
            <h4 className="font-bold text-xs text-slate-800">Kayıtlı aidat veya borç bulunmamaktadır</h4>
            <p className="text-[11px] text-slate-400">Yönetim tarafından yeni bir aidat tahakkuk ettirildiğinde burada görünecektir.</p>
          </div>
        ) : (
          filteredPayments.map((p) => {
            const isPaid = p.status === 'Tamamlandı';

            return (
              <div
                key={p.id}
                className="glass-card rounded-xl p-3 border border-slate-200/70 shadow-2xs flex items-center justify-between hover:border-indigo-200 transition-all active-bounce"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isPaid
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}
                  >
                    {isPaid ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Clock className="w-4.5 h-4.5" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate leading-snug">{p.period}</h4>
                    <div className="flex items-center space-x-1.5 text-[10.5px] text-slate-400 mt-0.5">
                      <span>{p.date}</span>
                      <span>•</span>
                      <span className={isPaid ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2 space-y-1">
                  <span className="font-black font-display text-sm text-slate-900 block">
                    {formatCurrency(p.amount)}
                  </span>
                  {isPaid ? (
                    <button
                      onClick={() => handleDownloadReceipt(p)}
                      className="text-[10.5px] text-indigo-600 hover:text-indigo-700 font-bold inline-flex items-center space-x-0.5 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Makbuz</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePayClick(p)}
                      className="text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1 rounded-lg shadow-xs active-bounce cursor-pointer"
                    >
                      Öde
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
