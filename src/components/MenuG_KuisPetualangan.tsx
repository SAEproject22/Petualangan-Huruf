import React, { useState, useEffect } from 'react';
import { AlphabetItem } from '../types';
import { ALPHABET_DATA, CONFUSING_LETTER_GROUPS } from '../data/alphabet';
import {
  speakIndonesian,
  playPopSound,
  playCheerChime,
  playGentleTone,
  playVictoryFanfare,
} from '../services/sound';
import { ArrowLeft, Trophy, Star, Sparkles, Volume2 } from 'lucide-react';

interface MenuGProps {
  onBack: () => void;
  onCorrectAnswer: (letter: string) => void;
  onWrongAnswer: (letter: string) => void;
  currentLevel: number;
  onAdvanceLevel: () => void;
  setKikoSpeech: (text: string, mood?: 'happy' | 'cheering' | 'thinking' | 'talking') => void;
  triggerConfetti: (text: string) => void;
}

type QuizType = 'initial_from_image' | 'confusing_pair' | 'find_capital' | 'detective_image';

export const MenuG_KuisPetualangan: React.FC<MenuGProps> = ({
  onBack,
  onCorrectAnswer,
  onWrongAnswer,
  currentLevel,
  onAdvanceLevel,
  setKikoSpeech,
  triggerConfetti,
}) => {
  const [stage, setStage] = useState(1);
  const [quizType, setQuizType] = useState<QuizType>('initial_from_image');
  const [targetItem, setTargetItem] = useState<AlphabetItem>(ALPHABET_DATA[0]);
  const [choices, setChoices] = useState<string[]>([]);
  const [pictureChoices, setPictureChoices] = useState<AlphabetItem[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  const initQuizForStage = () => {
    const types: QuizType[] = [
      'initial_from_image',
      'find_capital',
      'confusing_pair',
      'detective_image',
    ];
    const chosenType = types[(stage - 1) % types.length];
    setQuizType(chosenType);
    setSelectedAnswer(null);
    setMistakes(0);
    setAnsweredCorrectly(false);

    if (chosenType === 'initial_from_image') {
      const item = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
      setTargetItem(item);
      const opts = [item.upper];
      while (opts.length < 3) {
        const r = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)].upper;
        if (!opts.includes(r)) opts.push(r);
      }
      setChoices(opts.sort(() => 0.5 - Math.random()));
      const prompt = `Tantangan Petualangan! Kata ${item.word} dimulai dengan huruf apa?`;
      setKikoSpeech(prompt, 'talking');
      speakIndonesian(prompt);
    } else if (chosenType === 'find_capital') {
      const item = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
      setTargetItem(item);
      const opts = [item.upper];
      while (opts.length < 3) {
        const r = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)].upper;
        if (!opts.includes(r)) opts.push(r);
      }
      setChoices(opts.sort(() => 0.5 - Math.random()));
      const prompt = `Ini huruf kecil ${item.lower}. Mana huruf kapitalnya?`;
      setKikoSpeech(prompt, 'talking');
      speakIndonesian(prompt);
    } else if (chosenType === 'confusing_pair') {
      const group = CONFUSING_LETTER_GROUPS[Math.floor(Math.random() * CONFUSING_LETTER_GROUPS.length)];
      const item = ALPHABET_DATA.find((a) => a.upper === group.initial) || ALPHABET_DATA[0];
      setTargetItem({ ...item, word: group.target, icon: group.icon });
      setChoices([...group.choices].sort(() => 0.5 - Math.random()));
      const prompt = `Tebak huruf awal untuk gambar ${group.target}!`;
      setKikoSpeech(prompt, 'talking');
      speakIndonesian(prompt);
    } else if (chosenType === 'detective_image') {
      const item = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
      setTargetItem(item);
      const pool = [item];
      while (pool.length < 3) {
        const r = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
        if (!pool.some((p) => p.upper === r.upper)) pool.push(r);
      }
      setPictureChoices(pool.sort(() => 0.5 - Math.random()));
      const prompt = `Detektif! Temukan gambar yang dimulai huruf ${item.upper}!`;
      setKikoSpeech(prompt, 'talking');
      speakIndonesian(prompt);
    }
  };

  useEffect(() => {
    initQuizForStage();
  }, [stage, currentLevel]);

  const handleCorrect = () => {
    playCheerChime();
    setAnsweredCorrectly(true);
    onCorrectAnswer(targetItem.upper);

    triggerConfetti(`Hebat! Tantangan ${stage} Selesai!`);
    const praise = `Luar biasa! Jawabanmu tepat sekali!`;
    setKikoSpeech(praise, 'cheering');
    speakIndonesian(praise);

    setTimeout(() => {
      if (stage >= 5) {
        // Completed 5 stages: LEVEL UP!
        playVictoryFanfare();
        setShowLevelUpModal(true);
        onAdvanceLevel();
      } else {
        setStage((s) => s + 1);
      }
    }, 1800);
  };

  const handleWrong = (selected: string) => {
    playGentleTone();
    const newMistakes = mistakes + 1;
    setMistakes(newMistakes);
    onWrongAnswer(targetItem.upper);

    const gentle = `Ayo coba lagi teman. Dengarkan baik-baik ya.`;
    setKikoSpeech(gentle, 'thinking');
    speakIndonesian(gentle);
  };

  const handleNextLevel = () => {
    playPopSound();
    setShowLevelUpModal(false);
    setStage(1);
    initQuizForStage();
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border-3 border-amber-200 text-center relative">
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

        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base font-black text-amber-900 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-300 flex items-center gap-1.5">
            <Trophy size={16} className="text-amber-600" />
            <span>Level {currentLevel}</span>
          </span>
          <span className="text-sm sm:text-base font-black text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            Tantangan {stage}/5
          </span>
        </div>
      </div>

      {/* Level Progress Stepper */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
        {[1, 2, 3, 4, 5].map((stg) => {
          const isDone = stg < stage;
          const isCurrent = stg === stage;
          return (
            <div
              key={stg}
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-black text-sm sm:text-base transition-all ${
                isDone
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : isCurrent
                  ? 'bg-amber-400 text-amber-950 scale-110 shadow-md border-2 border-amber-200 animate-pulse'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {isDone ? '⭐' : stg}
            </div>
          );
        })}
      </div>

      {/* QUIZ CONTENT BY TYPE */}
      {quizType === 'initial_from_image' && (
        <div>
          <div className="max-w-xs mx-auto bg-amber-50 border-3 border-dashed border-amber-300 rounded-3xl p-5 mb-4">
            <div className="text-7xl sm:text-8xl mb-2 animate-bounce-soft select-none">
              {targetItem.icon}
            </div>
            <div className="text-3xl font-black text-slate-800">{targetItem.word}</div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-700 mb-6">
            Kata <strong className="text-amber-600 underline">{targetItem.word}</strong> dimulai dengan huruf apa?
          </p>
          <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mb-6">
            {choices.map((letter) => {
              const isTarget = letter === targetItem.upper;
              const isSelected = selectedAnswer === letter;
              const isHinted = mistakes >= 2 && isTarget;
              return (
                <button
                  key={letter}
                  onClick={() => {
                    playPopSound();
                    setSelectedAnswer(letter);
                    if (letter === targetItem.upper) handleCorrect();
                    else handleWrong(letter);
                  }}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl font-black text-4xl sm:text-5xl flex items-center justify-center border-4 shadow-md transition-all ${
                    answeredCorrectly && isTarget
                      ? 'bg-emerald-400 text-white border-emerald-600 scale-105'
                      : isSelected && !isTarget
                      ? 'bg-rose-100 text-rose-700 border-rose-300'
                      : isHinted
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-500 highlight-hint'
                      : 'bg-white text-slate-800 border-amber-300 hover:bg-amber-50 btn-chunky'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {quizType === 'find_capital' && (
        <div>
          <div className="max-w-xs mx-auto bg-purple-50 border-4 border-dashed border-purple-300 rounded-3xl p-5 mb-4">
            <div className="text-xs font-black text-purple-600 uppercase tracking-wider mb-1">
              Huruf Kecil:
            </div>
            <div className="text-7xl sm:text-8xl font-black text-purple-700 leading-none select-none my-2">
              {targetItem.lower}
            </div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-700 mb-6">
            Mana huruf <strong className="text-purple-600 uppercase">KAPITAL</strong> untuk huruf di atas?
          </p>
          <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mb-6">
            {choices.map((letter) => {
              const isTarget = letter === targetItem.upper;
              const isSelected = selectedAnswer === letter;
              const isHinted = mistakes >= 2 && isTarget;
              return (
                <button
                  key={letter}
                  onClick={() => {
                    playPopSound();
                    setSelectedAnswer(letter);
                    if (letter === targetItem.upper) handleCorrect();
                    else handleWrong(letter);
                  }}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl font-black text-4xl sm:text-5xl flex items-center justify-center border-4 shadow-md transition-all ${
                    answeredCorrectly && isTarget
                      ? 'bg-emerald-400 text-white border-emerald-600 scale-105'
                      : isSelected && !isTarget
                      ? 'bg-rose-100 text-rose-700 border-rose-300'
                      : isHinted
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-500 highlight-hint'
                      : 'bg-white text-slate-800 border-purple-300 hover:bg-purple-50 btn-chunky'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {quizType === 'confusing_pair' && (
        <div>
          <div className="max-w-xs mx-auto bg-rose-50 border-3 border-dashed border-rose-300 rounded-3xl p-5 mb-4">
            <div className="text-7xl sm:text-8xl mb-2 animate-bounce-soft select-none">
              {targetItem.icon}
            </div>
            <div className="text-3xl font-black text-slate-800">{targetItem.word}</div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-700 mb-6">
            Pilih huruf awal untuk gambar <strong className="text-rose-600 underline">{targetItem.word}</strong>:
          </p>
          <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mb-6">
            {choices.map((letter) => {
              const isTarget = letter === targetItem.upper;
              const isSelected = selectedAnswer === letter;
              const isHinted = mistakes >= 2 && isTarget;
              return (
                <button
                  key={letter}
                  onClick={() => {
                    playPopSound();
                    setSelectedAnswer(letter);
                    if (letter === targetItem.upper) handleCorrect();
                    else handleWrong(letter);
                  }}
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl font-black text-4xl sm:text-5xl flex items-center justify-center border-4 shadow-md transition-all ${
                    answeredCorrectly && isTarget
                      ? 'bg-emerald-400 text-white border-emerald-600 scale-105'
                      : isSelected && !isTarget
                      ? 'bg-rose-100 text-rose-700 border-rose-300'
                      : isHinted
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-500 highlight-hint'
                      : 'bg-white text-slate-800 border-rose-300 hover:bg-rose-50 btn-chunky'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {quizType === 'detective_image' && (
        <div>
          <div className="max-w-xs mx-auto bg-teal-50 border-4 border-dashed border-teal-300 rounded-3xl p-5 mb-4">
            <div className="text-xs font-black text-teal-700 uppercase tracking-wider mb-1">
              Cari Gambar Berawalan:
            </div>
            <div className="text-7xl sm:text-8xl font-black text-teal-600 leading-none select-none my-2">
              {targetItem.upper}
            </div>
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-slate-700 mb-6">
            Sentuh gambar yang namanya dimulai dengan huruf <strong className="text-teal-600 text-2xl font-black">{targetItem.upper}</strong>:
          </p>
          <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mb-6">
            {pictureChoices.map((item) => {
              const isTarget = item.upper === targetItem.upper;
              const isSelected = selectedAnswer === item.upper;
              const isHinted = mistakes >= 2 && isTarget;
              return (
                <button
                  key={item.upper}
                  onClick={() => {
                    playPopSound();
                    setSelectedAnswer(item.upper);
                    if (item.upper === targetItem.upper) handleCorrect();
                    else handleWrong(item.upper);
                  }}
                  className={`w-32 h-36 sm:w-36 sm:h-40 rounded-3xl flex flex-col items-center justify-center p-3 border-4 shadow-md transition-all ${
                    answeredCorrectly && isTarget
                      ? 'bg-emerald-100 border-emerald-500 scale-105'
                      : isSelected && !isTarget
                      ? 'bg-rose-50 border-rose-300'
                      : isHinted
                      ? 'bg-emerald-50 border-emerald-500 highlight-hint'
                      : 'bg-white border-teal-300 hover:bg-teal-50 btn-chunky'
                  }`}
                >
                  <div className="text-5xl sm:text-6xl mb-1">{item.icon}</div>
                  <div className="text-base sm:text-lg font-black text-slate-800">{item.word}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mistakes >= 2 && !answeredCorrectly && (
        <div className="inline-block bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-full border border-emerald-300 animate-pulse">
          💡 Petunjuk: Kiko memberi cahaya hijau pada jawaban yang tepat!
        </div>
      )}

      {/* LEVEL UP MODAL */}
      {showLevelUpModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center border-4 border-amber-300 shadow-2xl">
            <div className="text-6xl mb-3 animate-bounce">🏆</div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-600 mb-2">
              Hore! Naik Level!
            </h3>
            <p className="text-slate-600 font-bold text-sm sm:text-base mb-6">
              Kamu berhasil menyelesaikan semua 5 tantangan petualangan di Level {currentLevel}! Kiko sangat bangga padamu!
            </p>
            <button
              onClick={handleNextLevel}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 px-6 rounded-2xl text-lg shadow-md border-b-4 border-emerald-700 btn-chunky cursor-pointer"
            >
              Lanjut ke Level {currentLevel + 1}! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
