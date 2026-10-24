import React from 'react';
import { Bell, CheckCheck, X, CreditCard, Megaphone, Wrench, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const NotificationSheet: React.FC = () => {
  const { isNotifSheetOpen, setIsNotifSheetOpen, notifications, refreshNotifications, setActiveTab } = useApp();

  if (!isNotifSheetOpen) return null;

  const handleNotificationClick = async (notifId: string, href?: string) => {
    await api.markNotificationRead(notifId);
    await refreshNotifications();
    setIsNotifSheetOpen(false);
    if (href === 'payments') setActiveTab('payments');
    if (href === 'polls' || href === 'announcements') setActiveTab('home');
    if (href === 'requests') setActiveTab('requests');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT':
        return <CreditCard className="w-4.5 h-4.5 text-[#008069]" />;
      case 'ANNOUNCEMENT':
        return <Megaphone className="w-4.5 h-4.5 text-[#00a884]" />;
      case 'REQUEST':
        return <Wrench className="w-4.5 h-4.5 text-amber-600" />;
      default:
        return <ShieldCheck className="w-4.5 h-4.5 text-[#008069]" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs animate-fade-in select-none p-0 sm:p-4"
      onClick={() => setIsNotifSheetOpen(false)}
    >
      <div
        className="bg-white rounded-t-[28px] sm:rounded-3xl w-full max-w-sm max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-100/90 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* WhatsApp Çekmece Tutamağı */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto my-2.5 shrink-0" />

        {/* Başlık */}
        <div className="flex items-center justify-between px-5 pb-3 pt-1 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#008069] flex items-center justify-center">
              <Bell className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111b21]">Bildirimler</h3>
              <p className="text-[11px] text-[#667781]">Yönetim ve komşuluk duyuruları</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsNotifSheetOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Liste */}
        <div className="p-3.5 overflow-y-auto space-y-2 flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <Bell className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="font-medium text-[#667781]">Henüz yeni bir bildiriminiz bulunmuyor.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isUnread = !notif.readAt;
              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id, notif.href)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all active:scale-[0.99] border ${
                    isUnread
                      ? 'bg-[#d9fdd3]/35 border-[#d1f4cb] shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100 shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 truncate">
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#00a884] shrink-0" />
                          )}
                          <h4 className={`text-xs truncate ${isUnread ? 'font-bold text-[#111b21]' : 'font-semibold text-slate-700'}`}>
                            {notif.title}
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-1.5">{notif.createdAt}</span>
                      </div>
                      <p className="text-[11.5px] text-[#667781] mt-1 leading-relaxed line-clamp-2">{notif.body}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Alt Çubuk */}
        <div className="p-3.5 pb-6 sm:pb-3.5 border-t border-slate-100 bg-[#f0f2f5]/60">
          <button
            type="button"
            onClick={() => setIsNotifSheetOpen(false)}
            className="w-full py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-[#111b21] font-semibold rounded-2xl text-xs transition-colors shadow-2xs active:scale-[0.99]"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
