import { useEffect, useState } from "react";
import { useReducedMotion, usePrefersHover } from "@/hooks/useScroll";

export function GlobalPointerSpotlight() {
  const reduced = useReducedMotion();
  const prefersHover = usePrefersHover();
  const [pointer, setPointer] = useState({ x: 50, y: 50, active: false });

  useEffect(() => {
    if (reduced || !prefersHover) return;

    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPointer({ x, y, active: true });
    };

    const onLeave = () => {
      setPointer((prev) => ({ ...prev, active: false }));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, prefersHover]);

  if (reduced || !prefersHover) return null;

  return (
    <div
      className="global-pointer-spotlight"
      aria-hidden="true"
      style={
        {
          "--pointer-x": `${pointer.x}%`,
          "--pointer-y": `${pointer.y}%`,
          opacity: pointer.active ? 1 : 0,
        } as React.CSSProperties
      }
    />
  );
}
