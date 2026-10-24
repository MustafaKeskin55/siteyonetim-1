import React, { useState } from 'react';
import { Wrench, X, Send, AlertCircle, Camera, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const NewRequestModal: React.FC = () => {
  const { isNewRequestOpen, setIsNewRequestOpen, refreshRequests } = useApp();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Tesisat & Sıhhi');
  const [description, setDescription] = useState('');
  const [attachedImageName, setAttachedImageName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Tesisat & Sıhhi',
    'Asansör',
    'Elektrik & Aydınlatma',
    'Güvenlik & Otopark',
    'Temizlik & Çevre',
    'Peyzaj & Bahçe',
    'Genel Talep',
  ];

  if (!isNewRequestOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError('Lütfen talep başlığı ve açıklama giriniz.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await api.createRequest(subject.trim(), category, description.trim());
      await refreshRequests();
      setSubject('');
      setDescription('');
      setIsNewRequestOpen(false);
    } catch (err) {
      setError('Talep iletilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs animate-fade-in select-none p-0 sm:p-4"
      onClick={() => setIsNewRequestOpen(false)}
    >
      <div
        className="bg-white rounded-t-[28px] sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100/90 p-5 pb-7 sm:pb-5 animate-slide-up flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* WhatsApp Çekmece Tutamağı */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3.5 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#008069] flex items-center justify-center">
              <Wrench className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#111b21]">Yeni Talep & Arıza Bildirimi</h3>
              <p className="text-[11px] text-[#667781]">Yönetim birimine iletin</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsNewRequestOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-3.5 space-y-3 overflow-y-auto flex-1 pr-0.5">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-2xl border border-rose-100 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#f0f2f5]/80 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#111b21] focus:outline-none focus:border-[#00a884] focus:ring-2 focus:ring-[#00a884]/20"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Konu Başlığı *</label>
            <input
              type="text"
              placeholder="Örn: 2. kat koridor lambası yanmıyor"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={80}
              className="w-full bg-[#f0f2f5]/80 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#111b21] placeholder-slate-400 focus:outline-none focus:border-[#00a884] focus:ring-2 focus:ring-[#00a884]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detaylı Açıklama *</label>
            <textarea
              rows={3}
              placeholder="Arızanın veya talebinizin detaylarını yazınız..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              className="w-full bg-[#f0f2f5]/80 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-[#111b21] placeholder-slate-400 focus:outline-none focus:border-[#00a884] focus:ring-2 focus:ring-[#00a884]/20"
            />
          </div>

          <label className="flex items-center space-x-2.5 p-3 border border-dashed border-slate-300 rounded-2xl text-slate-600 text-xs cursor-pointer hover:bg-slate-50 transition-colors bg-[#f0f2f5]/40">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setAttachedImageName(f.name);
              }}
              className="hidden"
            />
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#00a884] flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <span className="truncate text-xs font-medium">
              {attachedImageName ? `${attachedImageName} seçildi` : 'Cihazdan Fotoğraf Ekle (Opsiyonel)'}
            </span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#00a884] hover:bg-[#008f6f] active:bg-[#007a5e] disabled:opacity-40 text-white font-semibold rounded-2xl transition-all shadow-sm active:scale-[0.99] text-xs flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4 -rotate-12" />
            <span>{isSubmitting ? 'İletiliyor...' : 'Yönetime İlet'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
