import { useEffect, useState } from "react";
import { useScroll, useMotionValueEvent, type MotionValue } from "framer-motion";
import type { RefObject } from "react";

/** Scroll progress where crossfade begins (current → previous). */
export const EXPERIENCE_BLEND_START = 0.32;
/** Scroll progress where crossfade finishes. */
export const EXPERIENCE_BLEND_END = 0.68;

export function getExperienceBlend(
  progress: number,
  blendStart = EXPERIENCE_BLEND_START,
  blendEnd = EXPERIENCE_BLEND_END,
): number {
  if (progress <= blendStart) return 0;
  if (progress >= blendEnd) return 1;
  return (progress - blendStart) / (blendEnd - blendStart);
}

export function getExperienceStepFromBlend(blend: number): number {
  return blend < 0.5 ? 0 : 1;
}

interface UseExperienceScrollStepOptions {
  sectionRef: RefObject<HTMLElement | null>;
  stepCount: number;
  enabled?: boolean;
  blendStart?: number;
  blendEnd?: number;
}

interface UseExperienceScrollStepResult {
  step: number;
  blend: number;
  scrollYProgress: MotionValue<number>;
}

export function useExperienceScrollStep({
  sectionRef,
  stepCount,
  enabled = true,
  blendStart = EXPERIENCE_BLEND_START,
  blendEnd = EXPERIENCE_BLEND_END,
}: UseExperienceScrollStepOptions): UseExperienceScrollStepResult {
  const [step, setStep] = useState(0);
  const [blend, setBlend] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!enabled || stepCount <= 1) {
      setStep(0);
      setBlend(0);
      return;
    }

    const nextBlend = getExperienceBlend(progress, blendStart, blendEnd);
    setBlend(nextBlend);
    setStep(getExperienceStepFromBlend(nextBlend));
  });

  useEffect(() => {
    if (!enabled) {
      setStep(0);
      setBlend(0);
    }
  }, [enabled]);

  return { step, blend, scrollYProgress };
}
