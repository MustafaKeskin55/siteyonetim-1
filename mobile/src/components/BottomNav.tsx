import React from 'react';
import { Home, CreditCard, Users, FileText, User as UserIcon } from 'lucide-react';
import { useApp, TabType } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, user, isAnyModalOpen } = useApp();

  // Giriş yapılmamışsa veya herhangi bir modal/sheet açıkken alt menü ASLA gösterilmez
  if (!user || isAnyModalOpen) return null;

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Ana Sayfa', icon: Home },
    { id: 'payments', label: 'Aidatlar', icon: CreditCard },
    { id: 'community', label: 'Komşular', icon: Users },
    { id: 'requests', label: 'Talepler', icon: FileText },
    { id: 'profile', label: 'Profil', icon: UserIcon },
  ];

  return (
    <div id="bottom-nav-dock" className="w-full px-3 pb-1 pt-0 shrink-0 z-20 select-none animate-fadeIn">
      <div className="w-full bg-white/92 backdrop-blur-2xl border border-slate-200/80 px-1.5 py-1 rounded-[22px] flex items-center justify-around shadow-[0_8px_25px_rgba(15,23,42,0.06)]">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center transition-all duration-200 active-bounce relative py-1 px-3 rounded-2xl cursor-pointer ${
                isActive
                  ? 'text-indigo-600 font-semibold bg-indigo-50/80 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div className="relative">
                <IconComponent
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive ? 'scale-110 stroke-[2.2] text-indigo-600' : 'stroke-[1.8] text-slate-400'
                  }`}
                />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-xs shadow-indigo-600/50" />
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight transition-colors duration-200 ${
                  isActive ? 'text-indigo-600 font-bold' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
