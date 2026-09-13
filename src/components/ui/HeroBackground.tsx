import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useScroll";

export function HeroBackground() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />

      {!reduced &&
        Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-32 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"
            style={{
              top: `${15 + i * 12}%`,
              left: `${5 + i * 14}%`,
            }}
            animate={{
              x: [0, 40, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      {!reduced &&
        Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`node-${i}`}
            className="absolute h-1 w-1 rounded-full bg-indigo-400/40"
            style={{
              top: `${20 + (i * 9) % 70}%`,
              left: `${10 + (i * 11) % 80}%`,
            }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
    </div>
  );
}
