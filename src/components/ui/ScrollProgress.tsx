import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useScroll";

export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduced ? 1000 : 120,
    damping: reduced ? 100 : 30,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || reduced) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-30 h-[2px] w-full origin-left bg-[var(--color-accent)]"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
