/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, AppProgress } from './types';
import { loadStoredProgress, saveStoredProgress, clearStoredProgress } from './services/storage';
import {
  initAudioContext,
  setMuteState,
  speakIndonesian,
  repeatLastSpoken,
} from './services/sound';
import { Header } from './components/Header';
import { KikoBanner, KikoMood } from './components/KikoBanner';
import { Dashboard } from './components/Dashboard';
import { MenuA_KenalanHuruf } from './components/MenuA_KenalanHuruf';
import { MenuB_PasangkanHuruf } from './components/MenuB_PasangkanHuruf';
import { MenuC_CariHurufGambar } from './components/MenuC_CariHurufGambar';
import { MenuD_HurufAwalApa } from './components/MenuD_HurufAwalApa';
import { MenuE_KapitalAtauKecil } from './components/MenuE_KapitalAtauKecil';
import { MenuF_DetektifHuruf } from './components/MenuF_DetektifHuruf';
import { MenuG_KuisPetualangan } from './components/MenuG_KuisPetualangan';
import { ReportModal } from './components/ReportModal';
import { GuideModal } from './components/GuideModal';
import { ShareModal } from './components/ShareModal';
import { Confetti } from './components/Confetti';
import bgNature from './assets/images/cute_nature_background_1793590438825.jpg';

export default function App() {
  const [progress, setProgress] = useState<AppProgress>(loadStoredProgress);
  const [currentGame, setCurrentGame] = useState<GameMode>('dashboard');
  const [kikoSpeech, setKikoSpeechText] = useState(
    'Halo teman! Aku Kiko si Kelinci. Ayo pilih permainan yang kamu suka!'
  );
  const [kikoMood, setKikoMood] = useState<KikoMood>('happy');

  // Modals
  const [showReport, setShowReport] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showShare, setShowShare] = useState(false);

  // Confetti
  const [confettiActive, setConfettiActive] = useState(false);
  const [confettiText, setConfettiText] = useState('');

  // Persist progress changes
  useEffect(() => {
    saveStoredProgress(progress);
  }, [progress]);

  // Audio Context first gesture unlock
  useEffect(() => {
    const handleFirstGesture = () => {
      initAudioContext();
    };
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  // Update speech & audio
  const updateKikoSpeech = useCallback((text: string, mood: KikoMood = 'happy') => {
    setKikoSpeechText(text);
    setKikoMood(mood);
  }, []);

  const handleToggleSound = useCallback(() => {
    setProgress((prev) => {
      const nextSound = !prev.soundEnabled;
      setMuteState(!nextSound);
      if (nextSound) {
        updateKikoSpeech('Suara sudah aktif! Kiko siap menemanimu belajar!', 'cheering');
        speakIndonesian('Suara sudah aktif! Kiko siap menemanimu belajar!');
      }
      return { ...prev, soundEnabled: nextSound };
    });
  }, [updateKikoSpeech]);

  const triggerConfettiCelebration = useCallback((text: string) => {
    setConfettiText(text);
    setConfettiActive(true);
    setTimeout(() => {
      setConfettiActive(false);
    }, 2000);
  }, []);

  // Event handlers for answers
  const handleCorrectAnswer = useCallback((letter: string, starsToAdd = 1) => {
    setProgress((prev) => {
      const currentStat = prev.letterStats[letter] || {
        explored: true,
        correctCount: 0,
        mistakeCount: 0,
      };
      return {
        ...prev,
        stars: prev.stars + starsToAdd,
        correctAnswers: prev.correctAnswers + 1,
        totalAttempts: prev.totalAttempts + 1,
        letterStats: {
          ...prev.letterStats,
          [letter]: {
            ...currentStat,
            explored: true,
            correctCount: currentStat.correctCount + 1,
          },
        },
      };
    });
  }, []);

  const handleWrongAnswer = useCallback((letter: string) => {
    setProgress((prev) => {
      const currentStat = prev.letterStats[letter] || {
        explored: true,
        correctCount: 0,
        mistakeCount: 0,
      };
      return {
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        letterStats: {
          ...prev.letterStats,
          [letter]: {
            ...currentStat,
            explored: true,
            mistakeCount: currentStat.mistakeCount + 1,
          },
        },
      };
    });
  }, []);

  const handleExploreLetter = useCallback((letter: string) => {
    setProgress((prev) => {
      if (prev.exploredLetters.includes(letter)) return prev;
      const currentStat = prev.letterStats[letter] || {
        explored: true,
        correctCount: 0,
        mistakeCount: 0,
      };
      return {
        ...prev,
        exploredLetters: [...prev.exploredLetters, letter],
        letterStats: {
          ...prev.letterStats,
          [letter]: {
            ...currentStat,
            explored: true,
          },
        },
      };
    });
  }, []);

  const handlePairMatched = useCallback((letter: string) => {
    handleCorrectAnswer(letter, 1);
    setProgress((prev) => ({
      ...prev,
      matchedPairsCount: prev.matchedPairsCount + 1,
    }));
  }, [handleCorrectAnswer]);

  const handleAdvanceAdventureLevel = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      adventureLevel: prev.adventureLevel + 1,
      stars: prev.stars + 5,
    }));
  }, []);

  const handleResetProgress = useCallback(() => {
    const fresh = clearStoredProgress();
    setProgress(fresh);
    setShowReport(false);
    updateKikoSpeech('Riwayat belajar sudah bersih. Ayo mulai petualangan baru bersama Kiko!', 'cheering');
    speakIndonesian('Riwayat belajar sudah bersih. Ayo mulai petualangan baru bersama Kiko!');
  }, [updateKikoSpeech]);

  const handleSelectGame = useCallback((mode: GameMode) => {
    setCurrentGame(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGoHome = useCallback(() => {
    setCurrentGame('dashboard');
    updateKikoSpeech('Halo teman! Aku Kiko si Kelinci. Ayo pilih permainan yang kamu suka!', 'happy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [updateKikoSpeech]);

  return (
    <div className="min-h-screen flex flex-col relative text-slate-800 antialiased selection:bg-amber-200 overflow-x-hidden">
      {/* Cute Blue Illustrated Background: Mountains, Treehouse, Baby Animals */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={bgNature}
          alt="Latar Belakang Lucu Gunung dan Rumah Pohon"
          className="w-full h-full object-cover object-bottom sm:object-center select-none"
        />
        {/* Soft cheerful pastel blue gradient overlay for optimal readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300/35 via-sky-100/40 to-emerald-50/50 backdrop-blur-[0.5px]" />
      </div>

      {/* Floating Whimsical Clouds & Butterflies */}
      <div className="fixed top-14 left-0 right-0 pointer-events-none overflow-hidden h-32 z-0 select-none">
        <span
          className="absolute text-4xl sm:text-5xl opacity-80 animate-float-slow top-2"
          style={{ left: '6%' }}
        >
          ☁️
        </span>
        <span
          className="absolute text-3xl sm:text-4xl opacity-75 animate-float-mid top-10"
          style={{ left: '42%' }}
        >
          ☁️
        </span>
        <span
          className="absolute text-5xl sm:text-6xl opacity-85 animate-float-fast top-3"
          style={{ left: '78%' }}
        >
          ☁️
        </span>
        <span
          className="absolute text-2xl sm:text-3xl opacity-85 animate-wiggle top-16"
          style={{ left: '22%' }}
        >
          🦋
        </span>
        <span
          className="absolute text-2xl sm:text-3xl opacity-85 animate-wiggle top-8"
          style={{ left: '65%' }}
        >
          🦋
        </span>
      </div>

      {/* Top Header */}
      <div className="relative z-30">
        <Header
          stars={progress.stars}
          soundEnabled={progress.soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenReport={() => setShowReport(true)}
          onOpenGuide={() => setShowGuide(true)}
          onOpenShare={() => setShowShare(true)}
          onGoHome={handleGoHome}
        />
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-5 sm:py-6 relative z-10">
        {/* Kiko Guide Mascot Banner */}
        <KikoBanner
          speechText={kikoSpeech}
          mood={kikoMood}
          soundEnabled={progress.soundEnabled}
          onRepeatAudio={() => repeatLastSpoken()}
        />

        {/* Dynamic Game Views */}
        {currentGame === 'dashboard' && (
          <Dashboard
            onSelectGame={handleSelectGame}
            exploredLetters={progress.exploredLetters}
            stars={progress.stars}
          />
        )}

        {currentGame === 'menu-a' && (
          <MenuA_KenalanHuruf
            onBack={handleGoHome}
            onExploreLetter={handleExploreLetter}
            setKikoSpeech={updateKikoSpeech}
          />
        )}

        {currentGame === 'menu-b' && (
          <MenuB_PasangkanHuruf
            onBack={handleGoHome}
            onCorrectMatch={handlePairMatched}
            onWrongAttempt={handleWrongAnswer}
            setKikoSpeech={updateKikoSpeech}
            triggerConfetti={triggerConfettiCelebration}
          />
        )}

        {currentGame === 'menu-c' && (
          <MenuC_CariHurufGambar
            onBack={handleGoHome}
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswer={handleWrongAnswer}
            setKikoSpeech={updateKikoSpeech}
            triggerConfetti={triggerConfettiCelebration}
          />
        )}

        {currentGame === 'menu-d' && (
          <MenuD_HurufAwalApa
            onBack={handleGoHome}
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswer={handleWrongAnswer}
            setKikoSpeech={updateKikoSpeech}
            triggerConfetti={triggerConfettiCelebration}
          />
        )}

        {currentGame === 'menu-e' && (
          <MenuE_KapitalAtauKecil
            onBack={handleGoHome}
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswer={handleWrongAnswer}
            setKikoSpeech={updateKikoSpeech}
            triggerConfetti={triggerConfettiCelebration}
          />
        )}

        {currentGame === 'menu-f' && (
          <MenuF_DetektifHuruf
            onBack={handleGoHome}
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswer={handleWrongAnswer}
            setKikoSpeech={updateKikoSpeech}
            triggerConfetti={triggerConfettiCelebration}
          />
        )}

        {currentGame === 'menu-g' && (
          <MenuG_KuisPetualangan
            onBack={handleGoHome}
            onCorrectAnswer={handleCorrectAnswer}
            onWrongAnswer={handleWrongAnswer}
            currentLevel={progress.adventureLevel}
            onAdvanceLevel={handleAdvanceAdventureLevel}
            setKikoSpeech={updateKikoSpeech}
            triggerConfetti={triggerConfettiCelebration}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-bold text-slate-500 border-t border-amber-100 bg-white/70">
        <p>
          🐰 Petualangan Huruf Ajaib • Media Belajar Ceria PAUD & TK Usia 4 Tahun
        </p>
      </footer>

      {/* Modals & Effects */}
      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        progress={progress}
        onResetProgress={handleResetProgress}
      />

      <GuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onOpenShare={() => setShowShare(true)}
      />

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
      />

      <Confetti
        active={confettiActive}
        praiseText={confettiText}
      />
    </div>
  );
}
