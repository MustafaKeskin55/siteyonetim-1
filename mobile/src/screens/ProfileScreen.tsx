import React, { useState, useEffect } from 'react';
import {
  Building2,
  Phone,
  Copy,
  Check,
  LogOut,
  ChevronRight,
  RefreshCw,
  Wallet,
  Wrench,
  Bell,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Car,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { maskPhoneNumber } from '../lib/security';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    site,
    siteSettings,
    payments,
    requests,
    unreadNotifsCount,
    setActiveTab,
    setIsSiteSelectorOpen,
    setIsNotifSheetOpen,
    reloadAllData,
    setUser,
    setIsCustomModalOpen,
    updateVehiclePlate,
  } = useApp();

  const [isCopied, setIsCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isPlateModalOpen, setIsPlateModalOpen] = useState(false);
  const [plateInput, setPlateInput] = useState(user?.vehiclePlate || '');

  // Modallar açıkken alt navigasyon çubuğunu gizle
  useEffect(() => {
    setIsCustomModalOpen(isLogoutModalOpen || isPlateModalOpen);
    return () => {
      setIsCustomModalOpen(false);
    };
  }, [isLogoutModalOpen, isPlateModalOpen, setIsCustomModalOpen]);

  if (!user) return null;

  // Gerçek istatistikler
  const pendingPayments = payments.filter((p) => p.status === 'Bekliyor');
  const pendingCount = pendingPayments.length;
  const activeRequestsCount = requests.filter(
    (r) => r.status === 'OPEN' || r.status === 'IN_PROGRESS'
  ).length;

  const handleCopyIban = () => {
    if (!siteSettings?.iban) return;
    navigator.clipboard.writeText(siteSettings.iban.replace(/\s+/g, ''));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSyncData = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await reloadAllData();
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 2000);
    } catch {
      // Hata durumunda sessizce tamamla
    } finally {
      setIsRefreshing(false);
    }
  };

  const initials = user.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'SK';

  return (
    <div className="flex-1 overflow-y-auto smooth-scroll px-4 pt-2 pb-24 space-y-3.5 bg-transparent">
      {/* 1. Üst Başlık & Senkronizasyon Butonu */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">
            Hesap ve Tercihler
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daire sakini profili ve site bağlantısı
          </p>
        </div>

        {/* Gerçek Veri Yenileme Butonu */}
        <button
          type="button"
          onClick={handleSyncData}
          disabled={isRefreshing}
          aria-label="Verileri Güncelle"
          className="glass-pill px-3 py-1.5 rounded-full flex items-center space-x-1.5 text-slate-600 hover:text-indigo-600 hover:bg-white text-xs font-semibold shadow-2xs border border-slate-200/80 active:scale-95 transition-all cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`}
          />
          <span className="hidden sm:inline">
            {refreshSuccess ? 'Güncellendi' : 'Yenile'}
          </span>
        </button>
      </div>

      {/* 2. Kullanıcı Kimlik Kartı */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex items-center space-x-3.5 relative z-10">
          {/* Avatar (Kusursuz kare squircle boyutlandırma) */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white font-display font-bold text-base flex items-center justify-center shadow-md shadow-indigo-500/20 select-none">
              {initials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          {/* İsim ve Rol */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-bold text-base text-slate-900 truncate">
                {user.name}
              </h2>
              {user.role === 'ADMIN' ? (
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Yönetici</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 shrink-0">
                  <UserCheck className="w-3 h-3" />
                  <span>Sakin</span>
                </span>
              )}
            </div>

            {user.emailOrPhone ? (
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                {maskPhoneNumber(user.emailOrPhone)}
              </p>
            ) : null}

            <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
              {site?.name || 'Site Yönetimi'}
              {user.block ? ` • ${user.block} Blok` : ''}
              {user.apartmentNo ? ` • Daire ${user.apartmentNo}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Daire Durum Özeti (Gerçek ve Tıklanabilir 3 Buton) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Aidat Özeti */}
        <button
          type="button"
          onClick={() => setActiveTab('payments')}
          className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs hover:border-indigo-300 active:scale-[0.97] transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
            {pendingCount === 0 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            )}
          </div>
          <div className="font-display font-bold text-xs text-slate-900 leading-tight">
            {pendingCount === 0 ? 'Borç Yok' : `${pendingCount} Borç`}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 group-hover:text-indigo-600 transition-colors">
            Aidatları Gör →
          </p>
        </button>

        {/* Taleplerim Özeti */}
        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs hover:border-amber-300 active:scale-[0.97] transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 px-1.5 py-0.2 bg-amber-50 rounded-full">
              {activeRequestsCount}
            </span>
          </div>
          <div className="font-display font-bold text-xs text-slate-900 leading-tight">
            {activeRequestsCount === 0 ? 'Talep Yok' : `${activeRequestsCount} Aktif`}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 group-hover:text-amber-600 transition-colors">
            Talepleri Aç →
          </p>
        </button>

        {/* Bildirimler */}
        <button
          type="button"
          onClick={() => setIsNotifSheetOpen(true)}
          className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs hover:border-purple-300 active:scale-[0.97] transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
            </div>
            {unreadNotifsCount > 0 && (
              <span className="text-[10px] font-bold text-rose-600 px-1.5 py-0.2 bg-rose-50 rounded-full">
                {unreadNotifsCount}
              </span>
            )}
          </div>
          <div className="font-display font-bold text-xs text-slate-900 leading-tight">
            {unreadNotifsCount === 0 ? 'Duyurular' : `${unreadNotifsCount} Yeni`}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 group-hover:text-purple-600 transition-colors">
            Kutuyu Aç →
          </p>
        </button>
      </div>

      {/* 4. Kayıtlı Mülk ve Daire */}
      <div className="space-y-1.5">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Kayıtlı Daire ve Mülk
        </h3>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div
            onClick={() => setIsSiteSelectorOpen(true)}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/60">
                <Building2 className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-900 leading-snug truncate">
                  {site?.name || 'Site Yönetimi'}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">
                  {user.block ? `${user.block} Blok • ` : ''}Daire {user.apartmentNo || '-'}
                  {site?.address ? ` • ${site.address}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 shrink-0">
              <span>Değiştir</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Kayıtlı Araç Plakası (Gerçek, Düzenlenebilir ve Kalıcı) */}
      <div className="space-y-1.5">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Araç ve Otopark Bilgisi
        </h3>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div
            onClick={() => {
              setPlateInput(user.vehiclePlate || '');
              setIsPlateModalOpen(true);
            }}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/60">
                <Car className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-900 leading-snug truncate">
                  Kayıtlı Araç Plakası
                </h4>
                <p className="text-[11px] text-slate-400 truncate">
                  Site bariyer ve otopark tanıma sistemi
                </p>
              </div>
            </div>

            {user.vehiclePlate ? (
              <div className="flex items-center space-x-2 shrink-0">
                {/* Türkiye Gerçek Plaka Tasarımı */}
                <div className="flex items-center border border-slate-700 bg-white rounded-md overflow-hidden shadow-2xs h-7">
                  <div className="bg-[#003399] text-white text-[9px] font-bold px-1.5 h-full flex items-center justify-center">
                    <span>TR</span>
                  </div>
                  <div className="px-2 font-mono font-bold text-xs text-slate-900 tracking-wider">
                    {user.vehiclePlate}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-xs font-semibold text-blue-600 shrink-0">
                <span>+ Plaka Ekle</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Yönetim ve Aidat Banka Bilgileri (Yalnızca gerçek veri varsa) */}
      {(siteSettings?.iban || siteSettings?.phone || siteSettings?.managerName) && (
        <div className="space-y-1.5">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Site Yönetim ve Banka Bilgileri
          </h3>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 space-y-3">
            {/* Yönetici & İletişim */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Site Yöneticisi
                </span>
                <h4 className="font-bold text-xs text-slate-900 mt-0.5">
                  {siteSettings.managerName || 'Site Yönetim Kurulu'}
                </h4>
              </div>

              {siteSettings.phone && (
                <a
                  href={`tel:${siteSettings.phone}`}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 text-xs font-bold active:scale-95 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Ara</span>
                </a>
              )}
            </div>

            {/* IBAN Bilgisi ve Kopyalama */}
            {siteSettings.iban && (
              <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-600">
                    {siteSettings.bankName || 'Aidat Banka Hesabı'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyIban}
                    className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-bold active:scale-95 transition-all cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>IBAN Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-800 tracking-wider font-semibold select-all break-all">
                  {siteSettings.iban}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. Hızlı Uygulama Yönlendirmeleri */}
      <div className="space-y-1.5">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
          Hızlı Menü
        </h3>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden divide-y divide-slate-100">
          <div
            onClick={() => setActiveTab('community')}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Komşu İletişim & Topluluk</h4>
                <p className="text-[11px] text-slate-400">Site sakinleri ve duyuru kanalı</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div
            onClick={() => setIsNotifSheetOpen(true)}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Site Bildirimleri</h4>
                <p className="text-[11px] text-slate-400">Yönetimden gelen duyuru ve uyarılar</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* 8. Çıkış Butonu */}
      <button
        type="button"
        onClick={() => setIsLogoutModalOpen(true)}
        className="w-full py-3.5 bg-white hover:bg-rose-50/50 border border-rose-200/70 text-rose-600 font-bold rounded-2xl transition-all text-xs flex items-center justify-center space-x-2 active:scale-[0.98] shadow-2xs cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Oturumu Kapat</span>
      </button>

      {/* WhatsApp Tarzı Plaka Düzenleme Modalı */}
      {isPlateModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in select-none"
          onClick={() => setIsPlateModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-t-[28px] sm:rounded-3xl p-5 pb-7 sm:pb-5 shadow-2xl border border-slate-100 animate-slide-up space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tutamak */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto sm:hidden" />

            {/* Başlık */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Car className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Araç Plakası Tanımla</h3>
                  <p className="text-[11px] text-slate-500">Site bariyer tanıma ve otopark girişi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPlateModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Canlı Plaka Görsel Önizleme */}
            <div className="flex justify-center py-2">
              <div className="inline-flex items-center border-2 border-slate-800 bg-white rounded-lg overflow-hidden shadow-sm h-11 px-0.5">
                <div className="bg-[#003399] text-white text-[10px] font-bold px-2 h-full flex flex-col items-center justify-center select-none">
                  <span>TR</span>
                </div>
                <div className="px-3 font-mono font-extrabold text-base text-slate-900 tracking-wider">
                  {plateInput.trim() || 'PLAKA GİRİN'}
                </div>
              </div>
            </div>

            {/* Giriş Alanı */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                Plaka Numarası
              </label>
              <input
                type="text"
                autoFocus
                value={plateInput}
                onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                placeholder="Örn: 34 ABC 789"
                maxLength={11}
                className="w-full uppercase font-mono font-bold tracking-wider text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Site otopark sistemi plakanızı otomatik olarak tanır.
              </p>
            </div>

            {/* Aksiyon Butonları */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  updateVehiclePlate(plateInput);
                  setIsPlateModalOpen(false);
                }}
                disabled={!plateInput.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs active:scale-[0.98] shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                Plakayı Kaydet
              </button>

              {user.vehiclePlate && (
                <button
                  type="button"
                  onClick={() => {
                    updateVehiclePlate('');
                    setPlateInput('');
                    setIsPlateModalOpen(false);
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-rose-50 text-rose-600 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Plakayı Kaldır
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Tarzı Çıkış Onay Modalı */}
      {isLogoutModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none"
          onClick={() => setIsLogoutModalOpen(false)}
        >
          <div
            className="w-full max-w-[310px] bg-white rounded-[24px] p-5 shadow-2xl border border-slate-100 animate-scale-up space-y-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#ea0038] flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111b21]">Oturum kapatılsın mı?</h3>
                <p className="text-[11px] text-[#667781] mt-0.5">Mevcut oturumunuz sonlanacak</p>
              </div>
            </div>

            <p className="text-xs text-[#667781] leading-relaxed">
              Çıkış yapmak istediğinize emin misiniz? Tekrar giriş yapmak için kullanıcı bilgileriniz gerekecektir.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#f0f2f5] hover:bg-slate-200 text-[#111b21] font-semibold text-xs transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => {
                  api.logout();
                  setUser(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#ea0038] hover:bg-[#c9002f] text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition-colors cursor-pointer"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Uygulama Sürüm Bilgisi */}
      <p className="text-center text-[10px] text-slate-400 font-medium">
        Site Yönetimi Mobil Uygulaması • v1.0.0
      </p>
    </div>
  );
};
