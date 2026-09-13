import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useScroll";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "mb-8 md:mb-10",
        align === "center" && "text-center mx-auto max-w-2xl",
        className,
      )}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      {label && (
        <p className={cn("section-index-label mb-4", align === "center" && "pl-0 text-center")}>
          {label}
        </p>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)] md:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}
