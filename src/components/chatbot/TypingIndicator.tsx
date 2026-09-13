import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useScroll";

export function TypingIndicator() {
  const reduced = useReducedMotion();

  return (
    <div
      className="flex items-center gap-1 px-1 py-2"
      role="status"
      aria-label="Assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-indigo-400/80"
          animate={reduced ? { opacity: 0.6 } : { opacity: [0.35, 1, 0.35] }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}
