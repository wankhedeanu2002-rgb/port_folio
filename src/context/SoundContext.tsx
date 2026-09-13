import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AUDIO_STORAGE_KEY,
  bootstrapAudioOnLoad,
  disableAudio,
  enableAudio,
  ensureMusicPlaying,
  isAudioEnabled,
  isInteractiveAudioTarget,
  isMobileAudioContext,
  isMusicPlaying,
  playSfx,
  restartBackgroundMusic,
  setAudioEnabled,
  type SfxType,
} from "@/lib/audioManager";

interface SoundContextValue {
  enabled: boolean;
  musicActive: boolean;
  toggle: () => Promise<void>;
  play: (type: SfxType) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

function readStoredPreference(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(AUDIO_STORAGE_KEY) !== "false";
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(() => readStoredPreference());
  const [musicActive, setMusicActive] = useState(false);

  useEffect(() => {
    if (!readStoredPreference()) {
      setAudioEnabled(false);
      setEnabled(false);
      setMusicActive(false);
      return;
    }

    setEnabled(true);
    setAudioEnabled(true);

    const syncMusicState = () => {
      setMusicActive(isMusicPlaying());
    };

    void bootstrapAudioOnLoad().then(syncMusicState);

    const retryStart = () => {
      if (localStorage.getItem(AUDIO_STORAGE_KEY) === "false") return;
      void ensureMusicPlaying().then(syncMusicState);
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") retryStart();
    };

    window.addEventListener("pageshow", retryStart);
    document.addEventListener("visibilitychange", onVisible);

    const pollId = window.setInterval(() => {
      if (localStorage.getItem(AUDIO_STORAGE_KEY) !== "false" && !isMusicPlaying()) {
        void ensureMusicPlaying();
      }
      syncMusicState();
    }, 1500);

    const onPointerDown = (event: PointerEvent) => {
      if (localStorage.getItem(AUDIO_STORAGE_KEY) === "false") return;

      void ensureMusicPlaying().then(syncMusicState);

      if (isMobileAudioContext()) {
        if (isInteractiveAudioTarget(event.target)) return;
        void restartBackgroundMusic();
      }
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true, capture: true });

    return () => {
      window.removeEventListener("pageshow", retryStart);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
      window.clearInterval(pollId);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setMusicActive(false);
      return;
    }

    const id = window.setInterval(() => {
      setMusicActive(isMusicPlaying());
    }, 500);

    return () => window.clearInterval(id);
  }, [enabled]);

  const toggle = useCallback(async () => {
    if (enabled) {
      await disableAudio();
      setEnabled(false);
      setMusicActive(false);
      localStorage.setItem(AUDIO_STORAGE_KEY, "false");
      return;
    }

    localStorage.setItem(AUDIO_STORAGE_KEY, "true");
    setAudioEnabled(true);
    const ok = await enableAudio({ cue: true });
    if (ok) {
      await ensureMusicPlaying();
      setEnabled(true);
      setMusicActive(isMusicPlaying());
    } else {
      setEnabled(false);
      setMusicActive(false);
      localStorage.setItem(AUDIO_STORAGE_KEY, "false");
    }
  }, [enabled]);

  const play = useCallback((type: SfxType) => {
    if (!isAudioEnabled()) return;

    if (isMobileAudioContext()) {
      if (type === "hover") return;
      if (type === "musicResume") return;
    }

    playSfx(type);
  }, []);

  const value = useMemo(
    () => ({ enabled, musicActive, toggle, play }),
    [enabled, musicActive, toggle, play],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}
