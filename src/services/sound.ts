/**
 * Sound Service for "Petualangan Huruf Ajaib"
 * Integrates Web Speech API (id-ID) and Web Audio API synthesizer.
 */

let audioCtx: AudioContext | null = null;
let isAudioMuted = false;
let lastSpokenText = '';

export function setMuteState(muted: boolean) {
  isAudioMuted = muted;
  if (muted && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function getMuteState(): boolean {
  return isAudioMuted;
}

export function initAudioContext() {
  if (typeof window === 'undefined') return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (err) {
    console.warn('AudioContext initialization error:', err);
  }
}

/**
 * Speaks text using Web Speech API with Indonesian voice if available.
 */
export function speakIndonesian(text: string, force = false): void {
  if (isAudioMuted && !force) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  initAudioContext();
  lastSpokenText = text;

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.86; // Slower, clear pace for 4-year-old preschoolers
    utterance.pitch = 1.2; // Cheerful, friendly tone

    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(
      (v) => v.lang.startsWith('id') || v.lang.includes('Indonesian') || v.lang.includes('ID')
    );
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

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
  initAudioContext();
  if (!audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Cheerful star chime (C5 -> E5 -> G5 -> C6) for correct answers
 */
export function playCheerChime(): void {
  if (isAudioMuted) return;
  initAudioContext();
  if (!audioCtx) return;

  try {
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    const now = audioCtx.currentTime;

    freqs.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const startTime = now + idx * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
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
  initAudioContext();
  if (!audioCtx) return;

  try {
    const notes = [392.0, 329.63];
    const now = audioCtx.currentTime;

    notes.forEach((freq, idx) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const startTime = now + idx * 0.12;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

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
  initAudioContext();
  if (!audioCtx) return;

  try {
    const melody = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.5];
    const times = [0, 0.1, 0.2, 0.32, 0.44, 0.6];
    const base = audioCtx.currentTime;

    melody.forEach((freq, i) => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const start = base + times[i];
      const duration = i === melody.length - 1 ? 0.5 : 0.15;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.14, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(start);
      osc.stop(start + duration + 0.05);
    });
  } catch {
    // Ignore
  }
}
