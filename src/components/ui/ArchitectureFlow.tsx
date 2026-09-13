import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { architectureNodes, architectureServices } from "@/data/architecture";
import { useReducedMotion, usePrefersHover } from "@/hooks/useScroll";
import { useSound } from "@/context/SoundContext";

interface ArchitectureFlowProps {
  animated?: boolean;
  interactive?: boolean;
}

export function ArchitectureFlow({ animated = false, interactive = false }: ArchitectureFlowProps) {
  const reduced = useReducedMotion();
  const prefersHover = usePrefersHover();
  const { play } = useSound();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [packetIndex, setPacketIndex] = useState(0);

  const active = architectureNodes.find((n) => n.id === activeId);

  const selectNode = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (!animated || reduced || !interactive) return;
    play("dataFlow");
    const interval = setInterval(() => {
      setPacketIndex((i) => (i + 1) % architectureNodes.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [animated, reduced, interactive, play]);

  const Wrapper = animated ? motion.div : "div";
  const wrapperProps = animated
    ? {
        initial: reduced ? false : { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.6 },
      }
    : {};

  const firstHalf = architectureNodes.slice(0, 5);
  const secondHalf = architectureNodes.slice(5);

  return (
    <Wrapper
      {...wrapperProps}
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 font-mono text-xs"
    >
      <p className="mb-6 text-[var(--color-text-subtle)]">Architecture Flow</p>

      <div className="flex flex-col items-center gap-2">
        {firstHalf.map((node, i) => (
          <InteractiveNode
            key={node.id}
            node={node}
            index={i}
            animated={animated}
            reduced={reduced}
            interactive={interactive}
            active={activeId === node.id}
            packetHere={interactive && packetIndex === i}
            onHover={() => setActiveId(node.id)}
            onLeave={() => {
              if (prefersHover) setActiveId(null);
            }}
            onSelect={() => selectNode(node.id)}
            showArrow
          />
        ))}

        <div className="my-2 grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-4">
          {architectureServices.map((svc, i) => (
            <motion.div
              key={svc}
              className="rounded-lg border border-[var(--color-border)] bg-white/[0.03] px-2 py-2 text-center text-[10px] text-zinc-400"
              initial={animated && !reduced ? { opacity: 0, scale: 0.9 } : false}
              whileInView={animated && !reduced ? { opacity: 1, scale: 1 } : undefined}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              {svc}
            </motion.div>
          ))}
        </div>

        {secondHalf.map((node, i) => (
          <InteractiveNode
            key={node.id}
            node={node}
            index={i + 5}
            animated={animated}
            reduced={reduced}
            interactive={interactive}
            active={activeId === node.id}
            packetHere={interactive && packetIndex === i + 5}
            onHover={() => setActiveId(node.id)}
            onLeave={() => {
              if (prefersHover) setActiveId(null);
            }}
            onSelect={() => selectNode(node.id)}
            showArrow={i < secondHalf.length - 1}
          />
        ))}
      </div>

      {interactive && active && (
        <motion.p
          className="mt-4 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 text-[11px] leading-relaxed text-zinc-400"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {active.description}
        </motion.p>
      )}
    </Wrapper>
  );
}

function InteractiveNode({
  node,
  index,
  animated,
  reduced,
  interactive,
  active,
  packetHere,
  onHover,
  onLeave,
  onSelect,
  showArrow = true,
}: {
  node: { id: string; label: string; description: string };
  index: number;
  animated: boolean;
  reduced: boolean;
  interactive: boolean;
  active: boolean;
  packetHere: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
  showArrow?: boolean;
}) {
  return (
    <>
      <motion.div
        className={`relative w-full max-w-xs rounded-lg border px-4 py-2.5 text-center transition ${
          active || packetHere
            ? "border-indigo-500/40 bg-indigo-500/10 text-white"
            : "border-[var(--color-border)] bg-white/[0.04] text-zinc-300"
        } ${interactive ? "cursor-pointer" : ""}`}
        initial={animated && !reduced ? { opacity: 0, x: -10 } : false}
        whileInView={animated && !reduced ? { opacity: 1, x: 0 } : undefined}
        viewport={{ once: true }}
        transition={{ delay: index * 0.06 }}
        onMouseEnter={interactive ? onHover : undefined}
        onMouseLeave={interactive ? onLeave : undefined}
        onClick={interactive ? onSelect : undefined}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect();
                }
              }
            : undefined
        }
      >
        {packetHere && (
          <motion.span
            className="absolute -left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-indigo-400"
            layoutId="data-packet"
          />
        )}
        {node.label}
      </motion.div>
      {showArrow && (
        <motion.span
          className={`text-[var(--color-text-subtle)] ${packetHere ? "text-indigo-400/60" : ""}`}
          initial={animated && !reduced ? { opacity: 0 } : false}
          whileInView={animated && !reduced ? { opacity: 1 } : undefined}
          viewport={{ once: true }}
          transition={{ delay: index * 0.06 + 0.03 }}
        >
          ↓
        </motion.span>
      )}
    </>
  );
}
