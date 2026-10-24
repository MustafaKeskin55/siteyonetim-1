import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Phone,
  User,
  KeyRound,
  Building2,
  Home,
  ArrowRight,
  AlertCircle,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SiteLogo } from '../components/SiteLogo';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

export const AuthScreen: React.FC = () => {
  const { setUser, reloadAllData } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [accountType, setAccountType] = useState<'RESIDENT' | 'MANAGER'>('RESIDENT');

  // Form Fields
  const [usernameOrPhone, setUsernameOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [apartmentNo, setApartmentNo] = useState('');
  const [newSiteName, setNewSiteName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!usernameOrPhone.trim() || !password) {
      setErrorMessage('Lütfen e-posta/telefon ve şifrenizi girin.');
      return;
    }

    setIsLoading(true);
    try {
      const loggedUser = await api.login(usernameOrPhone.trim(), password);
      setUser(loggedUser);
      await reloadAllData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !emailOrPhone.trim() || !password) {
      setErrorMessage('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.register({
        name: name.trim(),
        emailOrPhone: emailOrPhone.trim(),
        password,
        accountType,
        inviteCode: accountType === 'RESIDENT' ? inviteCode.trim() : undefined,
        apartmentNo: accountType === 'RESIDENT' ? apartmentNo.trim() : undefined,
        newSiteName: accountType === 'MANAGER' ? newSiteName.trim() : undefined,
      });

      setSuccessMessage(res.message || 'Kaydınız başarıyla tamamlandı! Şimdi giriş yapabilirsiniz.');
      setTimeout(() => {
        setMode('login');
        setUsernameOrPhone(emailOrPhone.trim());
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Kayıt oluşturulamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-5 py-8 overflow-y-auto smooth-scroll bg-transparent relative">
      {/* Radiant ambient glow orbs */}
      <div className="ambient-glow top-4 -right-12 bg-indigo-400/15 pointer-events-none" />
      <div className="ambient-glow bottom-8 -left-12 bg-violet-400/15 pointer-events-none" />

      {/* Brand Header with Frameless Animated 3D Logo */}
      <div className="flex flex-col items-center text-center mb-6 relative select-none">
        <div className="relative mb-2 flex items-center justify-center">
          {/* Subtle breathing radiant halo aura behind logo */}
          <div className="absolute w-28 h-28 bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-sky-400/20 rounded-full blur-xl pointer-events-none animate-aura -z-10" />

          {/* Floating Frameless 3D Brand Logo */}
          <div className="relative animate-float cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95">
            <img
              src="/logo-icon-transparent.png"
              alt="Site Yönetimi"
              className="w-28 h-24 sm:w-32 sm:h-28 object-contain drop-shadow-[0_14px_28px_rgba(79,70,229,0.22)]"
              draggable={false}
            />
          </div>
        </div>

        <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight">
          Site Yönetimi Mobil
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-[260px] font-medium leading-relaxed">
          Daireniz, aidatlarınız ve komşuluk iletişiminiz tek bir yerde
        </p>
      </div>

      {/* Auth Glass Card */}
      <div className="glass-card rounded-[28px] p-5 relative overflow-hidden space-y-4">
        {/* Segmented Mode Switcher */}
        <div className="flex bg-slate-100/80 p-1 rounded-2xl text-xs font-bold border border-slate-200/50">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-indigo-700 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-indigo-700 shadow-xs font-black'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Yeni Hesap Aç
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-2xl flex items-start space-x-2 border border-rose-100 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span className="font-medium leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-2xl flex items-center space-x-2 border border-emerald-100 animate-fadeIn">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-medium leading-snug">{successMessage}</span>
          </div>
        )}

        {/* 1. GİRİŞ FORMU */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 ml-1">
                E-posta veya Telefon
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ornek@mail.com veya 05XX"
                  value={usernameOrPhone}
                  onChange={(e) => setUsernameOrPhone(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 ml-1">
                Şifre
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-display font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-600/25 active:scale-[0.98] disabled:opacity-50 mt-2 cursor-pointer"
            >
              <span>{isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* 2. KAYIT FORMU */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            {/* Sakin / Yönetici Seçimi */}
            <div className="grid grid-cols-2 gap-2 pb-0.5">
              <button
                type="button"
                onClick={() => setAccountType('RESIDENT')}
                className={`p-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  accountType === 'RESIDENT'
                    ? 'border-indigo-500 bg-indigo-50/80 text-indigo-700 shadow-xs'
                    : 'border-slate-200/80 bg-slate-50/50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Daire Sakini</span>
              </button>
              <button
                type="button"
                onClick={() => setAccountType('MANAGER')}
                className={`p-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  accountType === 'MANAGER'
                    ? 'border-indigo-500 bg-indigo-50/80 text-indigo-700 shadow-xs'
                    : 'border-slate-200/80 bg-slate-50/50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Site Yöneticisi</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 ml-1">
                Ad Soyad
              </label>
              <input
                type="text"
                placeholder="Adınız ve Soyadınız"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 ml-1">
                E-posta / Telefon
              </label>
              <input
                type="text"
                placeholder="İletişim bilginiz"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all font-medium"
              />
            </div>

            {accountType === 'RESIDENT' ? (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 ml-1">
                    Site Katılım Kodu
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: LALE-2026"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-xs text-slate-800 uppercase placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all font-medium tracking-wider"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 ml-1">
                    Daire No
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: 14"
                    value={apartmentNo}
                    onChange={(e) => setApartmentNo(e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all font-medium"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 ml-1">
                  Yeni Site / Apartman Adı
                </label>
                <input
                  type="text"
                  placeholder="Örn: Lale Konutları"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all font-medium"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 ml-1">
                Şifre Belirleyin
              </label>
              <input
                type="password"
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-display font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-600/25 active:scale-[0.98] disabled:opacity-50 mt-2 cursor-pointer"
            >
              <span>{isLoading ? 'Kaydediliyor...' : 'Hesabı Oluştur'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>

      <div className="flex items-center justify-center space-x-1.5 mt-5 text-[11px] text-slate-400 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>256-Bit SSL Uçtan Uca Şifreli Güvenlik</span>
      </div>
    </div>
  );
};

