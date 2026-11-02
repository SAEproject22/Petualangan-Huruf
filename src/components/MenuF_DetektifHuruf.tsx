import React, { useState, useEffect, useRef } from 'react';
import { AlphabetItem } from '../types';
import { ALPHABET_DATA } from '../data/alphabet';
import {
  speakIndonesian,
  playPopSound,
  playCheerChime,
  playGentleTone,
} from '../services/sound';
import { ArrowLeft, Sparkles, Volume2 } from 'lucide-react';

interface MenuFProps {
  onBack: () => void;
  onCorrectAnswer: (letter: string) => void;
  onWrongAnswer: (letter: string) => void;
  setKikoSpeech: (text: string, mood?: 'happy' | 'cheering' | 'thinking' | 'talking') => void;
  triggerConfetti: (text: string) => void;
}

export const MenuF_DetektifHuruf: React.FC<MenuFProps> = ({
  onBack,
  onCorrectAnswer,
  onWrongAnswer,
  setKikoSpeech,
  triggerConfetti,
}) => {
  const getRandomTarget = () => ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];

  const getOptionsForTarget = (target: AlphabetItem) => {
    const pool = [target];
    while (pool.length < 3) {
      const rand = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
      if (!pool.some((p) => p.upper === rand.upper)) {
        pool.push(rand);
      }
    }
    return pool.sort(() => 0.5 - Math.random());
  };

  const [targetItem, setTargetItem] = useState<AlphabetItem>(getRandomTarget);
  const [pictureOptions, setPictureOptions] = useState<AlphabetItem[]>(() => getOptionsForTarget(targetItem));
  const [selectedUpper, setSelectedUpper] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const generateMission = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const target = getRandomTarget();
    setTargetItem(target);
    setPictureOptions(getOptionsForTarget(target));
    setSelectedUpper(null);
    setMistakes(0);
    setAnsweredCorrectly(false);

    const speech = `Misi Detektif Cilik! Temukan gambar yang namanya dimulai dengan huruf ${target.upper}!`;
    setKikoSpeech(speech, 'talking');
    speakIndonesian(speech);
  };

  useEffect(() => {
    if (questionCount > 1) {
      generateMission();
    } else {
      const speech = `Misi Detektif Cilik! Temukan gambar yang namanya dimulai dengan huruf ${targetItem.upper}!`;
      setKikoSpeech(speech, 'talking');
      speakIndonesian(speech);
    }
  }, [questionCount]);

  const handleRepeatMission = () => {
    playPopSound();
    const prompt = `Temukan gambar yang dimulai dengan huruf ${targetItem.upper}!`;
    setKikoSpeech(prompt, 'talking');
    speakIndonesian(prompt);
  };

  const handleSelectPicture = (item: AlphabetItem) => {
    if (answeredCorrectly) return;
    playPopSound();
    setSelectedUpper(item.upper);

    if (item.upper === targetItem.upper) {
      // CORRECT
      playCheerChime();
      setAnsweredCorrectly(true);
      onCorrectAnswer(targetItem.upper);

      const praise = `Luar biasa Detektif! ${item.word} dimulai dengan huruf ${targetItem.upper}!`;
      setKikoSpeech(praise, 'cheering');
      speakIndonesian(praise);
      triggerConfetti(`Detektif Hebat! ${item.word}!`);

      timerRef.current = setTimeout(() => {
        setQuestionCount((q) => q + 1);
      }, 1900);
    } else {
      // WRONG
      playGentleTone();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      onWrongAnswer(targetItem.upper);

      const gentle = `Itu gambar ${item.word}, dimulai dengan huruf ${item.upper}. Ayo cari gambar berawalan huruf ${targetItem.upper}.`;
      setKikoSpeech(gentle, 'thinking');
      speakIndonesian(gentle);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-lg border-3 border-sky-200 text-center">
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

        <span className="text-sm sm:text-base font-black text-teal-800 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200 flex items-center gap-1.5">
          <Sparkles size={16} />
          <span>Misi Detektif #{questionCount}</span>
        </span>
      </div>

      {/* Target Letter Display */}
      <div
        onClick={handleRepeatMission}
        className="max-w-xs mx-auto bg-teal-50 border-4 border-dashed border-teal-300 rounded-3xl p-5 mb-4 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        title="Ketuk untuk dengar suara huruf yang dicari"
      >
        <div className="text-xs sm:text-sm font-black text-teal-700 uppercase tracking-wider mb-1">
          Misi: Cari Gambar Berawalan Huruf:
        </div>
        <div className="text-7xl sm:text-9xl font-black text-teal-600 leading-none select-none my-2 drop-shadow-sm">
          {targetItem.upper}
        </div>
        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 mt-2">
          <Volume2 size={16} />
          <span>Sentuh untuk mengulang misi</span>
        </div>
      </div>

      <p className="text-lg sm:text-xl font-extrabold text-slate-700 mb-6">
        Pilih salah satu gambar di bawah yang namanya diawali huruf <strong className="text-teal-600 text-2xl font-black">{targetItem.upper}</strong>:
      </p>

      {/* 3 Picture Choices */}
      <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mb-6">
        {pictureOptions.map((item) => {
          const isTarget = item.upper === targetItem.upper;
          const isSelected = selectedUpper === item.upper;
          const isHinted = mistakes >= 2 && isTarget;

          let btnStyle =
            'bg-white border-teal-300 hover:bg-teal-50 btn-chunky';
          if (answeredCorrectly && isTarget) {
            btnStyle = 'bg-emerald-100 border-emerald-500 scale-105 shadow-lg';
          } else if (isSelected && !isTarget) {
            btnStyle = 'bg-rose-50 border-rose-300';
          } else if (isHinted) {
            btnStyle = 'bg-emerald-50 border-emerald-500 highlight-hint';
          }

          return (
            <button
              key={item.upper}
              disabled={answeredCorrectly}
              onClick={() => handleSelectPicture(item)}
              className={`w-32 h-36 sm:w-36 sm:h-40 rounded-3xl flex flex-col items-center justify-center p-3 border-4 shadow-md transition-all cursor-pointer ${btnStyle}`}
              title={item.word}
            >
              <div className="text-5xl sm:text-6xl mb-1 select-none animate-bounce-soft">
                {item.icon}
              </div>
              <div className="text-base sm:text-lg font-black text-slate-800">
                {item.word}
              </div>
            </button>
          );
        })}
      </div>

      {answeredCorrectly && (
        <div className="text-base sm:text-lg font-black text-emerald-700 bg-emerald-50 py-2.5 px-4 rounded-2xl border border-emerald-200 inline-block animate-bounce">
          🎉 Hebat! "{targetItem.word}" diawali dengan huruf {targetItem.upper}!
        </div>
      )}

      {mistakes >= 2 && !answeredCorrectly && (
        <div className="inline-block bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-full border border-emerald-300 animate-pulse">
          💡 Petunjuk Detektif: Kiko memberi cahaya hijau pada gambar yang tepat!
        </div>
      )}
    </div>
  );
};
