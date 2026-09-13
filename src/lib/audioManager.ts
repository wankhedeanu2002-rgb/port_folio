export type SfxType =
  | "hover"
  | "click"
  | "open"
  | "close"
  | "success"
  | "typing"
  | "transition"
  | "activate"
  | "dataFlow";

const MUSIC_SRC = "/audio/mixkit-serene-view-443.mp3";
const MUSIC_TARGET = 0.3;
const FADE_IN_MS = 2800;
const FADE_OUT_MS = 800;
const HOVER_COOLDOWN = 200;
const TYPING_COOLDOWN = 120;
const STORAGE_KEY = "portfolio-audio-enabled";

let enabled = false;
let musicPlaying = false;
let sfxCtx: AudioContext | null = null;
let musicEl: HTMLAudioElement | null = null;
let musicFadeTimer: ReturnType<typeof setInterval> | null = null;
let lastHover = 0;
let lastTyping = 0;
let architectureSoundPlayed = false;

function getSfxContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sfxCtx) {
    sfxCtx = new AudioContext();
  }
  return sfxCtx;
}

function getMusicElement(): HTMLAudioElement {
  if (!musicEl) {
    musicEl = new Audio(MUSIC_SRC);
    musicEl.loop = true;
    musicEl.preload = "auto";
    musicEl.volume = 0;
  }
  return musicEl;
}

async function resumeSfxContext(): Promise<boolean> {
  const c = getSfxContext();
  if (!c) return false;
  if (c.state === "suspended") {
    try {
      await c.resume();
    } catch {
      return false;
    }
  }
  return c.state === "running";
}

function clearMusicFade() {
  if (musicFadeTimer) {
    clearInterval(musicFadeTimer);
    musicFadeTimer = null;
  }
}

function fadeMusicVolume(from: number, to: number, durationMs: number, onDone?: () => void) {
  clearMusicFade();
  const el = getMusicElement();
  const start = performance.now();

  musicFadeTimer = setInterval(() => {
    const t = Math.min(1, (performance.now() - start) / durationMs);
    const eased = t * t * (3 - 2 * t);
    el.volume = from + (to - from) * eased;

    if (t >= 1) {
      clearMusicFade();
      el.volume = to;
      onDone?.();
    }
  }, 32);
}

function playTone(
  frequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = "sine",
) {
  const c = getSfxContext();
  if (!enabled || !c || c.state !== "running") return;

  const osc = c.createOscillator();
  const gain = c.createGain();
  const t = c.currentTime;

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, t);
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.exponentialRampToValueAtTime(Math.max(volume, 0.001), t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

function playNoise(duration: number, volume: number) {
  const c = getSfxContext();
  if (!enabled || !c || c.state !== "running") return;

  const bufferSize = Math.max(1, Math.floor(c.sampleRate * duration));
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }

  const source = c.createBufferSource();
  const gain = c.createGain();
  const t = c.currentTime;

  source.buffer = buffer;
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  source.connect(gain);
  gain.connect(c.destination);
  source.start(t);
}

async function startMusic(): Promise<boolean> {
  const el = getMusicElement();

  try {
    el.volume = 0;
    if (el.paused) {
      await el.play();
    }
    musicPlaying = true;
    fadeMusicVolume(0, MUSIC_TARGET, FADE_IN_MS);
    return true;
  } catch {
    musicPlaying = false;
    el.volume = 0;
    try {
      el.pause();
    } catch {
      /* ignore */
    }
    return false;
  }
}

function stopMusic() {
  const el = getMusicElement();
  const current = el.volume;
  fadeMusicVolume(current, 0, FADE_OUT_MS, () => {
    el.pause();
    el.volume = 0;
    musicPlaying = false;
  });
}

export function isAudioEnabled(): boolean {
  return enabled;
}

export function isMusicPlaying(): boolean {
  return musicPlaying && enabled;
}

export function setAudioEnabled(value: boolean): void {
  enabled = value;
}

export async function enableAudio(): Promise<boolean> {
  const sfxOk = await resumeSfxContext();
  if (!sfxOk) return false;

  enabled = true;

  playActivate();

  const musicOk = await startMusic();
  if (!musicOk) {
    enabled = true;
    return true;
  }

  return true;
}

export async function disableAudio(): Promise<void> {
  enabled = false;
  musicPlaying = false;
  clearMusicFade();
  stopMusic();
}

export async function toggleAudio(): Promise<boolean> {
  if (enabled) {
    await disableAudio();
    return false;
  }
  return enableAudio();
}

export function playActivate(): void {
  if (!enabled) return;
  playTone(392, 0.15, 0.12, "sine");
  window.setTimeout(() => playTone(523, 0.18, 0.1, "sine"), 90);
}

export function playHover(): void {
  if (!enabled) return;
  const now = Date.now();
  if (now - lastHover < HOVER_COOLDOWN) return;
  lastHover = now;
  void resumeSfxContext().then(() => playTone(880, 0.05, 0.08, "sine"));
}

export function playClick(): void {
  if (!enabled) return;
  void resumeSfxContext().then(() => {
    playTone(520, 0.07, 0.12, "triangle");
    playNoise(0.03, 0.06);
  });
}

export function playOpen(): void {
  if (!enabled) return;
  void resumeSfxContext().then(() => {
    playTone(330, 0.16, 0.12, "sine");
    window.setTimeout(() => playTone(494, 0.18, 0.1, "sine"), 70);
  });
}

export function playClose(): void {
  if (!enabled) return;
  void resumeSfxContext().then(() => {
    playTone(587, 0.1, 0.1, "sine");
    window.setTimeout(() => playTone(440, 0.12, 0.08, "sine"), 60);
  });
}

export function playSuccess(): void {
  if (!enabled) return;
  void resumeSfxContext().then(() => {
    playTone(523, 0.09, 0.1, "sine");
    window.setTimeout(() => playTone(659, 0.11, 0.09, "sine"), 75);
  });
}

export function playTyping(): void {
  if (!enabled) return;
  const now = Date.now();
  if (now - lastTyping < TYPING_COOLDOWN) return;
  lastTyping = now;
  void resumeSfxContext().then(() =>
    playTone(1100 + Math.random() * 150, 0.025, 0.05, "triangle"),
  );
}

export function playTransition(): void {
  if (!enabled) return;
  void resumeSfxContext().then(() => playTone(280, 0.12, 0.08, "sine"));
}

export function playDataFlow(): void {
  if (!enabled || architectureSoundPlayed) return;
  architectureSoundPlayed = true;
  void resumeSfxContext().then(() => {
    playTone(220, 0.22, 0.08, "sine");
    window.setTimeout(() => playTone(330, 0.28, 0.07, "sine"), 130);
  });
}

export function playSfx(type: SfxType): void {
  switch (type) {
    case "hover":
      playHover();
      break;
    case "click":
      playClick();
      break;
    case "open":
      playOpen();
      break;
    case "close":
      playClose();
      break;
    case "success":
      playSuccess();
      break;
    case "typing":
      playTyping();
      break;
    case "transition":
      playTransition();
      break;
    case "activate":
      playActivate();
      break;
    case "dataFlow":
      playDataFlow();
      break;
  }
}

export { STORAGE_KEY as AUDIO_STORAGE_KEY };

export type SoundType = SfxType;
export const isSoundEnabled = isAudioEnabled;
export const setSoundEnabled = setAudioEnabled;
export const playSound = playSfx;
export async function primeSound(): Promise<boolean> {
  return enableAudio();
}
