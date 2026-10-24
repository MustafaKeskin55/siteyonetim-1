import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle, Clock, AlertTriangle, MessageSquare, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RequestStatus } from '../types';

export const RequestsScreen: React.FC = () => {
  const { requests, setIsNewRequestOpen } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');

  const filteredRequests = requests.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  const openCount = requests.filter((r) => r.status === 'OPEN').length;
  const inProgCount = requests.filter((r) => r.status === 'IN_PROGRESS').length;
  const resolvedCount = requests.filter((r) => r.status === 'RESOLVED').length;

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>Bekliyor</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center space-x-1">
            <Wrench className="w-3 h-3 text-amber-600" />
            <span>İşlemde</span>
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>Çözüldü</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 flex items-center space-x-1">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>Reddedildi</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto smooth-scroll px-4 pt-2.5 pb-24 space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black font-display text-slate-900 tracking-tight">
            Talepler & Arızalar
          </h1>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Site yönetimine iletilen bildirimler
          </p>
        </div>

        <button
          onClick={() => setIsNewRequestOpen(true)}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md shadow-indigo-600/20 active-bounce transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Yeni Talep</span>
        </button>
      </div>

      {/* Modern Durum Filtreleme Sekmeleri */}
      <div className="flex items-center space-x-1 glass-card p-1 rounded-xl border border-slate-200/70 text-xs">
        <button
          onClick={() => setFilter('ALL')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-[10.5px] transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Tümü ({requests.length})
        </button>
        <button
          onClick={() => setFilter('OPEN')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-[10.5px] transition-all cursor-pointer ${
            filter === 'OPEN'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Bekleyen ({openCount})
        </button>
        <button
          onClick={() => setFilter('IN_PROGRESS')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-[10.5px] transition-all cursor-pointer ${
            filter === 'IN_PROGRESS'
              ? 'bg-white text-amber-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          İşlemde ({inProgCount})
        </button>
        <button
          onClick={() => setFilter('RESOLVED')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-[10.5px] transition-all cursor-pointer ${
            filter === 'RESOLVED'
              ? 'bg-white text-emerald-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Çözülen ({resolvedCount})
        </button>
      </div>

      {/* Requests List */}
      <div className="space-y-2.5">
        {filteredRequests.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center space-y-2 border border-slate-200/70">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-xs text-slate-800">Kayıtlı talep bulunmamaktadır</h4>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Bina ve dairenizle ilgili bir arıza veya talebiniz olduğunda sağ üstteki "Yeni Talep" butonuna tıklayabilirsiniz.
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="glass-card rounded-xl p-3.5 border border-slate-200/70 shadow-2xs space-y-2 hover:border-indigo-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {req.category}
                </span>
                {getStatusBadge(req.status)}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs leading-snug">{req.subject}</h4>
                <p className="text-[11.5px] text-slate-600 mt-1 leading-relaxed line-clamp-2">{req.description}</p>
              </div>

              {req.resolutionNote && (
                <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/60 text-xs text-emerald-900 space-y-0.5">
                  <p className="font-bold text-[10.5px] text-emerald-800">Yönetim Çözüm Notu:</p>
                  <p className="text-[11px] text-emerald-700 leading-normal">{req.resolutionNote}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                <span>{new Date(req.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>Talep ID: #{req.id.slice(-5)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
