import { motion } from "framer-motion";
import {
  Cloud,
  Database,
  Gauge,
  Radio,
  Server,
  Shield,
} from "lucide-react";
import { aboutCards, aboutIntro } from "@/data/site";
import { useReducedMotion } from "@/hooks/useScroll";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const iconMap = {
  api: Server,
  database: Database,
  cloud: Cloud,
  realtime: Radio,
  security: Shield,
  performance: Gauge,
};

export function About() {
  const reduced = useReducedMotion();

  return (
    <section id="about" className="section-padding section-padding-top-compact">
      <div className="container-wide">
        <SectionHeading
          title="Backend by mindset. Product-focused by nature."
        />

        <Reveal>
          <p className="mb-12 max-w-3xl text-lg leading-relaxed text-[var(--color-text-muted)] md:text-xl">
            {aboutIntro}
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {aboutCards.map((card, i) => {
            const Icon = iconMap[card.icon as keyof typeof iconMap] ?? Server;

            return (
              <motion.div
                key={card.id}
                className="group card-hover rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6"
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                whileHover={reduced ? undefined : { y: -4 }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white/[0.03] text-[var(--color-accent)] transition group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10">
                  <Icon size={18} />
                </div>
                <h3 className="font-mono text-xs tracking-[0.15em] text-white uppercase">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
