import React from 'react';
import { Volume2, VolumeX, BarChart2, HelpCircle, Share2 } from 'lucide-react';
import { playPopSound } from '../services/sound';

interface HeaderProps {
  stars: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenReport: () => void;
  onOpenGuide: () => void;
  onOpenShare: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stars,
  soundEnabled,
  onToggleSound,
  onOpenReport,
  onOpenGuide,
  onOpenShare,
  onGoHome,
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-md px-4 py-3 sm:py-3.5 shadow-sm sticky top-0 z-40 border-b border-sky-200/80">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => {
            playPopSound();
            onGoHome();
          }}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer text-left focus:outline-none group"
          title="Kembali ke Menu Utama"
        >
          <div className="text-3xl sm:text-4xl filter drop-shadow transition-transform group-hover:scale-110 group-active:scale-95">
            🐰
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-rose-500 tracking-tight leading-none">
              HURUF AJAIB
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-700/80">
              Belajar Ceria PAUD/TK
            </p>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Star Counter */}
          <div
            className="flex items-center gap-1.5 sm:gap-2 bg-amber-50 border-2 border-amber-300 text-amber-800 px-3.5 py-1.5 rounded-full font-black text-base sm:text-lg shadow-sm"
            title="Total Bintang Kamu"
          >
            <span className="text-amber-500 text-lg sm:text-xl">⭐</span>
            <span>{stars}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              playPopSound();
              onToggleSound();
            }}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
              soundEnabled
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
            } btn-chunky`}
            title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            aria-label="Toggle Audio"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              playPopSound();
              onOpenShare();
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-sky-100 text-sky-800 hover:bg-sky-200 flex items-center justify-center btn-chunky"
            title="Bagikan Tautan ke Siswa / WhatsApp"
            aria-label="Bagikan"
          >
            <Share2 size={20} />
          </button>

          {/* Report Button */}
          <button
            onClick={() => {
              playPopSound();
              onOpenReport();
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-violet-100 text-violet-800 hover:bg-violet-200 flex items-center justify-center btn-chunky"
            title="Laporan Belajar Anak"
            aria-label="Laporan Belajar"
          >
            <BarChart2 size={20} />
          </button>

          {/* Guide Button */}
          <button
            onClick={() => {
              playPopSound();
              onOpenGuide();
            }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 flex items-center justify-center btn-chunky"
            title="Petunjuk Belajar"
            aria-label="Petunjuk"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};
