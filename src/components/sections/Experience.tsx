import { useRef, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { experience } from "@/data/experience";
import type { ExperienceItem } from "@/types";
import { useReducedMotion, useIsDesktop } from "@/hooks/useScroll";
import {
  useExperienceScrollStep,
  getExperienceBlend,
  EXPERIENCE_BLEND_START,
  EXPERIENCE_BLEND_END,
} from "@/hooks/useExperienceScrollStep";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

const STEP_SCROLL_VH_DESKTOP = 130;
const STEP_SCROLL_VH_MOBILE = 145;
const MOBILE_BLEND_START = 0.26;
const MOBILE_BLEND_END = 0.74;
const SECTION_X = "px-5 sm:px-6 md:px-8";
const STICKY_TOP = "top-[var(--sticky-offset)]";

function ExperienceDetailCard({
  item,
  isActive,
  reduced,
  compact = false,
  showTech = true,
}: {
  item: ExperienceItem;
  isActive: boolean;
  reduced: boolean | null;
  compact?: boolean;
  showTech?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-[var(--color-bg-card)] transition-[border-color,box-shadow] duration-500",
        compact ? "p-4 sm:p-5 md:p-6" : "p-5 sm:p-6 md:p-8",
        isActive
          ? "border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.08)]"
          : "border-[var(--color-border)]",
      )}
    >
      <div className={compact ? "mb-3 sm:mb-4" : "mb-6"}>
        <h3 className="text-lg font-semibold text-white sm:text-xl md:text-2xl">{item.role}</h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{item.company}</p>
        <p className="text-xs text-[var(--color-text-subtle)] md:text-sm">
          {item.location} · {item.period}
        </p>
      </div>

      <p
        className={cn(
          "text-sm leading-relaxed",
          compact ? "mb-3 sm:mb-4" : "mb-6",
          isActive ? "text-zinc-300" : "text-[var(--color-text-muted)]",
        )}
      >
        {item.summary}
      </p>

      <ul className={cn("space-y-2", compact ? "mb-3 sm:mb-4" : "mb-8")}>
        {item.highlights.map((h, i) => (
          <motion.li
            key={h}
            className="flex gap-3 text-sm leading-relaxed break-words text-zinc-300"
            initial={reduced ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
            {h}
          </motion.li>
        ))}
      </ul>

      {showTech && (
        <div className="flex flex-wrap gap-1.5">
          {item.technologies.map((tech, i) => (
            <motion.span
              key={tech}
              className="rounded-full border border-[var(--color-border)] bg-white/[0.03] px-2.5 py-1 font-mono text-[9px] tracking-wide text-zinc-400 uppercase md:text-[10px]"
              initial={reduced ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.03 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Experience() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [manualStep, setManualStep] = useState(0);
  const scrollEnabled = !reduced && experience.length > 1;
  const stepScrollVh = isDesktop ? STEP_SCROLL_VH_DESKTOP : STEP_SCROLL_VH_MOBILE;
  const blendStart = isDesktop ? EXPERIENCE_BLEND_START : MOBILE_BLEND_START;
  const blendEnd = isDesktop ? EXPERIENCE_BLEND_END : MOBILE_BLEND_END;

  const { step: scrollStep, scrollYProgress } = useExperienceScrollStep({
    sectionRef: scrollTrackRef,
    stepCount: experience.length,
    enabled: scrollEnabled,
    blendStart,
    blendEnd,
  });

  const step = scrollEnabled ? scrollStep : manualStep;

  const scrollBlend = useTransform(scrollYProgress, (progress) =>
    getExperienceBlend(progress, blendStart, blendEnd),
  );

  const currentOpacity = useTransform(scrollBlend, (v) => 1 - v);
  const previousOpacity = scrollBlend;
  const currentY = useTransform(scrollBlend, (v) => v * (isDesktop ? -20 : -12));
  const previousY = useTransform(scrollBlend, (v) => (1 - v) * (isDesktop ? 20 : 12));
  const currentScale = useTransform(scrollBlend, (v) => 1 - v * 0.02);
  const previousScale = useTransform(scrollBlend, (v) => 0.98 + v * 0.02);

  const activeId = experience[step]?.id ?? experience[0]?.id ?? "";
  const active = experience.find((e) => e.id === activeId);

  const lineProgress = useTransform(scrollYProgress, [0, blendEnd], [0.35, 1]);

  const trackHeight = scrollEnabled
    ? `${100 + (experience.length - 1) * stepScrollVh}vh`
    : undefined;

  const scrollToStep = (index: number) => {
    if (scrollEnabled) {
      const el = scrollTrackRef.current;
      if (!el) return;
      const targetProgress =
        index === 0
          ? blendStart * 0.45
          : blendEnd + (1 - blendEnd) * 0.55;
      const scrollRange = el.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: el.offsetTop + scrollRange * targetProgress,
        behavior: "smooth",
      });
    } else {
      setManualStep(index);
    }
  };

  return (
    <section id="experience" className="relative bg-[var(--color-bg-elevated)]">
      {scrollEnabled ? (
        <>
          <div className={cn("pt-4 pb-3 lg:hidden", SECTION_X)}>
            <div className="container-wide w-full">
              <SectionHeading
                title="Where I've built production systems"
                className="mb-0 text-center lg:text-left [&_h2]:text-2xl"
              />
            </div>
          </div>

          <div
            ref={scrollTrackRef}
            className="relative pt-1 lg:pt-4"
            style={{ height: trackHeight }}
            aria-label="Experience scroll track"
          >
            <div className={cn("sticky z-10 bg-[var(--color-bg-elevated)] pb-6 lg:pb-12", STICKY_TOP, SECTION_X)}>
              <div className="container-wide mx-auto w-full max-w-[72rem] pt-5 sm:pt-6 lg:pt-1">
                <SectionHeading
                  title="Where I've built production systems"
                  className="mb-3 hidden text-center lg:mb-7 lg:block lg:text-left [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:lg:text-4xl"
                />

                <div className="mb-3 mt-1 flex flex-wrap items-center justify-center gap-2 sm:mb-4 sm:mt-0 sm:gap-3 lg:mb-6 lg:mt-2 lg:justify-start">
                  {experience.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToStep(i)}
                      className={cn(
                        "flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 font-mono text-[10px] tracking-wider uppercase transition sm:px-4",
                        step === i
                          ? "border-indigo-500/40 bg-indigo-500/10 text-white"
                          : "border-[var(--color-border)] text-zinc-500 hover:text-zinc-300",
                      )}
                      aria-current={step === i ? "step" : undefined}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                          step === i ? "bg-indigo-400" : "bg-zinc-600",
                        )}
                      />
                      {i === 0 ? "Current" : "Previous"}
                    </button>
                  ))}
                  <span className="ml-auto hidden font-mono text-[10px] tracking-widest text-zinc-600 sm:inline">
                    Scroll to explore
                  </span>
                </div>

                {!isDesktop && (
                  <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/[0.06] sm:mb-4">
                    <motion.div
                      className="h-full origin-left rounded-full bg-gradient-to-r from-indigo-500/70 to-violet-400/50"
                      style={{ scaleX: scrollBlend }}
                    />
                  </div>
                )}

                {!isDesktop && (
                  <p className="mb-3 text-center font-mono text-[9px] tracking-widest text-zinc-600 uppercase sm:mb-4 lg:text-left">
                    Scroll the page to switch roles
                  </p>
                )}

                <ExperienceGrid
                  reduced={reduced}
                  scrollEnabled
                  step={step}
                  activeId={activeId}
                  isDesktop={isDesktop}
                  currentOpacity={currentOpacity}
                  previousOpacity={previousOpacity}
                  currentY={currentY}
                  previousY={previousY}
                  currentScale={currentScale}
                  previousScale={previousScale}
                  lineProgress={lineProgress}
                  scrollToStep={scrollToStep}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="section-padding">
          <div className="container-wide w-full">
            <SectionHeading title="Where I've built production systems" />

            <div className="mb-6 flex flex-wrap items-center gap-3">
              {experience.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToStep(i)}
                  className={cn(
                    "flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] tracking-wider uppercase transition",
                    step === i
                      ? "border-indigo-500/40 bg-indigo-500/10 text-white"
                      : "border-[var(--color-border)] text-zinc-500 hover:text-zinc-300",
                  )}
                  aria-current={step === i ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                      step === i ? "bg-indigo-400" : "bg-zinc-600",
                    )}
                  />
                  {i === 0 ? "Current" : "Previous"}
                </button>
              ))}
            </div>

            {active && <ExperienceDetailCard item={active} isActive reduced={reduced} />}
          </div>
        </div>
      )}
    </section>
  );
}

function ExperienceGrid({
  reduced,
  scrollEnabled,
  step,
  activeId,
  isDesktop,
  currentOpacity,
  previousOpacity,
  currentY,
  previousY,
  currentScale,
  previousScale,
  lineProgress,
  scrollToStep,
}: {
  reduced: boolean | null;
  scrollEnabled: boolean;
  step: number;
  activeId: string;
  isDesktop: boolean;
  currentOpacity: ReturnType<typeof useTransform<number, number>>;
  previousOpacity: ReturnType<typeof useTransform<number, number>>;
  currentY: ReturnType<typeof useTransform<number, number>>;
  previousY: ReturnType<typeof useTransform<number, number>>;
  currentScale: ReturnType<typeof useTransform<number, number>>;
  previousScale: ReturnType<typeof useTransform<number, number>>;
  lineProgress: ReturnType<typeof useTransform<number, number>>;
  scrollToStep: (index: number) => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start lg:gap-8">
      <Reveal className="relative hidden lg:block">
        <div className="absolute top-0 bottom-0 left-3 w-px bg-[var(--color-border)]" />
        {!reduced && scrollEnabled && (
          <motion.div
            className="absolute top-0 left-3 w-px origin-top bg-[var(--color-accent)]"
            style={{ scaleY: lineProgress, height: "100%" }}
          />
        )}

        <div className="space-y-1">
          {experience.map((item, i) => {
            const current = item.id === experience[0]?.id;
            const isActive = activeId === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToStep(i)}
                className="group relative flex w-full items-start gap-4 py-3 pl-8 text-left transition md:py-4"
                aria-expanded={isActive}
              >
                <span
                  className={cn(
                    "absolute top-5 left-1.5 h-3 w-3 rounded-full border-2 transition-all duration-500 md:top-6",
                    isActive
                      ? "scale-100 border-[var(--color-accent)] bg-[var(--color-accent)] shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      : "scale-90 border-zinc-600 bg-[var(--color-bg)] group-hover:border-zinc-400",
                  )}
                />
                <div>
                  {current && (
                    <span className="mb-1 inline-block font-mono text-[9px] tracking-widest text-emerald-400 uppercase">
                      Current
                    </span>
                  )}
                  <p className="font-mono text-[10px] tracking-widest text-[var(--color-text-subtle)] uppercase">
                    {item.period}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-sm font-medium transition-colors duration-500",
                      isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200",
                      current && "text-base",
                    )}
                  >
                    {item.role}
                  </p>
                  <p className="text-xs text-[var(--color-text-subtle)]">{item.company}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="min-w-0 touch-pan-y">
        <div className="relative grid lg:min-h-[420px] [&>*]:col-start-1 [&>*]:row-start-1">
          {experience.map((item, i) => {
            const isCurrentCard = i === 0;
            const opacity = isCurrentCard ? currentOpacity : previousOpacity;
            const y = isCurrentCard ? currentY : previousY;
            const scale = isCurrentCard ? currentScale : previousScale;

            return (
              <motion.div
                key={item.id}
                className="col-start-1 row-start-1 self-start will-change-[opacity,transform]"
                style={{
                  opacity,
                  y,
                  scale,
                  pointerEvents: step === i ? "auto" : "none",
                  zIndex: step === i ? 2 : 1,
                }}
              >
                <ExperienceDetailCard
                  item={item}
                  isActive={step === i}
                  reduced={reduced}
                  compact
                  showTech={isDesktop}
                />
              </motion.div>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
