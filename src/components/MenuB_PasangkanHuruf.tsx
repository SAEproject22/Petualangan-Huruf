import React, { useState, useEffect } from 'react';
import { AlphabetItem } from '../types';
import { ALPHABET_DATA } from '../data/alphabet';
import {
  speakIndonesian,
  playPopSound,
  playCheerChime,
  playGentleTone,
  playVictoryFanfare,
} from '../services/sound';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

interface MenuBProps {
  onBack: () => void;
  onCorrectMatch: (letter: string) => void;
  onWrongAttempt: (letter: string) => void;
  setKikoSpeech: (text: string, mood?: 'happy' | 'cheering' | 'thinking' | 'talking') => void;
  triggerConfetti: (text: string) => void;
}

export const MenuB_PasangkanHuruf: React.FC<MenuBProps> = ({
  onBack,
  onCorrectMatch,
  onWrongAttempt,
  setKikoSpeech,
  triggerConfetti,
}) => {
  const [currentPairs, setCurrentPairs] = useState<AlphabetItem[]>([]);
  const [shuffledUpper, setShuffledUpper] = useState<AlphabetItem[]>([]);
  const [shuffledLower, setShuffledLower] = useState<AlphabetItem[]>([]);
  const [selectedUpper, setSelectedUpper] = useState<string | null>(null);
  const [selectedLower, setSelectedLower] = useState<string | null>(null);
  const [matchedLetters, setMatchedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [round, setRound] = useState(1);

  const initRound = () => {
    // Pick 3 random distinct letters
    const pool = [...ALPHABET_DATA].sort(() => 0.5 - Math.random()).slice(0, 3);
    setCurrentPairs(pool);
    setShuffledUpper([...pool].sort(() => 0.5 - Math.random()));
    setShuffledLower([...pool].sort(() => 0.5 - Math.random()));
    setSelectedUpper(null);
    setSelectedLower(null);
    setMatchedLetters([]);
    setMistakes(0);

    const speech = 'Sentuh satu huruf besar di kiri, lalu sentuh pasangannya di kanan ya!';
    setKikoSpeech(speech, 'talking');
    speakIndonesian(speech);
  };

  useEffect(() => {
    initRound();
  }, [round]);

  const handleSelectUpper = (upper: string) => {
    if (matchedLetters.includes(upper)) return;
    playPopSound();
    setSelectedUpper(upper);
    speakIndonesian(`Huruf besar ${upper}`);
  };

  const handleSelectLower = (lower: string) => {
    const item = currentPairs.find((p) => p.lower === lower);
    if (!item || matchedLetters.includes(item.upper)) return;
    playPopSound();
    setSelectedLower(lower);
    speakIndonesian(`Huruf kecil ${lower}`);
  };

  // Check matching whenever both are selected
  useEffect(() => {
    if (!selectedUpper || !selectedLower) return;

    if (selectedUpper.toLowerCase() === selectedLower.toLowerCase()) {
      // MATCHED!
      playCheerChime();
      const newMatched = [...matchedLetters, selectedUpper];
      setMatchedLetters(newMatched);
      onCorrectMatch(selectedUpper);
      setMistakes(0);

      const praise = `Hebat! ${selectedUpper} besar cocok dengan ${selectedLower} kecil!`;
      setKikoSpeech(praise, 'cheering');
      speakIndonesian(praise);
      triggerConfetti(`Cocok: ${selectedUpper} = ${selectedLower}!`);

      setSelectedUpper(null);
      setSelectedLower(null);

      // Check if round complete
      if (newMatched.length === currentPairs.length) {
        setTimeout(() => {
          playVictoryFanfare();
          const completeMsg = 'Luar biasa! Semua pasangan sudah benar. Ayo lanjut ronde baru!';
          setKikoSpeech(completeMsg, 'cheering');
          speakIndonesian(completeMsg);
          setTimeout(() => {
            setRound((r) => r + 1);
          }, 2000);
        }, 600);
      }
    } else {
      // MISMATCH
      playGentleTone();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      onWrongAttempt(selectedUpper);

      const gentle = `Hampir tepat! Ayo cari pasangan yang sama untuk huruf ${selectedUpper}.`;
      setKikoSpeech(gentle, 'thinking');
      speakIndonesian(gentle);

      // Clear selection after a brief delay
      setTimeout(() => {
        setSelectedUpper(null);
        setSelectedLower(null);
      }, 700);
    }
  }, [selectedUpper, selectedLower]);

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

        <span className="text-sm sm:text-base font-black text-sky-700 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200 flex items-center gap-1.5">
          <Sparkles size={16} />
          <span>Ronde {round} • Cocokkan 3 Pasang</span>
        </span>
      </div>

      <p className="text-base sm:text-lg font-extrabold text-slate-700 mb-6">
        Pasangkan huruf kapital (besar) dengan huruf kecilnya:
      </p>

      {/* Two columns for matching */}
      <div className="flex justify-center items-center gap-6 sm:gap-14 max-w-lg mx-auto mb-8">
        {/* Left: Upper case */}
        <div className="flex flex-col gap-4">
          <div className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider">
            Huruf Besar
          </div>
          {shuffledUpper.map((item) => {
            const isMatched = matchedLetters.includes(item.upper);
            const isSelected = selectedUpper === item.upper;

            return (
              <button
                key={`upper-${item.upper}`}
                disabled={isMatched}
                onClick={() => handleSelectUpper(item.upper)}
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl font-black text-4xl sm:text-5xl flex items-center justify-center transition-all border-4 shadow-md ${
                  isMatched
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-400 opacity-60 shadow-none cursor-default'
                    : isSelected
                    ? 'bg-amber-100 text-amber-900 border-amber-400 scale-105 shadow-lg'
                    : 'bg-white text-slate-800 border-sky-300 hover:border-sky-400 btn-chunky'
                }`}
              >
                {isMatched ? (
                  <div className="flex flex-col items-center">
                    <span>{item.upper}</span>
                    <Check size={20} className="text-emerald-600" />
                  </div>
                ) : (
                  item.upper
                )}
              </button>
            );
          })}
        </div>

        <div className="text-3xl text-slate-300 font-black">↔️</div>

        {/* Right: Lower case */}
        <div className="flex flex-col gap-4">
          <div className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider">
            Huruf Kecil
          </div>
          {shuffledLower.map((item) => {
            const isMatched = matchedLetters.includes(item.upper);
            const isSelected = selectedLower === item.lower;
            // Adaptive hint if mistakes >= 2 and user selected an upper case letter
            const isHinted =
              mistakes >= 2 &&
              selectedUpper !== null &&
              selectedUpper.toLowerCase() === item.lower;

            return (
              <button
                key={`lower-${item.lower}`}
                disabled={isMatched}
                onClick={() => handleSelectLower(item.lower)}
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl font-black text-4xl sm:text-5xl flex items-center justify-center transition-all border-4 shadow-md ${
                  isMatched
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-400 opacity-60 shadow-none cursor-default'
                    : isSelected
                    ? 'bg-amber-100 text-amber-900 border-amber-400 scale-105 shadow-lg'
                    : isHinted
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-400 highlight-hint scale-105'
                    : 'bg-white text-slate-800 border-purple-300 hover:border-purple-400 btn-chunky'
                }`}
              >
                {isMatched ? (
                  <div className="flex flex-col items-center">
                    <span>{item.lower}</span>
                    <Check size={20} className="text-emerald-600" />
                  </div>
                ) : (
                  item.lower
                )}
              </button>
            );
          })}
        </div>
      </div>

      {mistakes >= 2 && (
        <div className="inline-block bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-full border border-emerald-300 mb-4 animate-pulse">
          💡 Petunjuk: Kiko memberi kilauan hijau pada huruf pasangan yang benar!
        </div>
      )}
    </div>
  );
};
