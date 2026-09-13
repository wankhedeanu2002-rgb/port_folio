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
  disableAudio,
  enableAudio,
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
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUDIO_STORAGE_KEY) === "true";
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(() => readStoredPreference());
  const [musicActive, setMusicActive] = useState(false);

  useEffect(() => {
    const syncMusicState = () => {
      setMusicActive(isMusicPlaying());
    };

    if (!readStoredPreference()) {
      void disableAudio();
      setEnabled(false);
      setMusicActive(false);
      return;
    }

    setEnabled(true);
    setAudioEnabled(true);
    void enableAudio({ cue: false }).then(syncMusicState);

    const onPointerDown = (event: PointerEvent) => {
      if (!readStoredPreference()) return;

      if (isMobileAudioContext() && !isInteractiveAudioTarget(event.target)) {
        void restartBackgroundMusic().then(syncMusicState);
      }
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true, capture: true });

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
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
      setEnabled(true);
      setMusicActive(isMusicPlaying());
    } else {
      await disableAudio();
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
