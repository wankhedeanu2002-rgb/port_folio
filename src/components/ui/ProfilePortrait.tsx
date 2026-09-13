import { motion } from "framer-motion";
import profileImage from "@/assets/profile.jpg";
import { heroTags } from "@/data/site";
import { useMouseParallax } from "@/hooks/useParallax";
import { useReducedMotion } from "@/hooks/useScroll";

interface ProfilePortraitProps {
  delay?: number;
}

export function ProfilePortrait({ delay = 0.5 }: ProfilePortraitProps) {
  const reduced = useReducedMotion();
  const parallax = useMouseParallax({ strength: 5, enabled: !reduced });
  const glowParallax = useMouseParallax({ strength: 3, enabled: !reduced });

  return (
    <div className="relative flex w-full items-center justify-center lg:justify-end">
      <motion.div
        className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] xl:max-w-[480px]"
        initial={reduced ? false : { opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{
          transform: reduced
            ? undefined
            : `translate(${parallax.x}px, ${parallax.y}px)`,
        }}
      >
        {/* Ambient glow behind portrait */}
        <div
          className="pointer-events-none absolute -inset-4 rounded-[2rem] opacity-60 sm:-inset-8"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.22) 0%, rgba(99,102,241,0.06) 45%, transparent 72%)",
            transform: reduced
              ? undefined
              : `translate(${glowParallax.x}px, ${glowParallax.y}px)`,
          }}
        />

        {/* Decorative frame ring */}
        <div className="pointer-events-none absolute -inset-[1px] rounded-[1.35rem] bg-gradient-to-br from-indigo-500/40 via-white/10 to-indigo-600/20 opacity-80" />
        <div className="pointer-events-none absolute -inset-3 rounded-[1.5rem] border border-white/[0.06]" />

        {!reduced &&
          heroTags.map((tag, i) => (
            <motion.span
              key={tag}
              className="absolute z-20 hidden rounded-full border border-[var(--color-border)] bg-black/75 px-3 py-1.5 font-mono text-[10px] tracking-wider text-zinc-300 backdrop-blur-md md:block"
              style={{
                top: `${[8, 18, 78, 86, 38, 52][i]}%`,
                left: `${[-8, 92, -6, 90, -18, 96][i]}%`,
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 4.5 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay + i * 0.15,
              }}
            >
              {tag}
            </motion.span>
          ))}

        <div className="gradient-border profile-glow relative aspect-[4/5] overflow-hidden rounded-[1.25rem] shadow-2xl shadow-black/50">
          <img
            src={profileImage}
            alt="Anand Vankhede — Python Backend Developer"
            width={500}
            height={625}
            className="block h-full w-full object-cover object-[center_15%] lg:object-[center_18%]"
            loading="eager"
            fetchPriority="high"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-indigo-500/[0.06]" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>

        {/* Bottom accent line */}
        <div className="pointer-events-none absolute -bottom-4 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      </motion.div>
    </div>
  );
}
