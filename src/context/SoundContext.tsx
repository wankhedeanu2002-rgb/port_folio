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
  isMusicPlaying,
  playSfx,
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
      return;
    }

    const activate = async () => {
      const ok = await enableAudio();
      if (ok) {
        setEnabled(true);
        setMusicActive(isMusicPlaying());
        localStorage.setItem(AUDIO_STORAGE_KEY, "true");
      }
    };

    void activate();

    const onInteract = () => {
      if (localStorage.getItem(AUDIO_STORAGE_KEY) === "false") return;
      void activate();
    };

    window.addEventListener("pointerdown", onInteract, { passive: true });
    window.addEventListener("keydown", onInteract);

    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setMusicActive(false);
      return;
    }
    const id = window.setInterval(() => {
      setMusicActive(isMusicPlaying());
    }, 400);
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

    const ok = await enableAudio();
    if (ok) {
      setEnabled(true);
      setMusicActive(isMusicPlaying());
      localStorage.setItem(AUDIO_STORAGE_KEY, "true");
    } else {
      setEnabled(false);
      setMusicActive(false);
      localStorage.setItem(AUDIO_STORAGE_KEY, "false");
    }
  }, [enabled]);

  const play = useCallback((type: SfxType) => {
    if (isAudioEnabled()) playSfx(type);
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
