import React, { useEffect, useState } from 'react';
import { BarChart3, CheckCircle2, X, Users, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Poll } from '../types';

export const PollVoteModal: React.FC = () => {
  const { isPollModalOpen, setIsPollModalOpen, activePollId } = useApp();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (activePollId) {
      api.getPoll(activePollId).then((p) => {
        if (p) {
          setPoll(p);
          if (p.userVotedOption !== null) {
            setSelectedOption(p.userVotedOption);
            setHasVoted(true);
          } else {
            setHasVoted(false);
          }
        }
      });
    }
  }, [activePollId, isPollModalOpen]);

  if (!isPollModalOpen || !poll) return null;

  const handleVote = async () => {
    if (selectedOption === null || !activePollId) return;
    setIsSubmitting(true);
    try {
      const updated = await api.votePoll(activePollId, selectedOption);
      setPoll(updated);
      setHasVoted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs animate-fade-in select-none p-0 sm:p-4"
      onClick={() => setIsPollModalOpen(false)}
    >
      <div
        className="bg-white rounded-t-[28px] sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100/90 p-5 pb-7 sm:pb-5 animate-slide-up flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* WhatsApp Çekmece Tutamağı */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3.5 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#008069] flex items-center justify-center">
              <BarChart3 className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100/70 text-[#008069] px-2.5 py-0.5 rounded-md">
              SİTE İÇİ ANKET
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPollModalOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question */}
        <div className="py-3.5">
          <h3 className="font-bold text-sm sm:text-base text-[#111b21] leading-snug">
            {poll.question}
          </h3>
          <div className="flex items-center space-x-1.5 mt-1.5 text-xs text-[#667781]">
            <Users className="w-3.5 h-3.5 text-[#00a884]" />
            <span>Toplam {poll.totalVotes} daire katıldı</span>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2.5 mb-5 overflow-y-auto pr-0.5">
          {poll.optionsWithVotes.map((opt, idx) => {
            const isSelected = selectedOption === idx;

            return (
              <div
                key={idx}
                onClick={() => !hasVoted && setSelectedOption(idx)}
                className={`relative overflow-hidden rounded-2xl border p-3.5 transition-all ${
                  hasVoted
                    ? isSelected
                      ? 'border-[#00a884] bg-emerald-50/40 shadow-2xs'
                      : 'border-slate-100 bg-[#f0f2f5]/60'
                    : isSelected
                    ? 'border-[#00a884] bg-emerald-50/50 shadow-xs cursor-pointer'
                    : 'border-slate-200 hover:border-[#00a884]/60 bg-white cursor-pointer active:scale-[0.99]'
                }`}
              >
                {/* Progress bar fill (when voted) - WhatsApp Yeşil dolgu */}
                {hasVoted && (
                  <div
                    className="absolute inset-y-0 left-0 bg-[#d9fdd3]/70 transition-all duration-500 ease-out"
                    style={{ width: `${opt.percent}%` }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-[#00a884] bg-[#00a884] text-white shadow-2xs'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 fill-current" />}
                    </div>
                    <span className={`font-semibold text-xs ${isSelected ? 'text-[#111b21]' : 'text-slate-700'}`}>
                      {opt.text}
                    </span>
                  </div>

                  {hasVoted && (
                    <span className="font-bold text-[11px] text-[#008069] bg-white/90 border border-emerald-100 px-2 py-0.5 rounded-md shadow-2xs">
                      %{opt.percent} ({opt.count})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {hasVoted ? (
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-center space-x-1.5 text-xs text-[#00a884] font-semibold py-1">
              <CheckCircle2 className="w-4 h-4 text-[#00a884]" />
              <span>Oyunuz başarıyla kaydedildi</span>
            </div>
            <button
              type="button"
              onClick={() => setIsPollModalOpen(false)}
              className="w-full py-3 bg-[#f0f2f5] hover:bg-[#e9edef] text-[#111b21] font-semibold rounded-2xl transition-colors text-xs active:scale-[0.99]"
            >
              Kapat
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleVote}
            disabled={selectedOption === null || isSubmitting}
            className="w-full py-3 bg-[#00a884] hover:bg-[#008f6f] active:bg-[#007a5e] disabled:opacity-40 text-white font-semibold rounded-2xl transition-all shadow-sm active:scale-[0.99] text-xs flex items-center justify-center"
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Oyu Onayla'}
          </button>
        )}
      </div>
    </div>
  );
};
