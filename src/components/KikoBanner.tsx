import React from 'react';
import { Volume2 } from 'lucide-react';
import { playPopSound, repeatLastSpoken } from '../services/sound';

export type KikoMood = 'happy' | 'cheering' | 'thinking' | 'talking';

interface KikoBannerProps {
  speechText: string;
  mood?: KikoMood;
  soundEnabled: boolean;
  onRepeatAudio?: () => void;
}

export const KikoBanner: React.FC<KikoBannerProps> = ({
  speechText,
  mood = 'happy',
  onRepeatAudio,
}) => {
  const getKikoFace = () => {
    switch (mood) {
      case 'cheering':
        return '🐰✨';
      case 'thinking':
        return '🐰💭';
      case 'talking':
        return '🐰💬';
      case 'happy':
      default:
        return '🐰';
    }
  };

  const handleRepeat = () => {
    playPopSound();
    if (onRepeatAudio) {
      onRepeatAudio();
    } else {
      repeatLastSpoken();
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-md border-3 border-sky-200 flex items-center gap-3.5 sm:gap-4 mb-6 relative transition-all">
      {/* Animated Mascot */}
      <button
        onClick={handleRepeat}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-3xl sm:text-4xl shadow-sm shrink-0 cursor-pointer animate-bounce-soft hover:scale-105 active:scale-95 transition-transform"
        title="Ketuk Kiko untuk mendengar suaranya lagi!"
        aria-label="Kiko Kelinci"
      >
        <span>{getKikoFace()}</span>
      </button>

      {/* Speech Bubble */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="text-xs sm:text-sm font-black text-rose-500 uppercase tracking-wider mb-0.5">
          Kiko si Kelinci Berkata:
        </div>
        <div className="text-base sm:text-lg md:text-xl font-extrabold text-slate-800 leading-snug">
          "{speechText}"
        </div>
      </div>

      {/* Repeat Voice Button */}
      <button
        onClick={handleRepeat}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-white flex items-center justify-center text-xl sm:text-2xl shadow-md border-b-4 border-emerald-600 btn-chunky shrink-0"
        title="Ulangi Suara Kiko"
        aria-label="Ulangi Suara"
      >
        <Volume2 size={26} className="text-white" />
      </button>
    </div>
  );
};
