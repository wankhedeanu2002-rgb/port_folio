import { useEffect, useState } from "react";
import { useReducedMotion } from "./useScroll";

interface ParallaxOptions {
  strength?: number;
  enabled?: boolean;
}

export function useMouseParallax({ strength = 1, enabled = true }: ParallaxOptions = {}) {
  const reduced = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced || !enabled) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setOffset({
        x: ((e.clientX - cx) / cx) * strength,
        y: ((e.clientY - cy) / cy) * strength,
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, enabled, strength]);

  return offset;
}
