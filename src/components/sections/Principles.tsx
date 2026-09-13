import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { principles } from "@/data/site";
import { useReducedMotion } from "@/hooks/useScroll";

export function Principles() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section className="section-padding border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <div ref={containerRef} className="container-narrow">
        <ul className={reduced ? "space-y-6" : "space-y-0"}>
          {principles.map((p, i) => (
            <PrincipleItem
              key={p.id}
              text={p.text}
              index={i}
              total={principles.length}
              scrollYProgress={scrollYProgress}
              reduced={reduced}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function PrincipleItem({
  text,
  index,
  total,
  scrollYProgress,
  reduced,
}: {
  text: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduced: boolean;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.1, end - 0.1, end],
    [0.25, 1, 1, 0.25],
  );
  const scale = useTransform(
    scrollYProgress,
    [start, start + 0.1, end - 0.1, end],
    [0.92, 1, 1, 0.92],
  );
  const y = useTransform(scrollYProgress, [start, end], [32, -32]);

  if (reduced) {
    return (
      <li className="py-4 text-center text-2xl font-medium text-white sm:text-3xl">{text}</li>
    );
  }

  return (
    <motion.li
      className="flex min-h-[28vh] items-center justify-center py-8 sm:min-h-[32vh] md:min-h-[40vh] md:py-8"
      style={{ opacity, scale, y }}
    >
      <span className="text-center text-2xl font-medium tracking-tight text-white sm:text-3xl md:text-5xl lg:text-6xl">
        {text}
      </span>
    </motion.li>
  );
}
