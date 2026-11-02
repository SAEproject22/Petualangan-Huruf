import React, { useState, useEffect } from 'react';
import { AlphabetItem } from '../types';
import { ALPHABET_DATA } from '../data/alphabet';
import {
  speakIndonesian,
  playPopSound,
  playCheerChime,
  playGentleTone,
} from '../services/sound';
import { ArrowLeft, Volume2, Sparkles } from 'lucide-react';

interface MenuCProps {
  onBack: () => void;
  onCorrectAnswer: (letter: string) => void;
  onWrongAnswer: (letter: string) => void;
  setKikoSpeech: (text: string, mood?: 'happy' | 'cheering' | 'thinking' | 'talking') => void;
  triggerConfetti: (text: string) => void;
}

export const MenuC_CariHurufGambar: React.FC<MenuCProps> = ({
  onBack,
  onCorrectAnswer,
  onWrongAnswer,
  setKikoSpeech,
  triggerConfetti,
}) => {
  const [currentQuiz, setCurrentQuiz] = useState<AlphabetItem>(ALPHABET_DATA[0]);
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);

  const generateQuestion = () => {
    const target = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
    setCurrentQuiz(target);

    // Pick 2 random distractor letters
    const options = [target.upper];
    while (options.length < 3) {
      const rand = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)].upper;
      if (!options.includes(rand)) {
        options.push(rand);
      }
    }
    setChoices(options.sort(() => 0.5 - Math.random()));
    setSelectedLetter(null);
    setMistakes(0);
    setAnsweredCorrectly(false);

    const questionSpeech = `${target.word}. Kata ${target.word} dimulai dengan huruf apa ya?`;
    setKikoSpeech(questionSpeech, 'talking');
    speakIndonesian(questionSpeech);
  };

  useEffect(() => {
    generateQuestion();
  }, [questionCount]);

  const handleSpeakObject = () => {
    playPopSound();
    const prompt = `${currentQuiz.word}. Dimulai dengan huruf apa?`;
    setKikoSpeech(prompt, 'talking');
    speakIndonesian(prompt);
  };

  const handleChoice = (letter: string) => {
    if (answeredCorrectly) return;
    playPopSound();
    setSelectedLetter(letter);

    if (letter === currentQuiz.upper) {
      // CORRECT!
      playCheerChime();
      setAnsweredCorrectly(true);
      onCorrectAnswer(currentQuiz.upper);

      const praise = `Bagus sekali! ${currentQuiz.word} dimulai dengan huruf ${currentQuiz.upper}!`;
      setKikoSpeech(praise, 'cheering');
      speakIndonesian(praise);
      triggerConfetti(`Huruf ${currentQuiz.upper} untuk ${currentQuiz.word}!`);

      setTimeout(() => {
        setQuestionCount((c) => c + 1);
      }, 1800);
    } else {
      // WRONG
      playGentleTone();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      onWrongAnswer(currentQuiz.upper);

      const gentle = `Ayo coba lagi. Dengarkan bunyinya: ${currentQuiz.word}. Bukan huruf ${letter}.`;
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

        <span className="text-sm sm:text-base font-black text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
          <Sparkles size={16} />
          <span>Soal ke-{questionCount}</span>
        </span>
      </div>

      {/* Picture Card */}
      <div
        onClick={handleSpeakObject}
        className="max-w-xs mx-auto rounded-3xl p-5 sm:p-6 mb-4 cursor-pointer hover:scale-105 active:scale-95 transition-all border-3 border-dashed"
        style={{
          backgroundColor: currentQuiz.bgColor,
          borderColor: currentQuiz.borderColor,
        }}
        title="Ketuk gambar untuk mendengar namanya"
      >
        <div className="text-7xl sm:text-9xl mb-2 animate-bounce-soft select-none">
          {currentQuiz.icon}
        </div>
        <div className="text-3xl sm:text-4xl font-black text-slate-800 tracking-wide">
          {currentQuiz.word}
        </div>
        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 mt-2">
          <Volume2 size={16} />
          <span>Sentuh untuk mendengar nama</span>
        </div>
      </div>

      {/* Question Prompt */}
      <p className="text-lg sm:text-xl font-extrabold text-slate-700 mb-6">
        Kata <strong className="text-emerald-600 underline">{currentQuiz.word}</strong> dimulai dengan huruf apa?
      </p>

      {/* 3 Letter Options */}
      <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mb-6">
        {choices.map((letter) => {
          const isCorrectTarget = letter === currentQuiz.upper;
          const isSelected = selectedLetter === letter;
          const isHinted = mistakes >= 2 && isCorrectTarget;

          let btnStyle =
            'bg-white text-slate-800 border-sky-400 hover:bg-sky-50 btn-chunky';
          if (answeredCorrectly && isCorrectTarget) {
            btnStyle = 'bg-emerald-400 text-white border-emerald-600 scale-105 shadow-lg';
          } else if (isSelected && !isCorrectTarget) {
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

      {mistakes >= 2 && !answeredCorrectly && (
        <div className="inline-block bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-full border border-emerald-300 animate-pulse">
          💡 Petunjuk: Kiko memberi tanda hijau pada huruf yang tepat!
        </div>
      )}
    </div>
  );
};
