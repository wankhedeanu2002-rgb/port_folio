import { useState } from "react";
import { motion } from "framer-motion";
import {
  getNodeById,
  getNodesByCategory,
  skillCategoryGroups,
  skillNetworkCenter,
} from "@/data/skillNetwork";
import { projects } from "@/data/projects";
import { useReducedMotion, usePrefersHover } from "@/hooks/useScroll";
import { useSound } from "@/context/SoundContext";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function TechStack() {
  const reduced = useReducedMotion();
  const prefersHover = usePrefersHover();
  const { play } = useSound();
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = activeId ? getNodeById(activeId) : undefined;
  const relatedIds = new Set(active?.related ?? []);

  const getProjectTitle = (id: string) =>
    projects.find((p) => p.id === id)?.title ?? id;

  return (
    <section id="stack" className="section-padding section-padding-top-compact bg-[var(--color-bg-elevated)]">
      <div className="container-wide">
        <SectionHeading
          title="Engineering Stack"
          description="Technologies I use to design, build, and deploy backend systems in production."
        />

        <Reveal>
          <div className="mb-6 flex justify-center">
            <div className="rounded-full border border-indigo-500/20 bg-indigo-500/5 px-5 py-2">
              <p className="font-mono text-[10px] tracking-[0.25em] text-indigo-400 uppercase">
                {skillNetworkCenter}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skillCategoryGroups.map((category, ci) => {
            const nodes = getNodesByCategory(category.id);

            return (
              <Reveal key={category.id} delay={ci * 0.04}>
                <div className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 md:p-6">
                  <div className="mb-4 flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-accent)] uppercase">
                      {String(ci + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm font-medium tracking-wide text-white">
                      {category.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {nodes.map((node, ni) => {
                      const isActive = activeId === node.id;
                      const isRelated = relatedIds.has(node.id);
                      const dimmed = activeId && !isActive && !isRelated;

                      return (
                        <motion.button
                          key={node.id}
                          type="button"
                          className={`rounded-lg border px-3 py-2 text-left transition ${
                            isActive
                              ? "border-indigo-500/40 bg-indigo-500/15 text-white"
                              : isRelated
                                ? "border-indigo-500/20 bg-indigo-500/5 text-zinc-200"
                                : "border-[var(--color-border)] bg-white/[0.02] text-zinc-400 hover:border-[var(--color-border-hover)] hover:text-zinc-200"
                          } ${dimmed ? "opacity-40" : "opacity-100"}`}
                          onClick={() => {
                            setActiveId((prev) => (prev === node.id ? null : node.id));
                            play("hover");
                          }}
                          onMouseEnter={() => {
                            if (!prefersHover) return;
                            setActiveId(node.id);
                            play("hover");
                          }}
                          onFocus={() => setActiveId(node.id)}
                          onMouseLeave={() => {
                            if (!prefersHover) return;
                            setActiveId(null);
                          }}
                          onBlur={() => {
                            if (prefersHover) setActiveId(null);
                          }}
                          initial={reduced ? false : { opacity: 0, y: 8 }}
                          whileInView={{ opacity: dimmed ? 0.4 : 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: ni * 0.03 }}
                          whileHover={reduced ? undefined : { y: -2 }}
                        >
                          <span className="font-mono text-xs">{node.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {active && (
          <Reveal>
            <motion.div
              className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 md:p-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-accent)] uppercase">
                {skillCategoryGroups.find((c) => c.id === active.category)?.title}
              </p>
              <p className="mt-2 font-mono text-sm text-white">{active.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {active.description}
              </p>
              {active.projects.length > 0 && (
                <p className="mt-3 font-mono text-[10px] text-zinc-500">
                  Projects: {active.projects.map(getProjectTitle).join(" · ")}
                </p>
              )}
            </motion.div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
