import { AppProgress } from '../types';

const STORAGE_KEY = 'PETUALANGAN_HURUF_AJAIB_V2';

const DEFAULT_PROGRESS: AppProgress = {
  stars: 0,
  exploredLetters: [],
  matchedPairsCount: 0,
  correctAnswers: 0,
  totalAttempts: 0,
  letterStats: {},
  adventureLevel: 1,
  soundEnabled: true,
};

export function loadStoredProgress(): AppProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      letterStats: parsed.letterStats || {},
      exploredLetters: Array.isArray(parsed.exploredLetters) ? parsed.exploredLetters : [],
    };
  } catch (err) {
    console.warn('Failed to load progress from localStorage:', err);
    return DEFAULT_PROGRESS;
  }
}

export function saveStoredProgress(progress: AppProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.warn('Failed to save progress to localStorage:', err);
  }
}

export function clearStoredProgress(): AppProgress {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
  return { ...DEFAULT_PROGRESS };
}
