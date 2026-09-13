import { forwardRef, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { useReducedMotion } from "@/hooks/useScroll";
import { useSound } from "@/context/SoundContext";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { ProjectPreview } from "@/components/ui/ProjectPreview";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

export function Projects() {
  const reduced = useReducedMotion();
  const { play } = useSound();
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeId, setActiveId] = useState(projects[0]?.id ?? "");
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (reduced) return;

    let frame = 0;

    const updateActive = () => {
      const focusLine = window.innerHeight * 0.42;
      let nextId: string | null = null;
      let bestScore = Number.NEGATIVE_INFINITY;

      for (const project of projects) {
        const el = cardRefs.current.get(project.id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.bottom < 96 || rect.top > window.innerHeight - 48) continue;

        const center = rect.top + rect.height / 2;
        const distance = Math.abs(center - focusLine);
        const visibleRatio = Math.min(rect.height, window.innerHeight) / rect.height;
        const score = visibleRatio * 2 - distance / window.innerHeight;

        if (score > bestScore) {
          bestScore = score;
          nextId = project.id;
        }
      }

      if (nextId) setActiveId(nextId);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  const openProject = (project: Project) => {
    play("click");
    play("open");
    setSelected(project);
  };

  const closeProject = () => setSelected(null);

  const registerCard = (id: string, node: HTMLButtonElement | null) => {
    if (node) cardRefs.current.set(id, node);
    else cardRefs.current.delete(id);
  };

  return (
    <section id="projects" className="section-padding section-padding-top-compact">
      <div className="container-wide">
        <SectionHeading
          title="Production systems I've engineered"
          description="Full-stack and backend platforms built for real operational workloads — APIs, monitoring, and data systems."
        />

        <div className="space-y-8">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.05}>
              <ProjectCard
                ref={(node) => registerCard(project.id, node)}
                project={project}
                isActive={activeId === project.id}
                onOpen={() => openProject(project)}
                reduced={reduced}
              />
            </Reveal>
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={closeProject} />
    </section>
  );
}

const ProjectCard = forwardRef<
  HTMLButtonElement,
  {
    project: Project;
    onOpen: () => void;
    reduced: boolean;
    isActive: boolean;
  }
>(function ProjectCard({ project, onOpen, reduced, isActive }, ref) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [gradient, setGradient] = useState({ x: 50, y: 50 });
  const { play } = useSound();

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouse({ x, y });
    setGradient({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const tiltX = reduced ? 0 : mouse.y * -3;
  const tiltY = reduced ? 0 : mouse.x * 3;
  const highlighted = isActive && !reduced;

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      onMouseMove={onMove}
      onMouseEnter={() => play("hover")}
      onMouseLeave={() => setMouse({ x: 0, y: 0 })}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border bg-[var(--color-bg-card)] text-left transition-all duration-500",
        project.id === "challan-flow" ? "p-5 sm:p-8 lg:p-10" : "p-5 sm:p-8",
        highlighted
          ? "border-indigo-500/35 shadow-[0_0_48px_rgba(99,102,241,0.1)]"
          : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]",
      )}
      style={{
        transform: reduced
          ? undefined
          : `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      }}
      whileTap={reduced ? undefined : { scale: 0.995 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      aria-label={`Open case study for ${project.title}`}
      aria-current={highlighted ? "true" : undefined}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-500",
          highlighted ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
        style={{
          background: `radial-gradient(circle at ${gradient.x}% ${gradient.y}%, rgba(99,102,241,0.14), transparent 58%)`,
        }}
      />
      <div
        className={cn(
          `pointer-events-none absolute inset-0 bg-gradient-to-br ${project.accent} transition-opacity duration-500`,
          highlighted ? "opacity-70" : "opacity-0 group-hover:opacity-100",
        )}
      />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span
              className={cn(
                "font-mono text-3xl font-light transition duration-500 sm:text-4xl lg:text-6xl",
                highlighted ? "text-indigo-400/90" : "text-zinc-700 group-hover:text-indigo-400",
              )}
            >
              {project.number}
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-text-subtle)] uppercase">
              {project.category}
            </span>
          </div>

          <h3 className="text-2xl font-semibold text-white lg:text-3xl">{project.title}</h3>
          <p
            className={cn(
              "mt-3 text-sm leading-relaxed md:text-base",
              highlighted ? "text-zinc-300" : "text-[var(--color-text-muted)]",
            )}
          >
            {project.description}
          </p>

          <div
            className={cn(
              "mt-5 flex flex-wrap gap-2 transition duration-500",
              highlighted ? "opacity-100" : "opacity-70 group-hover:opacity-100",
            )}
          >
            {project.stack.map((tech) => (
              <span
                key={tech}
                className={cn(
                  "rounded-full border bg-black/30 px-3 py-1 text-xs transition duration-500",
                  highlighted
                    ? "border-indigo-500/35 text-zinc-200"
                    : "border-[var(--color-border)] text-zinc-400 group-hover:border-indigo-500/30 group-hover:text-zinc-200",
                )}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span
              className={cn(
                "font-mono text-xs tracking-widest uppercase transition duration-500",
                highlighted ? "text-indigo-200/90" : "text-zinc-500 group-hover:text-white",
              )}
            >
              Case Study
            </span>
            <motion.span
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border bg-white/5 text-white transition duration-500",
                highlighted ? "border-indigo-500/40" : "border-[var(--color-border)]",
              )}
              animate={reduced ? undefined : { x: mouse.x * 6, y: mouse.y * -6 }}
            >
              <ArrowUpRight size={18} />
            </motion.span>
          </div>
        </div>

        <motion.div
          className="transition duration-500 group-hover:translate-x-1"
          animate={reduced ? undefined : { y: mouse.y * -4 }}
        >
          <ProjectPreview projectId={project.id} reduced={reduced} />
        </motion.div>
      </div>

      <div
        className={cn(
          "relative z-10 mt-6 rounded-xl border bg-white/[0.02] p-4 transition duration-500",
          highlighted ? "border-indigo-500/25" : "border-[var(--color-border)]",
        )}
      >
        <p className="font-mono text-[10px] tracking-widest text-[var(--color-accent)] uppercase">
          Technical Highlight
        </p>
        <p className="mt-2 text-sm leading-relaxed text-zinc-300">{project.highlight}</p>
      </div>
    </motion.button>
  );
});
