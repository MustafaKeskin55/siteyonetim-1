import React, { useState } from 'react';
import {
  Building2,
  Check,
  X,
  Sparkles,
  Plus,
  Lock,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  CreditCard,
  Layers,
  Calendar,
  Zap,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SiteSelectorModal: React.FC = () => {
  const {
    isSiteSelectorOpen,
    setIsSiteSelectorOpen,
    isProModalOpen,
    setIsProModalOpen,
    site,
    properties,
    activePropertyId,
    switchActiveProperty,
    addProperty,
    isPro,
    proSubscription,
    subscribePro,
    cancelProSubscription,
  } = useApp();

  const [view, setView] = useState<'list' | 'add' | 'pro'>('list');
  const [siteName, setSiteName] = useState(site?.name || 'Site Yönetimi');
  const [block, setBlock] = useState('B Blok');
  const [apartmentNo, setApartmentNo] = useState('');
  const [role, setRole] = useState<'Kat Maliki' | 'Kiracı'>('Kat Maliki');

  // PRO Ödeme Formu State'leri (10 ₺, 20 ₺, Yıllık 200 ₺)
  const [selectedPlan, setSelectedPlan] = useState<'monthly_small' | 'monthly_large' | 'yearly'>('monthly_small');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState<{
    transactionId: string;
    expiresAt: string;
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  const isOpen = isSiteSelectorOpen || isProModalOpen;

  const handleClose = () => {
    setIsSiteSelectorOpen(false);
    setIsProModalOpen(false);
    setView('list');
    setErrorMessage('');
    setPaymentError('');
    setPaymentSuccess(null);
  };

  React.useEffect(() => {
    if (isProModalOpen) {
      setView('pro');
    }
  }, [isProModalOpen]);

  // Yeni daire ekleme butonuna basıldığında:
  // KURAL: 1 ve 2 daire ücretsizdir. 3 ve üzeri daire için PRO gereklidir.
  const handleNewApartmentClick = () => {
    if (properties.length >= 2 && !isPro) {
      setView('pro');
    } else {
      setView('add');
    }
  };

  // Daire seçimi:
  const handleSelectProperty = (propId: string) => {
    const res = switchActiveProperty(propId);
    if (res.requiresPro) {
      setView('pro');
    }
  };

  // Yeni daire formu kaydetme
  const handleSaveApartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apartmentNo.trim()) {
      setErrorMessage('Lütfen daire numarasını giriniz.');
      return;
    }

    const res = addProperty({
      siteName: siteName.trim() || 'Site Yönetimi',
      block: block.trim() || 'A Blok',
      apartmentNo: apartmentNo.trim(),
      role,
    });

    if (res.requiresPro) {
      setView('pro');
    } else if (res.success) {
      setApartmentNo('');
      setErrorMessage('');
      setView('list');
    }
  };

  // Kart Numarası Formatlama (4'erli gruplar)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : raw);
  };

  // Son Kullanma Formatlama (AA/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setExpiry(val);
  };

  // GERÇEK PRO ÖDEME / ABONELİK İŞLEMİ (TEST MEEST YOK!)
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    if (!cardHolder.trim()) {
      setPaymentError('Lütfen kart üzerindeki isim ve soyismi giriniz.');
      return;
    }

    try {
      setIsProcessing(true);
      const res = await subscribePro({
        cardHolder: cardHolder.trim(),
        cardNumber,
        expiry,
        cvv,
        plan: selectedPlan,
      });

      setPaymentSuccess(res);
      setIsProcessing(false);
    } catch (err: any) {
      setIsProcessing(false);
      setPaymentError(err.message || 'Ödeme işlemi gerçekleştirilemedi. Lütfen bilgilerinizi kontrol ediniz.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in select-none p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-t-[32px] sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100/90 p-5 pb-7 sm:pb-5 animate-slide-up flex flex-col max-h-[94vh] overflow-y-auto smooth-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3.5 shrink-0" />

        {/* ============================================================ */}
        {/* 1. LİSTE GÖRÜNÜMÜ: KAYITLI DAİRELER & ÇOKLU MÜLK YÖNETİMİ     */}
        {/* ============================================================ */}
        {view === 'list' && (
          <div className="space-y-4">
            {/* Başlık ve Kapatma */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">Kayıtlı Daire ve Mülkler</h3>
                  <p className="text-[11px] text-slate-500">Mülklerinizi tek hesaptan yönetin</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PRO Üyelik Durum Rozeti (1-2 Daire Ücretsiz, 3+ PRO) */}
            <div
              onClick={() => setView('pro')}
              className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${
                isPro
                  ? 'bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-amber-500/15 border-amber-300/80 shadow-2xs'
                  : 'bg-slate-50 hover:bg-indigo-50/50 border-slate-200/80'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isPro ? 'bg-amber-400 text-amber-950 shadow-xs' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-black text-slate-900">
                      {isPro ? 'PRO Üyelik Aktif' : 'Standart Hesap (2 Daireye Kadar Ücretsiz)'}
                    </span>
                    {isPro && (
                      <span className="text-[9px] font-black bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full">
                        PRO
                      </span>
                    )}
                  </div>
                  <p className="text-[10.5px] text-slate-500">
                    {isPro
                      ? 'Sınırsız daire ekleme ve geçiş hakkınız aktif'
                      : '3 ve üzeri daire yönetimi için PRO Üyelik gereklidir'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            </div>

            {/* Daireler Listesi */}
            <div className="space-y-2.5">
              {properties.map((prop, idx) => {
                const isActive = prop.id === activePropertyId;
                // 1. ve 2. daire (idx 0 ve 1) Standarttır. 3 ve üzeri (idx >= 2) PRO gerektirir!
                const isFreeTier = idx < 2;
                const isThirdOrMore = idx >= 2;
                const isLocked = isThirdOrMore && !isPro;

                return (
                  <div
                    key={prop.id}
                    onClick={() => handleSelectProperty(prop.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between shadow-2xs ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : isLocked
                        ? 'border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50/70'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none ${
                          isActive
                            ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xs'
                            : isLocked
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-amber-700" />
                        ) : (
                          prop.siteName.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-0.5">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                            {prop.siteName}
                          </h4>
                          {isFreeTier ? (
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-md shrink-0">
                              {idx + 1}. Daire (Dahil)
                            </span>
                          ) : (
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md shrink-0 flex items-center gap-0.5 ${
                                isPro ? 'bg-amber-100 text-amber-800' : 'bg-amber-400 text-amber-950'
                              }`}
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>{idx + 1}. Daire (PRO)</span>
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {prop.block} • Daire {prop.apartmentNo} • {prop.role || 'Kat Maliki'}
                        </p>

                        {isActive && (
                          <span className="inline-block mt-1 text-[9.5px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                            Aktif Konut
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isActive ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : isLocked ? (
                        <div className="flex items-center space-x-1 bg-amber-400 text-amber-950 px-2.5 py-1 rounded-xl text-[10px] font-black shadow-xs">
                          <Lock className="w-3 h-3" />
                          <span>PRO Aç</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-400">
                          <span className="text-[10px] text-slate-400">Seç</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Yeni Daire Ekle Butonu */}
            <button
              type="button"
              onClick={handleNewApartmentClick}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-400 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Daire / Mülk Ekle</span>
              {properties.length >= 2 && !isPro && (
                <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded-md ml-1 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>3+ PRO</span>
                </span>
              )}
            </button>

            {/* Kural Bilgilendirme Kutusu (3 VE ÜZERİ KURALI) */}
            <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-600 flex items-start space-x-2 border border-slate-200/70 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Kural:</strong> 1 ve 2 daire yönetimi tamamen <strong>ücretsizdir</strong>. 3 ve daha fazla daire ve mülkünüzü tek hesap üzerinden yönetebilmek için <strong>PRO Üyelik</strong> gereklidir.
              </span>
            </div>

            {/* Tamam Butonu */}
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-2xl transition-all shadow-sm active:scale-[0.99] text-xs flex items-center justify-center cursor-pointer"
            >
              Tamam
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. GERÇEK PRO ÜYELİK & ÖDEME EKRANI (TEST MEEST YOK!)       */}
        {/* ============================================================ */}
        {view === 'pro' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Üst Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setView('list')}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-sm text-slate-900">PRO Çoklu Daire Paketi</h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Durum A: Kullanıcının zaten aktif PRO üyeliği varsa */}
            {isPro && proSubscription ? (
              <div className="space-y-3.5">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                      Aktif Abonelik
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  </div>
                  <h4 className="text-base font-black">PRO Üyeliğiniz Aktif</h4>
                  <p className="text-xs text-emerald-100 leading-snug">
                    3 ve üzeri tüm daire ve mülklerinizi sınırsız şekilde bağlayabilir ve yönetebilirsiniz.
                  </p>
                  <div className="pt-2 border-t border-white/20 text-[11px] space-y-1">
                    <div className="flex justify-between text-emerald-100">
                      <span>Paket:</span>
                      <span className="font-bold text-white">
                        {proSubscription.plan === 'yearly'
                          ? 'Yıllık Sınırsız PRO (200 ₺)'
                          : proSubscription.plan === 'monthly_large'
                          ? '6+ Daire PRO (20 ₺/Ay)'
                          : '3-5 Daire PRO (10 ₺/Ay)'}
                      </span>
                    </div>
                    {proSubscription.expiresAt && (
                      <div className="flex justify-between text-emerald-100">
                        <span>Yenilenme Tarihi:</span>
                        <span className="font-bold text-white">
                          {new Date(proSubscription.expiresAt).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                    {proSubscription.transactionId && (
                      <div className="flex justify-between text-emerald-100">
                        <span>İşlem Referansı:</span>
                        <span className="font-mono text-white text-[10px]">{proSubscription.transactionId}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setView('add')}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yeni Daire Ekle</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('PRO üyeliğinizi iptal etmek istediğinize emin misiniz?')) {
                        cancelProSubscription();
                      }
                    }}
                    className="w-full py-2.5 text-xs text-rose-600 hover:text-rose-700 font-semibold bg-rose-50 hover:bg-rose-100 rounded-2xl transition-colors cursor-pointer"
                  >
                    Aboneliği İptal Et
                  </button>
                </div>
              </div>
            ) : paymentSuccess ? (
              /* Ödeme Başarı Ekranı */
              <div className="space-y-3.5 py-2 text-center animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">Ödeme Başarıyla Tamamlandı!</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-[260px] mx-auto">
                    PRO üyeliğiniz hesabınıza tanımlandı. Artık 3 ve daha fazla daire ekleyebilirsiniz.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-500">
                    <span>İşlem Ref:</span>
                    <span className="font-mono font-bold text-slate-800">{paymentSuccess.transactionId}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Geçerlilik:</span>
                    <span className="font-bold text-slate-800">{paymentSuccess.expiresAt}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Ödeme Durumu:</span>
                    <span className="font-bold text-emerald-600">Onaylandı (3D Secure)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setView('add')}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>3. Dairenizi Şimdi Ekleyin</span>
                </button>
              </div>
            ) : (
              /* Gerçek Ödeme Formu */
              <form onSubmit={handlePaymentSubmit} className="space-y-3.5">
                {/* PRO Hero Banner */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-900 via-indigo-800 to-violet-900 text-white shadow-md relative overflow-hidden">
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      PRO
                    </span>
                    <h4 className="text-xs font-black tracking-tight">3 ve Üzeri Daire Yönetimi</h4>
                  </div>
                  <p className="text-[11px] text-indigo-200 mt-1 leading-snug">
                    1 ve 2 daire ücretsizdir. 3-5 daire için ayda 10 ₺, 6+ daire için ayda 20 ₺ veya tüm yıl için 200 ₺.
                  </p>
                </div>

                {/* Plan Seçimi (10 ₺, 20 ₺, Yıllık 200 ₺) */}
                <div className="grid grid-cols-3 gap-1.5">
                  {/* 1. Seçenek: 3-5 Daire (10 ₺) */}
                  <div
                    onClick={() => setSelectedPlan('monthly_small')}
                    className={`p-2 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      selectedPlan === 'monthly_small'
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-tight">3-5 Daire</span>
                        {selectedPlan === 'monthly_small' && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
                      </div>
                      <div className="text-sm font-black text-slate-900 mt-1 leading-none">10 ₺</div>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1">Aylık</div>
                  </div>

                  {/* 2. Seçenek: 6+ Daire (20 ₺) */}
                  <div
                    onClick={() => setSelectedPlan('monthly_large')}
                    className={`p-2 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      selectedPlan === 'monthly_large'
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-tight">6+ Daire</span>
                        {selectedPlan === 'monthly_large' && <Check className="w-3 h-3 text-indigo-600 stroke-[3]" />}
                      </div>
                      <div className="text-sm font-black text-slate-900 mt-1 leading-none">20 ₺</div>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1">Aylık Sınırsız</div>
                  </div>

                  {/* 3. Seçenek: Yıllık 200 ₺ (En Avantajlı) */}
                  <div
                    onClick={() => setSelectedPlan('yearly')}
                    className={`p-2 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden ${
                      selectedPlan === 'yearly'
                        ? 'border-amber-500 bg-amber-50/40 shadow-xs ring-1 ring-amber-500/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-[7.5px] font-black px-1 rounded-bl-md">
                      Yıllık
                    </span>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-extrabold text-amber-800 uppercase tracking-tight">Tüm Yıl</span>
                        {selectedPlan === 'yearly' && <Check className="w-3 h-3 text-amber-600 stroke-[3]" />}
                      </div>
                      <div className="text-sm font-black text-slate-900 mt-1 leading-none">200 ₺</div>
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1">Yıllık Tek Çekim</div>
                  </div>
                </div>

                {/* Hata Uyarısı */}
                {paymentError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start space-x-1.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                    <span>{paymentError}</span>
                  </div>
                )}

                {/* Kart Bilgileri Giriş Formu */}
                <div className="space-y-2.5 pt-0.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Kart Üzerindeki İsim Soyisim
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="Örn: MUSTAFA YILMAZ"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                      Kredi / Banka Kart Numarası
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4543 **** **** 1234"
                        required
                        className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        Son Kullanma (AA/YY)
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="12/28"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="***"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-semibold text-slate-900 focus:bg-white focus:border-indigo-500 outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Güvenlik Rozetleri */}
                <div className="flex items-center justify-center space-x-3 text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    256-Bit SSL
                  </span>
                  <span>•</span>
                  <span>3D Secure Korumalı</span>
                  <span>•</span>
                  <span>Anında Aktivasyon</span>
                </div>

                {/* Ödeme Gönder Butonu */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 disabled:opacity-75 text-white font-bold rounded-2xl transition-all shadow-md shadow-indigo-600/25 active:scale-[0.98] text-xs flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Banka Güvenli Ödeme Doğrulanıyor...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>
                        Güvenli Öde ve PRO'ya Geç (
                        {selectedPlan === 'monthly_small'
                          ? '10 ₺/Ay'
                          : selectedPlan === 'monthly_large'
                          ? '20 ₺/Ay'
                          : '200 ₺/Yıl'}
                        )
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. YENİ DAİRE EKLEME FORMU                                   */}
        {/* ============================================================ */}
        {view === 'add' && (
          <form onSubmit={handleSaveApartment} className="space-y-3.5 animate-fadeIn">
            {/* Form Başlığı */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setView('list')}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="font-extrabold text-sm text-slate-900">Yeni Daire / Mülk Ekle</h3>
              <button
                type="button"
                onClick={handleClose}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Daire Kural Rozeti */}
            <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 font-medium">
              Ekleyeceğiniz daire: <strong>{properties.length + 1}. Daire</strong>{' '}
              {properties.length < 2 ? '(Standart Ücretsiz Kapsamında)' : '(PRO Üyelik Kapsamında)'}
            </div>

            {/* Site Adı */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Site / Apartman Adı</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Örn: Site Yönetimi veya Akasya Sitesi"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 outline-hidden"
              />
            </div>

            {/* Blok & Daire No Yan Yana */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Blok</label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="Örn: B Blok"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Daire No *</label>
                <input
                  type="text"
                  value={apartmentNo}
                  onChange={(e) => setApartmentNo(e.target.value)}
                  placeholder="Örn: 14"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 outline-hidden"
                />
              </div>
            </div>

            {/* Mülkiyet Rolü */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mülkiyet Durumu</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('Kat Maliki')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    role === 'Kat Maliki'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Kat Maliki (Ev Sahibi)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Kiracı')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    role === 'Kiracı'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Kiracı
                </button>
              </div>
            </div>

            {/* Kaydet Butonu */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-2xl transition-all shadow-sm active:scale-[0.99] text-xs flex items-center justify-center cursor-pointer mt-2"
            >
              Daireyi Hesaba Ekle
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
