import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { terminalLines } from "@/data/site";
import { useReducedMotion } from "@/hooks/useScroll";
import { useSound } from "@/context/SoundContext";

const LINE_DELAY_MS = 650;
const OUTPUT_DELAY_S = 0.22;

export function Terminal() {
  const reduced = useReducedMotion();
  const { play } = useSound();
  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAutoPlayedRef = useRef(false);

  const isInView = useInView(sectionRef, { once: true, amount: 0.25, margin: "0px 0px -8% 0px" });

  const [visibleLines, setVisibleLines] = useState(0);
  const [typing, setTyping] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const clearAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const runAnimation = useCallback(() => {
    clearAnimation();

    if (reduced) {
      setVisibleLines(terminalLines.length);
      setTyping(false);
      setHasFinished(true);
      return;
    }

    setVisibleLines(0);
    setTyping(true);
    setHasFinished(false);

    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 1;
      setVisibleLines(i);
      play("typing");

      if (i >= terminalLines.length) {
        clearAnimation();
        setTyping(false);
        setHasFinished(true);
        play("success");
      }
    }, LINE_DELAY_MS);
  }, [clearAnimation, play, reduced]);

  useEffect(() => {
    if (!isInView || hasAutoPlayedRef.current) return;

    hasAutoPlayedRef.current = true;
    runAnimation();
  }, [isInView, runAnimation]);

  useEffect(() => clearAnimation, [clearAnimation]);

  const replay = () => {
    if (reduced || typing) return;
    play("click");
    runAnimation();
  };

  const showIdlePrompt = !typing && visibleLines === 0 && !hasFinished;

  return (
    <section ref={sectionRef} className="section-padding">
      <div className="container-narrow">
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[#0c0c0c] font-mono text-sm shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-zinc-700 sm:h-3 sm:w-3" />
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-zinc-700 sm:h-3 sm:w-3" />
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-zinc-700 sm:h-3 sm:w-3" />
              <span className="ml-1 truncate text-[11px] text-zinc-600 sm:ml-2 sm:text-xs">
                terminal
              </span>
            </div>
            <button
              type="button"
              onClick={replay}
              disabled={typing}
              className="shrink-0 rounded-md border border-[var(--color-border)] px-3 py-1.5 font-mono text-[9px] tracking-widest text-zinc-400 uppercase transition hover:border-[var(--color-border-hover)] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-9 sm:px-3.5 sm:text-[10px]"
              aria-label="Run terminal animation again"
            >
              Run Again
            </button>
          </div>

          <div className="min-h-[240px] space-y-4 p-4 sm:min-h-[280px] sm:p-6">
            {terminalLines.slice(0, visibleLines).map((line, i) => {
              const isCurrentLine = typing && i === visibleLines - 1;

              return (
                <TerminalLine
                  key={`${line.command}-${i}`}
                  line={line}
                  reduced={reduced}
                  isFinished={hasFinished && line.command === "status"}
                  showOutputCursor={isCurrentLine}
                />
              );
            })}

            {showIdlePrompt && <TerminalPrompt />}

            {hasFinished && !typing && <TerminalPrompt />}
          </div>
        </div>
      </div>
    </section>
  );
}

function TerminalLine({
  line,
  reduced,
  isFinished,
  showOutputCursor,
}: {
  line: (typeof terminalLines)[number];
  reduced: boolean;
  isFinished: boolean;
  showOutputCursor: boolean;
}) {
  return (
    <div>
      <motion.p
        className="text-zinc-500"
        initial={reduced ? false : { opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-emerald-500/80">$</span> {line.command}
      </motion.p>
      <motion.p
        className="mt-1 whitespace-pre-line pl-3 text-zinc-300 sm:pl-4"
        initial={reduced ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: reduced ? 0 : OUTPUT_DELAY_S, ease: [0.22, 1, 0.36, 1] }}
      >
        {line.output}
        {showOutputCursor && <BlinkCursor className="ml-1 h-3.5 w-1.5 bg-zinc-400" />}
        {isFinished && <span className="ml-2 text-emerald-400">●</span>}
      </motion.p>
    </div>
  );
}

function TerminalPrompt() {
  return (
    <p className="text-zinc-600">
      <span className="text-emerald-500/80">$</span> <BlinkCursor className="h-3.5 w-1.5 bg-zinc-500" />
    </p>
  );
}

function BlinkCursor({ className }: { className: string }) {
  return (
    <motion.span
      className={`inline-block align-middle ${className}`}
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    />
  );
}
