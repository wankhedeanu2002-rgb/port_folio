import { QUICK_QUESTIONS } from "@/lib/portfolioAssistant";
import { useSound } from "@/context/SoundContext";

interface QuickQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function QuickQuestions({ onSelect, disabled }: QuickQuestionsProps) {
  const { play } = useSound();

  return (
    <div className="flex flex-col gap-2 px-1" role="group" aria-label="Suggested questions">
      {QUICK_QUESTIONS.map((question) => (
        <button
          key={question}
          type="button"
          disabled={disabled}
          onClick={() => {
            play("click");
            onSelect(question);
          }}
          className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-left text-[12px] leading-snug text-zinc-300 transition-colors hover:border-indigo-500/35 hover:bg-indigo-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
