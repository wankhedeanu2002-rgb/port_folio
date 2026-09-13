import { useState } from "react";
import { motion } from "framer-motion";
import { approachSteps } from "@/data/site";
import { useReducedMotion } from "@/hooks/useScroll";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Approach() {
  const [active, setActive] = useState(approachSteps[0]?.id ?? "");
  const reduced = useReducedMotion();
  const current = approachSteps.find((s) => s.id === active);

  return (
    <section id="approach" className="section-padding">
      <div className="container-wide">
        <SectionHeading title="How I approach backend problems" />

        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-2">
              {approachSteps.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActive(step.id)}
                  onMouseEnter={() => setActive(step.id)}
                  className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition ${
                    active === step.id
                      ? "border-indigo-500/30 bg-indigo-500/10"
                      : "border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-hover)]"
                  }`}
                >
                  <span className="font-mono text-2xl font-light text-zinc-600">{step.number}</span>
                  <span
                    className={`text-sm font-medium ${
                      active === step.id ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <motion.div
              key={active}
              initial={reduced ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="flex h-full flex-col justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 sm:p-8"
            >
              {current && (
                <>
                  <p className="font-mono text-xs tracking-[0.2em] text-[var(--color-accent)] uppercase">
                    Step {current.number}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{current.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
                    {current.description}
                  </p>
                </>
              )}
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
