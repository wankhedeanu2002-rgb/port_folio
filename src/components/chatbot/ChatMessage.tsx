import { motion } from "framer-motion";
import type { ChatAction } from "@/lib/portfolioAssistant";
import { scrollToSection, cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useScroll";
import { useSound } from "@/context/SoundContext";

export interface MessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: ChatAction[];
}

interface ChatMessageProps {
  message: MessageData;
}

function handleAction(action: ChatAction, play: (type: "click") => void) {
  play("click");
  if (action.external || action.href.startsWith("http") || action.href.startsWith("mailto:")) {
    window.open(action.href, action.external ? "_blank" : "_self", "noopener,noreferrer");
    return;
  }
  scrollToSection(action.href);
}

export function ChatMessage({ message }: ChatMessageProps) {
  const reduced = useReducedMotion();
  const { play } = useSound();
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.25, ease: "easeOut" }}
      className={cn("flex flex-col gap-2", isUser ? "items-end" : "items-start")}
    >
      <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        {isUser ? "You" : "Assistant"}
      </span>
      <div
        className={cn(
          "max-w-[92%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
          isUser
            ? "rounded-br-md bg-indigo-500/20 text-zinc-100 ring-1 ring-indigo-500/25"
            : "rounded-bl-md bg-white/[0.04] text-zinc-200 ring-1 ring-white/10",
        )}
      >
        {message.content}
      </div>
      {!isUser && message.actions && message.actions.length > 0 && (
        <div className="flex max-w-[92%] flex-wrap gap-1.5">
          {message.actions.map((action) => (
            <button
              key={`${action.label}-${action.href}`}
              type="button"
              onClick={() => handleAction(action, play)}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
