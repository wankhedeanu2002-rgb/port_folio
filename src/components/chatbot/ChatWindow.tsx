import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Send, X } from "lucide-react";
import { site } from "@/data/site";
import { useSound } from "@/context/SoundContext";
import { useReducedMotion } from "@/hooks/useScroll";
import { INITIAL_ASSISTANT_MESSAGE } from "@/lib/portfolioAssistant";
import { ChatMessage, type MessageData } from "./ChatMessage";
import { QuickQuestions } from "./QuickQuestions";
import { TypingIndicator } from "./TypingIndicator";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: MessageData[];
  isTyping: boolean;
  onSend: (text: string) => void;
  onClear: () => void;
}

export function ChatWindow({
  isOpen,
  onClose,
  messages,
  isTyping,
  onSend,
  onClear,
}: ChatWindowProps) {
  const reduced = useReducedMotion();
  const { play } = useSound();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const showQuickQuestions =
    messages.length === 1 &&
    messages[0]?.role === "assistant" &&
    messages[0]?.content === INITIAL_ASSISTANT_MESSAGE &&
    !isTyping;

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), reduced ? 0 : 180);
    return () => window.clearTimeout(id);
  }, [isOpen, reduced]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, isTyping, reduced]);

  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isOpen, onClose]);

  const submit = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    setInput("");
    onSend(trimmed);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="chatbot-title"
          aria-describedby="chatbot-subtitle"
          initial={reduced ? false : { opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-[55] flex flex-col overflow-hidden border border-white/10 bg-[#0a0a0c]/95 shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_40px_rgba(99,102,241,0.12)] backdrop-blur-2xl"
          style={{
            bottom: "max(1rem, env(safe-area-inset-bottom))",
            right: "max(1rem, env(safe-area-inset-right))",
            width: "min(calc(100vw - 24px), 400px)",
            height: "min(75vh, 620px)",
            maxHeight: "min(75vh, 620px)",
            borderRadius: "1.25rem",
          }}
        >
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-3.5">
            <div className="min-w-0">
              <h2
                id="chatbot-title"
                className="font-mono text-sm tracking-wide text-zinc-100"
              >
                <span className="text-indigo-400">✦</span> Ask Anand
              </h2>
              <p id="chatbot-subtitle" className="mt-0.5 text-[11px] text-zinc-500">
                Anand&apos;s portfolio assistant
              </p>
              <p className="mt-1 text-[10px] text-zinc-600">
                An interactive guide to Anand&apos;s work
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {site.resumePath && (
                <a
                  href={site.resumePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => play("click")}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  Resume
                </a>
              )}
              <button
                type="button"
                onClick={onClear}
                className="rounded-lg px-2 py-1.5 text-[10px] font-medium text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                Clear chat
              </button>
              <button
                type="button"
                aria-label="Close chat"
                onClick={onClose}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex flex-col items-start gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  Assistant
                </span>
                <div className="rounded-2xl rounded-bl-md bg-white/[0.04] px-3 py-1 ring-1 ring-white/10">
                  <TypingIndicator />
                </div>
              </div>
            )}
            {showQuickQuestions && (
              <QuickQuestions onSelect={onSend} disabled={isTyping} />
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-white/10 p-3"
          >
            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-black/30 p-2 focus-within:border-indigo-500/40">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Anand..."
                aria-label="Ask about Anand"
                disabled={isTyping}
                className="max-h-24 min-h-[2.25rem] flex-1 resize-none bg-transparent px-1 py-1.5 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 transition-colors hover:bg-indigo-500/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
