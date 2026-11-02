export interface AlphabetItem {
  upper: string;
  lower: string;
  word: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  phonics: string;
  category: 'Buah' | 'Hewan' | 'Benda' | 'Lainnya';
  description: string;
}

export type GameMode =
  | 'dashboard'
  | 'menu-a'
  | 'menu-b'
  | 'menu-c'
  | 'menu-d'
  | 'menu-e'
  | 'menu-f'
  | 'menu-g';

export interface LetterStat {
  explored: boolean;
  correctCount: number;
  mistakeCount: number;
}

export interface AppProgress {
  stars: number;
  exploredLetters: string[];
  matchedPairsCount: number;
  correctAnswers: number;
  totalAttempts: number;
  letterStats: Record<string, LetterStat>;
  adventureLevel: number;
  soundEnabled: boolean;
}
