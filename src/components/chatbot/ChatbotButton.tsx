import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useReducedMotion } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";

interface ChatbotButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ChatbotButton({ isOpen, onClick }: ChatbotButtonProps) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      aria-label={isOpen ? "Close Ask Anand chat" : "Open Ask Anand chat"}
      aria-expanded={isOpen}
      onClick={onClick}
      whileHover={reduced ? undefined : { scale: 1.04 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      className={cn(
        "group fixed z-[55] flex items-center justify-center gap-2 border border-indigo-500/30 bg-[#0c0c0f]/90 text-zinc-100 shadow-[0_0_24px_rgba(99,102,241,0.18)] backdrop-blur-xl transition-shadow",
        "bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]",
        "h-12 w-12 rounded-full sm:h-auto sm:w-auto sm:rounded-full sm:px-4 sm:py-2.5",
        "hover:border-indigo-400/50 hover:shadow-[0_0_32px_rgba(99,102,241,0.28)]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
        isOpen && "pointer-events-none opacity-0",
      )}
    >
      {!reduced && (
        <span
          className="pointer-events-none absolute inset-0 rounded-full bg-indigo-500/10 opacity-0 transition-opacity group-hover:opacity-100 sm:rounded-full"
          aria-hidden="true"
        />
      )}
      <MessageSquare className="relative h-4 w-4 text-indigo-300" aria-hidden="true" />
      <span className="relative hidden font-mono text-xs tracking-wide sm:inline">
        <span className="text-indigo-400">✦</span> Ask Anand
      </span>
    </motion.button>
  );
}
