import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/types";
import { ArchitectureFlow } from "./ArchitectureFlow";
import { useSound } from "@/context/SoundContext";
import { useReducedMotion } from "@/hooks/useScroll";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { play } = useSound();
  const reduced = useReducedMotion();

  const handleClose = useCallback(() => {
    play("close");
    onClose();
  }, [onClose, play]);

  useEffect(() => {
    if (!project) return;

    lockBodyScroll();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKey);

    return () => {
      unlockBodyScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [project, handleClose]);

  const panelVariants = reduced
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.12 } },
      }
    : {
        hidden: { opacity: 0, y: 28, scale: 0.94 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.48, ease: EASE_OUT },
        },
        exit: {
          opacity: 0,
          y: 16,
          scale: 0.97,
          transition: { duration: 0.32, ease: EASE_IN },
        },
      };

  return createPortal(
    <AnimatePresence mode="wait">
      {project && (
        <motion.div
          key={project.id}
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 pb-[env(safe-area-inset-bottom)] sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0.15 } : { duration: 0.4, ease: EASE_OUT }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-[6px]"
            onClick={handleClose}
            aria-label="Close project case study"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0.15 } : { duration: 0.4, ease: EASE_OUT }}
          />

          <motion.div
            className="relative z-10 flex max-h-[min(92dvh,920px)] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-2xl shadow-black/50 sm:rounded-2xl"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ willChange: "transform, opacity" }}
          >
            <ProjectModalContent project={project} onClose={handleClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ProjectModalContent({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const { caseStudy } = project;

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3 sm:px-6 sm:py-4">
        <div className="min-w-0 flex-1 pr-2">
          <p className="font-mono text-xs tracking-widest text-[var(--color-text-subtle)]">
            PROJECT {project.number}
          </p>
          <h3 id="project-modal-title" className="truncate text-lg font-semibold text-white sm:text-xl md:text-2xl">
            {project.title}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-white active:scale-95"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <div className="overflow-y-auto px-6 py-8">
        <div className="space-y-10">
          <ModalSection title="Overview" content={caseStudy.overview} />
          <ModalSection title="The Problem" content={caseStudy.problem} />
          <ModalSection title="The Architecture" content={caseStudy.architecture} />

          {project.showArchitecture && <ArchitectureFlow animated interactive />}

          <ModalList title="What I Built" items={caseStudy.built} />
          <ModalList title="Technical Challenges" items={caseStudy.challenges} />
          <ModalList title="Solutions" items={caseStudy.solutions} />

          <div>
            <h4 className="mb-4 font-mono text-xs tracking-[0.2em] text-[var(--color-accent)] uppercase">
              Technology Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[var(--color-border)] bg-white/5 px-3 py-1 text-xs text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <ModalList title="Key Engineering Decisions" items={caseStudy.decisions} />

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-accent-soft)] p-5">
            <p className="font-mono text-xs tracking-widest text-[var(--color-accent)] uppercase">
              Technical Highlight
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-200">{project.highlight}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function ModalSection({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h4 className="mb-3 font-mono text-xs tracking-[0.2em] text-[var(--color-accent)] uppercase">
        {title}
      </h4>
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{content}</p>
    </div>
  );
}

function ModalList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-3 font-mono text-xs tracking-[0.2em] text-[var(--color-accent)] uppercase">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-relaxed text-[var(--color-text-muted)]"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
