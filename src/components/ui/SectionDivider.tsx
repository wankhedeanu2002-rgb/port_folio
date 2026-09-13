import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  label?: string;
  className?: string;
}

export function SectionDivider({ label, className }: SectionDividerProps) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("relative section-padding-x py-3 sm:py-4", className)} aria-hidden="true">
      <div className="container-wide">
        <motion.div
          className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"
          initial={reduced ? false : { scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        {label && (
          <motion.p
            className="section-index-label mt-2.5"
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {label}
          </motion.p>
        )}
      </div>
    </div>
  );
}
