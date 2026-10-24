import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { BottomNav } from './BottomNav';
import { useApp } from '../context/AppContext';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const { user } = useApp();

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(99,102,241,0.15),rgba(240,244,250,0.8))] bg-[#edf2f9] flex flex-col items-center justify-center p-0 sm:p-6 font-sans">
      {/* Top Desktop Bar (only visible on wider screens) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[400px] mb-3 px-1 text-slate-700 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50 animate-pulse"></div>
          <span className="font-bold text-slate-900 tracking-tight font-display text-sm">Site Yönetimi Mobil</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/90 border border-slate-200/80 text-indigo-600 font-semibold shadow-2xs">
            Canlı Görünüm
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 shadow-2xs transition-colors active:scale-95 cursor-pointer"
            title="Cihaz çerçevesi görünümünü değiştir"
          >
            {isPhoneFrame ? <Monitor className="w-3.5 h-3.5 text-slate-500" /> : <Smartphone className="w-3.5 h-3.5 text-slate-500" />}
            <span className="text-[11px] font-medium">{isPhoneFrame ? 'Genişlet' : 'Telefon'}</span>
          </button>
        </div>
      </div>

      {/* Main Mobile App Container */}
      <div
        className={`w-full bg-gradient-to-b from-[#f8faff] via-[#fafbfe] to-[#f4f7fb] flex flex-col overflow-hidden transition-all duration-300 relative sm:transform-gpu ${
          isPhoneFrame
            ? 'sm:max-w-[400px] sm:h-[844px] sm:rounded-[46px] phone-shadow relative sm:border-[4px] sm:border-slate-300/85 sm:ring-1 sm:ring-slate-900/5'
            : 'max-w-md h-screen sm:rounded-2xl sm:border border-slate-200 shadow-sm'
        }`}
      >
        {/* Soft Ambient Mesh Glow Orbs (Subtle, Luminous, Not dark) */}
        <div className="ambient-glow -top-10 -left-10 w-56 h-56 bg-indigo-400/15 pointer-events-none -z-10" />
        <div className="ambient-glow top-40 -right-10 w-56 h-56 bg-emerald-400/12 pointer-events-none -z-10" />

        {/* iOS Dynamic Island & Status Bar */}
        <div className="shrink-0 z-20 bg-transparent">
          <StatusBar darkText={true} />
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Bottom Navigation (Sadece giriş yapmış kullanıcılar için) */}
        {user && <BottomNav />}

        {/* iOS Home Indicator Bar */}
        <div className={`w-full pb-1.5 pt-0.5 flex justify-center shrink-0 z-10 select-none ${user ? 'bg-transparent' : 'bg-transparent'}`}>
          <div className="w-28 h-1 bg-slate-400/40 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
