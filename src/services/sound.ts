/**
 * Sound Service for "Petualangan Huruf Ajaib"
 * Robust integration of Web Speech API (id-ID) and Web Audio API synthesizer.
 */

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;
let lastSpokenText = '';
let cachedVoices: SpeechSynthesisVoice[] = [];

// Initialize voices as soon as available in browser
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    cachedVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      try {
        cachedVoices = window.speechSynthesis.getVoices();
      } catch {
        // Ignore
      }
    };
  } catch {
    // Ignore
  }
}

export function setMuteState(muted: boolean) {
  isAudioMuted = muted;
  if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}

export function getMuteState(): boolean {
  return isAudioMuted;
}

export function initAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch (err) {
    console.warn('AudioContext initialization error:', err);
    return null;
  }
}

/**
 * Speaks text using Web Speech API with Indonesian voice if available.
 * Handles Chrome paused/stuck states and voice fallbacks gracefully.
 */
export function speakIndonesian(text: string, force = false): void {
  if (isAudioMuted && !force) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;

  initAudioContext();
  lastSpokenText = text;

  try {
    // Resume speech synthesis if paused/stuck by browser
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.88; // Comfortable pace for 4-year-olds
    utterance.pitch = 1.22; // Cheerful friendly tone

    // Fetch fresh voices if cached is empty
    if (cachedVoices.length === 0) {
      cachedVoices = window.speechSynthesis.getVoices();
    }

    const indonesianVoice = cachedVoices.find(
      (v) =>
        v.lang === 'id-ID' ||
        v.lang === 'id_ID' ||
        v.lang.startsWith('id') ||
        v.lang.toLowerCase().includes('indonesia')
    );

    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

    // Safety timeout in case speech gets stalled
    const watchdog = setTimeout(() => {
      try {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.resume();
        }
      } catch {
        // Ignore
      }
    }, 4000);

    utterance.onend = () => clearTimeout(watchdog);
    utterance.onerror = () => clearTimeout(watchdog);

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
  }
}

export function repeatLastSpoken(): void {
  if (lastSpokenText) {
    speakIndonesian(lastSpokenText, true);
  }
}

/**
 * Bubble pop sound for button presses
 */
export function playPopSound(): void {
  if (isAudioMuted) return;
  const ctx = initAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.07);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Cheerful star chime (C5 -> E5 -> G5 -> C6) for correct answers
 */
export function playCheerChime(): void {
  if (isAudioMuted) return;
  const ctx = initAudioContext();
  if (!ctx) return;

  try {
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  } catch {
    // Ignore
  }
}

/**
 * Gentle warm encouragement tone (G4 -> E4, triangle wave, soft and reassuring)
 */
export function playGentleTone(): void {
  if (isAudioMuted) return;
  const ctx = initAudioContext();
  if (!ctx) return;

  try {
    const notes = [392.0, 329.63];
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.12;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  } catch {
    // Ignore
  }
}

/**
 * Victory fanfare for completing rounds
 */
export function playVictoryFanfare(): void {
  if (isAudioMuted) return;
  const ctx = initAudioContext();
  if (!ctx) return;

  try {
    const melody = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.5];
    const times = [0, 0.1, 0.2, 0.32, 0.44, 0.6];
    const base = ctx.currentTime;

    melody.forEach((freq, i) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = base + times[i];
      const duration = i === melody.length - 1 ? 0.5 : 0.15;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.14, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration + 0.05);
    });
  } catch {
    // Ignore
  }
}
