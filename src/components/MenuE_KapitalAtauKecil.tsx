import React, { useState, useEffect } from 'react';
import { AlphabetItem } from '../types';
import { ALPHABET_DATA } from '../data/alphabet';
import {
  speakIndonesian,
  playPopSound,
  playCheerChime,
  playGentleTone,
} from '../services/sound';
import { ArrowLeft, Sparkles, Volume2 } from 'lucide-react';

interface MenuEProps {
  onBack: () => void;
  onCorrectAnswer: (letter: string) => void;
  onWrongAnswer: (letter: string) => void;
  setKikoSpeech: (text: string, mood?: 'happy' | 'cheering' | 'thinking' | 'talking') => void;
  triggerConfetti: (text: string) => void;
}

export const MenuE_KapitalAtauKecil: React.FC<MenuEProps> = ({
  onBack,
  onCorrectAnswer,
  onWrongAnswer,
  setKikoSpeech,
  triggerConfetti,
}) => {
  const [currentQuiz, setCurrentQuiz] = useState<AlphabetItem>(ALPHABET_DATA[0]);
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);

  const generateQuestion = () => {
    const target = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
    setCurrentQuiz(target);

    // Pick 2 random uppercase letters
    const options = [target.upper];
    while (options.length < 3) {
      const rand = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)].upper;
      if (!options.includes(rand)) {
        options.push(rand);
      }
    }
    setChoices(options.sort(() => 0.5 - Math.random()));
    setSelected(null);
    setMistakes(0);
    setAnsweredCorrectly(false);

    const prompt = `Ini adalah huruf kecil ${target.lower}. Mana pasangan huruf kapital besarnya?`;
    setKikoSpeech(prompt, 'talking');
    speakIndonesian(prompt);
  };

  useEffect(() => {
    generateQuestion();
  }, [questionCount]);

  const handleSpeakLetter = () => {
    playPopSound();
    const prompt = `Ini huruf kecil ${currentQuiz.lower}. Ayo cari huruf kapitalnya!`;
    setKikoSpeech(prompt, 'talking');
    speakIndonesian(prompt);
  };

  const handleChoice = (letter: string) => {
    if (answeredCorrectly) return;
    playPopSound();
    setSelected(letter);

    if (letter === currentQuiz.upper) {
      // CORRECT
      playCheerChime();
      setAnsweredCorrectly(true);
      onCorrectAnswer(currentQuiz.upper);

      const praise = `Pintar sekali! Pasangan huruf kecil ${currentQuiz.lower} adalah ${currentQuiz.upper} besar! (${currentQuiz.upper} untuk ${currentQuiz.word})`;
      setKikoSpeech(praise, 'cheering');
      speakIndonesian(praise);
      triggerConfetti(`${currentQuiz.upper} besar cocok dengan ${currentQuiz.lower}!`);

      setTimeout(() => {
        setQuestionCount((c) => c + 1);
      }, 1800);
    } else {
      // WRONG
      playGentleTone();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      onWrongAnswer(currentQuiz.upper);

      const gentle = `Ayo coba cari lagi. Cari bentuk kapital yang sama untuk huruf ${currentQuiz.lower}.`;
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

        <span className="text-sm sm:text-base font-black text-purple-800 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200 flex items-center gap-1.5">
          <Sparkles size={16} />
          <span>Latihan Huruf Kapital & Kecil</span>
        </span>
      </div>

      {/* Target Lowercase Letter Display */}
      <div
        onClick={handleSpeakLetter}
        className="max-w-xs mx-auto bg-purple-50 border-4 border-dashed border-purple-300 rounded-3xl p-5 sm:p-7 mb-4 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        title="Ketuk untuk mendengar suara huruf"
      >
        <div className="text-xs sm:text-sm font-black text-purple-600 uppercase tracking-wider mb-1">
          Ini Huruf Kecil:
        </div>
        <div className="text-7xl sm:text-9xl font-black text-purple-700 leading-none select-none my-2 drop-shadow-sm">
          {currentQuiz.lower}
        </div>
        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 mt-2">
          <Volume2 size={16} />
          <span>Sentuh untuk mendengar bunyi</span>
        </div>
      </div>

      {/* Prompt */}
      <p className="text-lg sm:text-xl font-extrabold text-slate-700 mb-6">
        Mana pasangan huruf <strong className="text-purple-600 uppercase text-2xl font-black">KAPITAL (BESAR)</strong>-nya?
      </p>

      {/* 3 Choices */}
      <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mb-6">
        {choices.map((letter) => {
          const isTarget = letter === currentQuiz.upper;
          const isSelected = selected === letter;
          const isHinted = mistakes >= 2 && isTarget;

          let btnStyle =
            'bg-white text-slate-800 border-purple-300 hover:bg-purple-50 btn-chunky';
          if (answeredCorrectly && isTarget) {
            btnStyle = 'bg-emerald-400 text-white border-emerald-600 scale-105 shadow-lg';
          } else if (isSelected && !isTarget) {
            btnStyle = 'bg-rose-100 text-rose-700 border-rose-300';
          } else if (isHinted) {
            btnStyle = 'bg-emerald-50 text-emerald-800 border-emerald-500 highlight-hint';
          }

          return (
            <button
              key={letter}
              onClick={() => handleChoice(letter)}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl font-black text-4xl sm:text-5xl flex items-center justify-center border-4 shadow-md transition-all ${btnStyle}`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {answeredCorrectly && (
        <div className="text-base sm:text-lg font-black text-emerald-700 bg-emerald-50 py-2.5 px-4 rounded-2xl border border-emerald-200 inline-block animate-bounce">
          🎉 {currentQuiz.upper} besar dan {currentQuiz.lower} kecil ({currentQuiz.word})!
        </div>
      )}

      {mistakes >= 2 && !answeredCorrectly && (
        <div className="inline-block bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-full border border-emerald-300 animate-pulse">
          💡 Petunjuk: Kiko memberi cahaya hijau pada huruf kapital yang cocok!
        </div>
      )}
    </div>
  );
};
