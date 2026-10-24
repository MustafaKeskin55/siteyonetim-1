import React from 'react';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Wallet,
  Wrench,
  Megaphone,
  Users,
  Building,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  Vote,
  Crown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SiteLogo } from '../components/SiteLogo';
import { formatCurrency } from '../lib/security';

export const HomeScreen: React.FC = () => {
  const {
    user,
    site,
    payments,
    requests,
    announcements,
    setActiveTab,
    setIsSiteSelectorOpen,
    setIsNotifSheetOpen,
    setIsPaymentModalOpen,
    setSelectedPayment,
    setIsNewRequestOpen,
    setIsPollModalOpen,
    unreadNotifsCount,
    isPro,
    properties,
  } = useApp();

  if (!user) return null;

  // Aktif dönem aidatı veya ilk bekleyen borç
  const currentDue = payments.find((p) => p.status === 'Bekliyor') || payments[0];
  const pendingCount = payments.filter((p) => p.status === 'Bekliyor').length;
  const activeRequestsCount = requests.filter((r) => r.status === 'OPEN' || r.status === 'IN_PROGRESS').length;

  const handleOpenDueDetails = () => {
    if (currentDue) {
      setSelectedPayment(currentDue);
      setIsPaymentModalOpen(true);
    } else {
      setActiveTab('payments');
    }
  };

  const quickActions = [
    {
      id: 'aidatlar',
      label: 'Aidatlar',
      icon: Wallet,
      gradient: 'from-indigo-500 to-violet-600',
      action: () => setActiveTab('payments'),
    },
    {
      id: 'talepler',
      label: 'Yeni Talep',
      icon: Plus,
      gradient: 'from-amber-500 to-orange-600',
      action: () => setIsNewRequestOpen(true),
    },
    {
      id: 'duyurular',
      label: 'Duyurular',
      icon: Megaphone,
      gradient: 'from-purple-500 to-fuchsia-600',
      action: () => {
        const el = document.getElementById('siteden-haberler');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'komsular',
      label: 'Komşular',
      icon: Users,
      gradient: 'from-emerald-500 to-teal-600',
      action: () => setActiveTab('community'),
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto smooth-scroll px-4 pt-2.5 pb-24 space-y-3.5">
      {/* Top Header Bar (Logo + Glass Switcher + Bell) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SiteLogo size="sm" showText={false} />
          {/* Site & Apartment Switcher Glass Pill */}
          <button
            onClick={() => setIsSiteSelectorOpen(true)}
            className="glass-pill px-3 py-1.5 rounded-full flex items-center space-x-1.5 hover:bg-white/95 transition-all active-bounce cursor-pointer shadow-2xs border border-slate-200/80"
          >
            {isPro ? (
              <span className="text-[9px] font-black bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                <Sparkles className="w-2.5 h-2.5" />
                PRO
              </span>
            ) : (
              <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            )}
            <span className="truncate max-w-[120px] text-[11.5px] font-bold text-slate-800 leading-none">
              {site?.name || 'Site Yönetimi'}
            </span>
            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-md leading-none">
              D.{user.apartmentNo || '-'}
            </span>
            {properties && properties.length > 1 && (
              <span className="text-[9px] font-black bg-amber-100 text-amber-900 px-1 py-0.2 rounded-sm leading-none">
                +{properties.length - 1}
              </span>
            )}
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>
        </div>

        {/* Bildirimler Butonu */}
        <button
          onClick={() => setIsNotifSheetOpen(true)}
          className="w-9 h-9 rounded-full glass-card flex items-center justify-center relative hover:bg-white transition-all active-bounce cursor-pointer shadow-2xs border border-slate-200/80"
          aria-label="Bildirimler"
        >
          <Bell className="w-4.5 h-4.5 text-slate-700" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>

      {/* Modern Greeting with Status Pill */}
      <div className="flex items-center justify-between pt-0.5">
        <div>
          <h1 className="text-lg font-black font-display text-slate-900 tracking-tight">
            Merhaba, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            {user.block ? `${user.block} Blok • ` : ''}Daire {user.apartmentNo || '-'}
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 px-2.5 py-1 rounded-full text-[10.5px] font-bold shadow-2xs">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>Her şey yolunda</span>
        </div>
      </div>

      {/* Kompakt Modern Aidat Kartı (Büyük Hantal Blok Yerine Zarif Kart) */}
      <div className="glass-card rounded-2xl p-3.5 border border-white/90 shadow-sm relative overflow-hidden space-y-2.5">
        {/* Yumuşak iç ışık efekti */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-violet-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Üst Satır: Dönem ve Durum Rozeti */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-1.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              {currentDue ? currentDue.period : 'Güncel Aidat'}
            </span>
          </div>

          {currentDue && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                currentDue.status === 'Tamamlandı'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/80'
              }`}
            >
              {currentDue.status === 'Tamamlandı' ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Ödendi</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                  <span>Bekliyor</span>
                </>
              )}
            </span>
          )}
        </div>

        {/* Orta & Alt Satır: Tutar ve Eylem Butonu */}
        <div className="flex items-center justify-between relative z-10 pt-0.5">
          <div>
            <div className="text-2xl font-black font-display tracking-tight text-slate-900 leading-none">
              {currentDue ? formatCurrency(currentDue.amount) : '0 ₺'}
            </div>
            <p className="text-[10.5px] text-slate-400 font-medium mt-1">
              {currentDue?.status === 'Tamamlandı'
                ? 'Bu döneme ait aidatınız tamamlandı.'
                : 'Son ödeme gününden önce ödeyebilirsiniz.'}
            </p>
          </div>

          {currentDue && currentDue.status === 'Bekliyor' ? (
            <button
              onClick={handleOpenDueDetails}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-indigo-600/20 flex items-center space-x-1.5 active-bounce cursor-pointer transition-all"
            >
              <span>Hemen Öde</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('payments')}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-xl border border-slate-200/80 flex items-center space-x-1 active-bounce cursor-pointer transition-all"
            >
              <span>Geçmiş</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* 3'lü Mikro-Metrik Hızlı Bakış Şeridi */}
      <div className="grid grid-cols-3 gap-2">
        {/* Metrik 1: Aidat Durumu */}
        <div
          onClick={() => setActiveTab('payments')}
          className="glass-card rounded-xl p-2.5 border border-white/80 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-indigo-200 transition-all active-bounce"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aidat</span>
            <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wallet className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5 flex items-center space-x-1">
            <span className={`w-1.5 h-1.5 rounded-full ${pendingCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span className="text-xs font-bold text-slate-800 truncate">
              {pendingCount > 0 ? `${pendingCount} Bekleyen` : 'Borç Yok'}
            </span>
          </div>
        </div>

        {/* Metrik 2: Taleplerim */}
        <div
          onClick={() => setActiveTab('requests')}
          className="glass-card rounded-xl p-2.5 border border-white/80 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-amber-200 transition-all active-bounce"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Talepler</span>
            <div className="w-5 h-5 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5 flex items-center space-x-1">
            <span className={`w-1.5 h-1.5 rounded-full ${activeRequestsCount > 0 ? 'bg-indigo-500' : 'bg-slate-300'}`} />
            <span className="text-xs font-bold text-slate-800 truncate">
              {activeRequestsCount > 0 ? `${activeRequestsCount} İşlemde` : 'Talep Yok'}
            </span>
          </div>
        </div>

        {/* Metrik 3: Komşuluk & Sohbet */}
        <div
          onClick={() => setActiveTab('community')}
          className="glass-card rounded-xl p-2.5 border border-white/80 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-emerald-200 transition-all active-bounce"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Komşular</span>
            <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-1.5 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 truncate">Canlı Sohbet</span>
          </div>
        </div>
      </div>

      {/* Dairesel Hızlı Eylemler (4 Şık Düğme) */}
      <div className="grid grid-cols-4 gap-2 pt-0.5">
        {quickActions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl glass-card hover:bg-white transition-all active-bounce cursor-pointer group border border-slate-200/60 shadow-2xs"
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${item.gradient} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10.5px] font-bold text-slate-700 mt-1.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Canlı Anket Bannerı (Varsa) */}
      <div
        onClick={() => setIsPollModalOpen(true)}
        className="glass-card rounded-2xl p-3 border border-indigo-100 shadow-2xs flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-all active-bounce bg-gradient-to-r from-indigo-50/40 via-purple-50/30 to-emerald-50/20"
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-indigo-600/30">
            <Vote className="w-4.5 h-4.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md">
                Canlı Oylama
              </span>
              <span className="text-[10.5px] text-slate-500 font-medium">Bina Kararı</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
              Asansör ve Bina Güvenlik Kamerası Yenilemesi
            </h4>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-indigo-600 shrink-0 ml-1.5" />
      </div>

      {/* Siteden Haberler & Duyurular (Kompakt Akış) */}
      <div id="siteden-haberler" className="space-y-2 pt-0.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Megaphone className="w-3.5 h-3.5 text-indigo-600" />
            <h2 className="text-xs font-black font-display uppercase tracking-wider text-slate-800">
              Siteden Haberler
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('community')}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-0.5 cursor-pointer"
          >
            <span>Tümü</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {announcements.length === 0 ? (
          <div className="glass-card rounded-2xl p-4 text-center space-y-1 border border-slate-200/70">
            <p className="text-xs font-semibold text-slate-700">Henüz yayınlanmış bir haber veya duyuru yok.</p>
            <p className="text-[11px] text-slate-400">Yönetim tarafından yeni bir duyuru yapıldığında burada listelenecektir.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                onClick={() => alert(`📢 ${ann.title}\n\n${ann.content}`)}
                className="w-full glass-card rounded-xl p-3 border border-slate-200/70 shadow-2xs flex items-center justify-between cursor-pointer hover:border-indigo-200 transition-all active-bounce"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                        {ann.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ann.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs mt-1 truncate leading-tight">{ann.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 leading-snug">{ann.content}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
