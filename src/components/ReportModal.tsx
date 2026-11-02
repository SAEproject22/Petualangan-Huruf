import React from 'react';
import { AppProgress } from '../types';
import { ALPHABET_DATA } from '../data/alphabet';
import { playPopSound } from '../services/sound';
import { X, Award, CheckCircle, AlertCircle, RotateCcw, Heart } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: AppProgress;
  onResetProgress: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  progress,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const totalAttempts = progress.totalAttempts;
  const correctAnswers = progress.correctAnswers;
  const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
  const exploredCount = progress.exploredLetters.length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-4 border-amber-300 shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            playPopSound();
            onClose();
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="text-center mb-5">
          <div className="inline-flex p-3 bg-rose-50 text-rose-500 rounded-2xl mb-2">
            <Award size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            Laporan Belajar Anak
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            Panduan & Rekam Kemajuan Belajar untuk Guru & Orang Tua
          </p>
        </div>

        {/* Key Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-amber-50 rounded-2xl p-3.5 border-2 border-amber-200 text-center">
            <div className="text-3xl font-black text-amber-600">
              ⭐ {progress.stars}
            </div>
            <div className="text-xs font-bold text-amber-800 mt-0.5">
              Total Bintang Usaha
            </div>
          </div>

          <div className="bg-sky-50 rounded-2xl p-3.5 border-2 border-sky-200 text-center">
            <div className="text-3xl font-black text-sky-600">
              {exploredCount} / 26
            </div>
            <div className="text-xs font-bold text-sky-800 mt-0.5">
              Huruf Dikenali
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-3.5 border-2 border-emerald-200 text-center">
            <div className="text-3xl font-black text-emerald-600">
              {progress.matchedPairsCount}
            </div>
            <div className="text-xs font-bold text-emerald-800 mt-0.5">
              Pasangan Huruf Cocok
            </div>
          </div>

          <div className="bg-purple-50 rounded-2xl p-3.5 border-2 border-purple-200 text-center">
            <div className="text-3xl font-black text-purple-600">
              {accuracy}%
            </div>
            <div className="text-xs font-bold text-purple-800 mt-0.5">
              Ketepatan Menjawab
            </div>
          </div>
        </div>

        {/* Detailed 26-Letter Recognition Matrix */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black text-slate-700">
              Status 26 Huruf Alfabet:
            </h3>
            <span className="text-xs font-bold text-slate-400">
              Ketuk huruf untuk info
            </span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            {ALPHABET_DATA.map((item) => {
              const stat = progress.letterStats[item.upper];
              const isExplored = progress.exploredLetters.includes(item.upper);
              const isMastered = stat && stat.correctCount >= 2 && stat.mistakeCount <= 1;
              const needsPractice = stat && stat.mistakeCount > 1;

              let badgeBg = 'bg-white text-slate-400 border-slate-200';
              let indicator = '⚪';

              if (isMastered) {
                badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black';
                indicator = '🟢';
              } else if (needsPractice) {
                badgeBg = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
                indicator = '🟡';
              } else if (isExplored) {
                badgeBg = 'bg-sky-100 text-sky-800 border-sky-300 font-bold';
                indicator = '🔵';
              }

              return (
                <div
                  key={item.upper}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-xl border text-xs ${badgeBg}`}
                  title={`${item.upper} (${item.word}) - ${
                    isMastered ? 'Sangat dikuasai' : isExplored ? 'Sudah dikenalkan' : 'Belum dieksplorasi'
                  }`}
                >
                  <span className="text-sm font-black leading-none">{item.upper}</span>
                  <span className="text-[10px] leading-tight mt-0.5">{indicator}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3 text-[11px] font-bold text-slate-500 mt-2">
            <span>🟢 Dikuasai</span>
            <span>🔵 Dikenal</span>
            <span>🟡 Perlu Latihan</span>
            <span>⚪ Belum</span>
          </div>
        </div>

        {/* Tips for Parents & Teachers */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-left text-xs sm:text-sm text-slate-700 space-y-2 mb-6">
          <div className="flex items-center gap-1.5 font-black text-rose-600">
            <Heart size={16} />
            <span>Saran Pedagogis Usia 4 Tahun (PAUD/TK):</span>
          </div>
          <p>
            • <strong>Belajar Singkat & Santai:</strong> Cukup 5–10 menit per sesi agar anak tidak merasa lelah atau sedang diuji.
          </p>
          <p>
            • <strong>Fokus Bentuk & Bunyi:</strong> Untuk huruf seperti <em>B, D, P</em> dan <em>M, W</em>, ajak anak meraba bentuknya di udara sambil menirukan bunyi awal kata benda.
          </p>
          <p>
            • <strong>Penuh Pujian:</strong> Apresiasi setiap usaha anak dengan pelukan dan tepuk tangan!
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              playPopSound();
              if (confirm('Apakah Bunda/Guru ingin mengulang riwayat belajar dan bintang dari awal?')) {
                onResetProgress();
              }
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Reset Riwayat</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-6 py-2.5 rounded-full text-sm sm:text-base border-b-2 border-amber-600 btn-chunky cursor-pointer"
          >
            Tutup Laporan
          </button>
        </div>
      </div>
    </div>
  );
};
