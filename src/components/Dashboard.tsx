import React from 'react';
import { GameMode } from '../types';
import { ALPHABET_DATA } from '../data/alphabet';
import { playPopSound } from '../services/sound';
import { Sparkles, Trophy } from 'lucide-react';

interface DashboardProps {
  onSelectGame: (mode: GameMode) => void;
  exploredLetters: string[];
  stars: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectGame,
  exploredLetters,
  stars,
}) => {
  const games = [
    {
      id: 'menu-a' as GameMode,
      title: 'Menu A: Kenalan Huruf',
      subtitle: 'Lihat huruf A–Z & dengar suaranya',
      icon: '🔤',
      badge: 'Kartu Ajaib',
      bgGradient: 'from-amber-50 to-orange-100',
      borderColor: 'border-amber-400',
      tagColor: 'bg-amber-100 text-amber-800',
      accentColor: 'text-amber-600',
      shadowColor: 'shadow-amber-200/60',
    },
    {
      id: 'menu-b' as GameMode,
      title: 'Menu B: Pasangkan Huruf',
      subtitle: 'Pasangkan huruf besar & huruf kecil (B = b)',
      icon: '🧩',
      badge: 'Teka-Teki',
      bgGradient: 'from-sky-50 to-blue-100',
      borderColor: 'border-sky-400',
      tagColor: 'bg-sky-100 text-sky-800',
      accentColor: 'text-sky-600',
      shadowColor: 'shadow-sky-200/60',
    },
    {
      id: 'menu-c' as GameMode,
      title: 'Menu C: Cari Huruf Gambar',
      subtitle: 'Tebak huruf awal nama benda (🍎 = A)',
      icon: '🍎',
      badge: 'Tebak Gambar',
      bgGradient: 'from-emerald-50 to-teal-100',
      borderColor: 'border-emerald-400',
      tagColor: 'bg-emerald-100 text-emerald-800',
      accentColor: 'text-emerald-600',
      shadowColor: 'shadow-emerald-200/60',
    },
    {
      id: 'menu-d' as GameMode,
      title: 'Menu D: Huruf Awal Apa?',
      subtitle: 'Latihan huruf mirip seperti B, D, dan P',
      icon: '⚽',
      badge: 'Fokus B-D-P',
      bgGradient: 'from-rose-50 to-pink-100',
      borderColor: 'border-rose-400',
      tagColor: 'bg-rose-100 text-rose-800',
      accentColor: 'text-rose-600',
      shadowColor: 'shadow-rose-200/60',
    },
    {
      id: 'menu-e' as GameMode,
      title: 'Menu E: Kapital atau Kecil?',
      subtitle: 'Cari pasangan huruf kapital yang cocok',
      icon: '🔍',
      badge: 'Cari Pasangan',
      bgGradient: 'from-purple-50 to-indigo-100',
      borderColor: 'border-purple-400',
      tagColor: 'bg-purple-100 text-purple-800',
      accentColor: 'text-purple-600',
      shadowColor: 'shadow-purple-200/60',
    },
    {
      id: 'menu-f' as GameMode,
      title: 'Menu F: Detektif Huruf',
      subtitle: 'Cari gambar sesuai huruf yang diminta',
      icon: '🕵️‍♂️',
      badge: 'Misi Rahasia',
      bgGradient: 'from-teal-50 to-cyan-100',
      borderColor: 'border-teal-400',
      tagColor: 'bg-teal-100 text-teal-800',
      accentColor: 'text-teal-600',
      shadowColor: 'shadow-teal-200/60',
    },
    {
      id: 'menu-g' as GameMode,
      title: 'Menu G: Kuis Petualangan',
      subtitle: 'Kuis campuran kumpulkan bintang & piala!',
      icon: '🏰',
      badge: 'Kuis Hebat',
      bgGradient: 'from-yellow-50 to-amber-100',
      borderColor: 'border-yellow-400',
      tagColor: 'bg-yellow-100 text-yellow-800',
      accentColor: 'text-yellow-600',
      shadowColor: 'shadow-yellow-200/60',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-sky-500/90 via-emerald-500/90 to-teal-500/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden border-3 border-sky-200">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 font-black text-sky-100 text-xs sm:text-sm uppercase tracking-wider mb-1.5">
            <Sparkles size={18} className="text-amber-300" />
            <span>Rumah Pohon Sahabat Huruf 🏡🌳🦌</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-2">
            Ayo Berpetualang Mengenal Huruf di Lembah Kiko! 🐰
          </h2>
          <p className="text-sm sm:text-base text-sky-50 font-bold leading-relaxed">
            Bersama Kiko si Kelinci, rusa manis, dan beruang kecil di rumah pohon, sentuh permainan di bawah untuk mengumpulkan bintang! ⭐
          </p>
        </div>
        <div className="absolute -right-2 -bottom-2 text-6xl sm:text-7xl opacity-40 select-none pointer-events-none">
          🌳🏡
        </div>
      </div>

      {/* Grid Menu Permainan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              playPopSound();
              onSelectGame(g.id);
            }}
            className={`bg-gradient-to-b ${g.bgGradient} border-4 ${g.borderColor} rounded-3xl p-5 text-left flex flex-col justify-between shadow-md ${g.shadowColor} hover:-translate-y-1 hover:shadow-lg transition-all btn-chunky relative overflow-hidden group cursor-pointer`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">
                  {g.icon}
                </span>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full ${g.tagColor} border border-current/20`}
                >
                  {g.badge}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug mb-1">
                {g.title}
              </h3>
              <p className="text-sm sm:text-base font-bold text-slate-600 leading-normal">
                {g.subtitle}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-extrabold text-slate-500">
                Ayo Mainkan!
              </span>
              <span className="text-lg font-black text-slate-700 group-hover:translate-x-1 transition-transform">
                ➡️
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Letter Exploration Badge Strip */}
      <div className="bg-white rounded-3xl p-5 border-3 border-amber-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="text-amber-500" size={20} />
            <h3 className="text-lg font-black text-slate-800">
              Huruf yang Sudah Kamu Kenali ({exploredLetters.length} / 26)
            </h3>
          </div>
          <span className="text-xs sm:text-sm font-black text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            {Math.round((exploredLetters.length / 26) * 100)}% Lengkap
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {ALPHABET_DATA.map((item) => {
            const isExplored = exploredLetters.includes(item.upper);
            return (
              <button
                key={item.upper}
                onClick={() => {
                  playPopSound();
                  onSelectGame('menu-a');
                }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-black text-base sm:text-lg flex items-center justify-center transition-all ${
                  isExplored
                    ? 'bg-amber-100 text-amber-800 border-2 border-amber-400 shadow-xs scale-100'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
                title={`Huruf ${item.upper} - ${item.word}`}
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
