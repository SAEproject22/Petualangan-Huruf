import React, { useState, useEffect } from 'react';
import { ConfusingGroup, CONFUSING_LETTER_GROUPS } from '../data/alphabet';
import {
  speakIndonesian,
  playPopSound,
  playCheerChime,
  playGentleTone,
} from '../services/sound';
import { ArrowLeft, Sparkles, Volume2 } from 'lucide-react';

interface MenuDProps {
  onBack: () => void;
  onCorrectAnswer: (letter: string) => void;
  onWrongAnswer: (letter: string) => void;
  setKikoSpeech: (text: string, mood?: 'happy' | 'cheering' | 'thinking' | 'talking') => void;
  triggerConfetti: (text: string) => void;
}

export const MenuD_HurufAwalApa: React.FC<MenuDProps> = ({
  onBack,
  onCorrectAnswer,
  onWrongAnswer,
  setKikoSpeech,
  triggerConfetti,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);

  const currentQuiz: ConfusingGroup = CONFUSING_LETTER_GROUPS[currentIndex % CONFUSING_LETTER_GROUPS.length];

  const setupRound = () => {
    setShuffledChoices([...currentQuiz.choices].sort(() => 0.5 - Math.random()));
    setSelected(null);
    setMistakes(0);
    setAnsweredCorrectly(false);

    const prompt = `Huruf awal apa untuk gambar ${currentQuiz.target}? Hati-hati ya, perhatikan bentuk hurufnya!`;
    setKikoSpeech(prompt, 'talking');
    speakIndonesian(prompt);
  };

  useEffect(() => {
    setupRound();
  }, [currentIndex]);

  const handleSpeakObject = () => {
    playPopSound();
    const prompt = `Ini ${currentQuiz.target}. Huruf awal apa yang tepat?`;
    setKikoSpeech(prompt, 'talking');
    speakIndonesian(prompt);
  };

  const handleSelect = (letter: string) => {
    if (answeredCorrectly) return;
    playPopSound();
    setSelected(letter);

    if (letter === currentQuiz.initial) {
      // CORRECT
      playCheerChime();
      setAnsweredCorrectly(true);
      onCorrectAnswer(currentQuiz.initial);

      const praise = `Tepat sekali! Huruf ${currentQuiz.initial} untuk ${currentQuiz.target}! ${currentQuiz.explanation}`;
      setKikoSpeech(praise, 'cheering');
      speakIndonesian(praise);
      triggerConfetti(`Benar! Huruf ${currentQuiz.initial}!`);

      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
      }, 2200);
    } else {
      // WRONG
      playGentleTone();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      onWrongAnswer(currentQuiz.initial);

      const gentle = `Ayo dengarkan lagi: ${currentQuiz.target}. Bukan huruf ${letter}. Coba perhatikan lengkungannya ya.`;
      setKikoSpeech(gentle, 'thinking');
      speakIndonesian(gentle);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border-3 border-amber-200 text-center">
      {/* Top Header */}
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

        <span className="text-sm sm:text-base font-black text-rose-700 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200 flex items-center gap-1.5">
          <Sparkles size={16} />
          <span>Latihan B, D, P & Huruf Mirip</span>
        </span>
      </div>

      {/* Picture Card */}
      <div
        onClick={handleSpeakObject}
        className="max-w-xs mx-auto bg-rose-50 border-3 border-dashed border-rose-300 rounded-3xl p-5 sm:p-6 mb-4 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        title="Ketuk gambar untuk mendengar namanya"
      >
        <div className="text-7xl sm:text-9xl mb-2 animate-bounce-soft select-none">
          {currentQuiz.icon}
        </div>
        <div className="text-3xl sm:text-4xl font-black text-slate-800 tracking-wide">
          {currentQuiz.target}
        </div>
        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 mt-2">
          <Volume2 size={16} />
          <span>Sentuh untuk mendengar nama benda</span>
        </div>
      </div>

      {/* Question Prompt */}
      <p className="text-lg sm:text-xl font-extrabold text-slate-700 mb-6">
        Pilih huruf awal untuk gambar <strong className="text-rose-600 underline">{currentQuiz.target}</strong>:
      </p>

      {/* Choices */}
      <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mb-6">
        {shuffledChoices.map((letter) => {
          const isTarget = letter === currentQuiz.initial;
          const isSelected = selected === letter;
          const isHinted = mistakes >= 2 && isTarget;

          let btnStyle =
            'bg-white text-slate-800 border-rose-300 hover:bg-rose-50 btn-chunky';
          if (answeredCorrectly && isTarget) {
            btnStyle = 'bg-emerald-400 text-white border-emerald-600 scale-105 shadow-lg';
          } else if (isSelected && !isTarget) {
            btnStyle = 'bg-amber-100 text-amber-800 border-amber-300';
          } else if (isHinted) {
            btnStyle = 'bg-emerald-50 text-emerald-800 border-emerald-500 highlight-hint';
          }

          return (
            <button
              key={letter}
              onClick={() => handleSelect(letter)}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl font-black text-4xl sm:text-5xl flex items-center justify-center border-4 shadow-md transition-all ${btnStyle}`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {answeredCorrectly && (
        <div className="bg-amber-50 text-amber-900 text-sm sm:text-base font-bold p-3.5 rounded-2xl border-2 border-amber-300 max-w-md mx-auto mb-4 animate-fade-in">
          💡 {currentQuiz.explanation}
        </div>
      )}

      {mistakes >= 2 && !answeredCorrectly && (
        <div className="inline-block bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-full border border-emerald-300 animate-pulse">
          💡 Kiko memberi bantuan cahaya hijau pada huruf yang benar!
        </div>
      )}
    </div>
  );
};
