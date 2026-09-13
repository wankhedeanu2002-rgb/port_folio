import { motion } from "framer-motion";
import { site } from "@/data/site";
import { useMouseParallax } from "@/hooks/useParallax";
import { useReducedMotion } from "@/hooks/useScroll";
import { scrollToSection } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { ProfilePortrait } from "@/components/ui/ProfilePortrait";

const heroSequence = {
  label: 0,
  headline: 0.12,
  description: 0.24,
  cta: 0.36,
  profile: 0.44,
  status: 0.68,
};

export function Hero() {
  const reduced = useReducedMotion();
  const bgParallax = useMouseParallax({ strength: 3, enabled: !reduced });

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-x-hidden pb-12 pt-[14rem] section-padding sm:pt-[12.5rem] lg:items-start lg:pt-[12.5rem] lg:pb-16 xl:pt-[13rem]"
    >
      <div
        style={{
          transform: reduced
            ? undefined
            : `translate(${bgParallax.x}px, ${bgParallax.y}px)`,
        }}
        className="absolute inset-0"
      >
        <HeroBackground />
      </div>

      <div
        className="pointer-events-none absolute top-1/4 right-0 h-[70%] w-[55%] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, rgba(99,102,241,0.12) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />

      <div className="container-wide relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-12 lg:pt-6 xl:gap-16 xl:pt-8">
        <div className="order-1">
          <motion.p
            {...fade(heroSequence.label)}
            className="section-index-label mb-6 mt-4 !text-xs tracking-[0.22em] sm:mt-2 sm:!text-[11px] sm:tracking-[0.28em] lg:mt-0 lg:!text-sm lg:tracking-[0.26em] xl:!text-[0.9375rem] xl:tracking-[0.26em]"
          >
            {site.role}
          </motion.p>

          <motion.h1
            {...fade(heroSequence.headline)}
            className="max-w-2xl text-4xl font-semibold leading-[1.06] tracking-tight text-white sm:text-5xl xl:text-[3.5rem]"
          >
            <span className="text-gradient">{site.tagline}</span>
          </motion.h1>

          <motion.p
            {...fade(heroSequence.description)}
            className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg"
          >
            {site.description}
          </motion.p>

          <motion.div
            {...fade(heroSequence.cta)}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button magnetic onClick={() => scrollToSection("#projects")}>
              View My Work
            </Button>
            <Button variant="secondary" onClick={() => scrollToSection("#contact")}>
              Let&apos;s Connect
            </Button>
          </motion.div>

          {site.available && (
            <motion.div
              {...fade(heroSequence.status)}
              className="mt-10 flex items-center gap-2 text-sm text-zinc-400"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              Available for opportunities
            </motion.div>
          )}
        </div>

        <motion.div
          className="order-2 flex justify-center lg:-mt-3 lg:justify-end xl:-mt-4"
          {...fade(heroSequence.profile)}
        >
          <ProfilePortrait delay={heroSequence.profile} />
        </motion.div>
      </div>
    </section>
  );
}
