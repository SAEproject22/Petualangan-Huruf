import React, { useState, useEffect } from 'react';
import { ALPHABET_DATA } from '../data/alphabet';
import { speakIndonesian, playPopSound } from '../services/sound';
import { ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';

interface MenuAProps {
  onBack: () => void;
  onExploreLetter: (upper: string) => void;
  setKikoSpeech: (text: string, mood?: 'happy' | 'cheering' | 'thinking' | 'talking') => void;
}

export const MenuA_KenalanHuruf: React.FC<MenuAProps> = ({
  onBack,
  onExploreLetter,
  setKikoSpeech,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentItem = ALPHABET_DATA[currentIndex];

  const speakCurrent = () => {
    const text = `${currentItem.upper} besar, ${currentItem.lower} kecil, ${currentItem.upper} untuk ${currentItem.word}.`;
    setKikoSpeech(text, 'talking');
    speakIndonesian(text);
  };

  useEffect(() => {
    onExploreLetter(currentItem.upper);
    speakCurrent();
  }, [currentIndex]);

  const handleNext = () => {
    playPopSound();
    setCurrentIndex((prev) => (prev + 1) % ALPHABET_DATA.length);
  };

  const handlePrev = () => {
    playPopSound();
    setCurrentIndex((prev) => (prev - 1 + ALPHABET_DATA.length) % ALPHABET_DATA.length);
  };

  const handleSelect = (idx: number) => {
    playPopSound();
    setCurrentIndex(idx);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border-3 border-amber-200 text-center">
      {/* Top Nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            playPopSound();
            onBack();
          }}
          className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-2 rounded-full font-black text-sm sm:text-base border-2 border-amber-300 btn-chunky cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Menu Utama</span>
        </button>

        <span className="text-sm sm:text-base font-black text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
          Huruf {currentIndex + 1} dari 26
        </span>
      </div>

      {/* Main Flashcard */}
      <div
        className="max-w-md mx-auto rounded-3xl p-6 sm:p-8 shadow-inner border-4 border-dashed mb-6 transition-all"
        style={{
          backgroundColor: currentItem.bgColor,
          borderColor: currentItem.borderColor,
        }}
      >
        {/* Letters Display */}
        <div
          className="text-6xl sm:text-8xl font-black tracking-widest leading-none drop-shadow-sm select-none"
          style={{ color: currentItem.color }}
        >
          {currentItem.upper} <span className="opacity-90">{currentItem.lower}</span>
        </div>

        {/* Large Object Icon */}
        <div
          onClick={() => {
            playPopSound();
            speakCurrent();
          }}
          className="text-7xl sm:text-9xl my-4 sm:my-6 cursor-pointer animate-wiggle select-none hover:scale-110 active:scale-95 transition-transform"
          title={`Ketuk untuk dengar suara ${currentItem.word}`}
        >
          {currentItem.icon}
        </div>

        {/* Object Name */}
        <div className="text-3xl sm:text-4xl font-black text-slate-800 tracking-wide mb-1">
          <span style={{ color: currentItem.color }}>{currentItem.word.charAt(0)}</span>
          {currentItem.word.slice(1)}
        </div>

        <div className="text-xs sm:text-sm font-bold text-slate-500">
          Bunyi: {currentItem.phonics}
        </div>
      </div>

      {/* Big Audio Pronunciation Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            playPopSound();
            speakCurrent();
          }}
          className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-black text-lg sm:text-xl shadow-lg border-b-4 border-emerald-700 btn-chunky cursor-pointer"
        >
          <Volume2 size={26} />
          <span>Dengarkan Suara Huruf</span>
        </button>
      </div>

      {/* Prev / Next Controls */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
        <button
          onClick={handlePrev}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center text-2xl shadow-md border-b-4 border-sky-700 btn-chunky cursor-pointer"
          title="Huruf Sebelumnya"
          aria-label="Sebelumnya"
        >
          <ArrowLeft size={28} />
        </button>

        <span className="text-xl sm:text-2xl font-black text-slate-700 w-24">
          {currentItem.upper} {currentItem.lower}
        </span>

        <button
          onClick={handleNext}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center text-2xl shadow-md border-b-4 border-sky-700 btn-chunky cursor-pointer"
          title="Huruf Selanjutnya"
          aria-label="Selanjutnya"
        >
          <ArrowRight size={28} />
        </button>
      </div>

      {/* Quick Jump Bar A-Z */}
      <div className="pt-4 border-t border-slate-100">
        <p className="text-xs sm:text-sm font-bold text-slate-500 mb-2">
          Pilih langsung huruf yang ingin dipelajari:
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-xl mx-auto">
          {ALPHABET_DATA.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.upper}
                onClick={() => handleSelect(idx)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-black text-base sm:text-lg transition-all ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-md scale-110 border-2 border-rose-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-100 border border-slate-200'
                }`}
              >
                {item.upper}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
