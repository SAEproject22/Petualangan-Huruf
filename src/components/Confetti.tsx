import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  icon: string;
  left: number;
  top: number;
  size: number;
  delay: number;
}

interface ConfettiProps {
  active: boolean;
  praiseText?: string;
}

export const Confetti: React.FC<ConfettiProps> = ({ active, praiseText }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const items = ['⭐', '✨', '🌟', '🎉', '🐰', '🎈', '💖'];
    const newParticles: Particle[] = Array.from({ length: 16 }).map((_, idx) => ({
      id: Date.now() + idx,
      icon: items[Math.floor(Math.random() * items.length)],
      left: 10 + Math.random() * 80,
      top: 15 + Math.random() * 65,
      size: 24 + Math.random() * 28,
      delay: Math.random() * 0.2,
    }));

    setParticles(newParticles);
    const timer = setTimeout(() => {
      setParticles([]);
    }, 1800);

    return () => clearTimeout(timer);
  }, [active]);

  if (!active && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
      {/* Praise banner in center */}
      {praiseText && (
        <div className="bg-amber-400 text-amber-950 font-extrabold text-2xl sm:text-3xl px-8 py-4 rounded-3xl shadow-xl border-4 border-yellow-200 animate-bounce scale-110 tracking-wide z-10 flex items-center gap-3">
          <span>⭐</span>
          <span>{praiseText}</span>
          <span>⭐</span>
        </div>
      )}

      {/* Floating stars */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute transform transition-all duration-1000 ease-out"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${p.size}px`,
            animation: `starFlyUp 1.4s ease-out forwards ${p.delay}s`,
          }}
        >
          {p.icon}
        </div>
      ))}
    </div>
  );
};
