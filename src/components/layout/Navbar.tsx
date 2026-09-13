import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/site";
import { useScrollPosition } from "@/hooks/useScroll";
import { useSound } from "@/context/SoundContext";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { scrollToSection, cn } from "@/lib/utils";

function AudioDots({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span className="ml-1.5 inline-flex items-end gap-0.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block w-0.5 rounded-full bg-indigo-400/70"
          animate={{ height: [3, 7, 3] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export function Navbar() {
  const scrolled = useScrollPosition(40);
  const [menuOpen, setMenuOpen] = useState(false);
  const { enabled: audioOn, musicActive, toggle: toggleAudio, play } = useSound();

  const handleNav = (href: string) => {
    play("click");
    scrollToSection(href);
    setMenuOpen(false);
  };

  const handleToggleAudio = () => {
    void toggleAudio();
  };

  useEffect(() => {
    if (!menuOpen) return;

    lockBodyScroll();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKey);

    return () => {
      unlockBodyScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-500",
          scrolled ? "py-1 lg:px-8 lg:py-3" : "py-4 lg:px-8 lg:py-5",
        )}
      >
        <nav
          className={cn(
            "mx-auto flex w-[min(100%,72rem)] items-center justify-between transition-all duration-500 md:px-8",
            scrolled
              ? "glass rounded-full border border-[var(--color-border)] px-4 py-1.5 shadow-lg shadow-black/30 backdrop-blur-xl lg:px-8 lg:py-3.5"
              : "px-5 py-1 lg:glass lg:rounded-full lg:border lg:border-[var(--color-border)] lg:bg-black/45 lg:px-8 lg:py-4 lg:shadow-lg lg:shadow-black/25 lg:backdrop-blur-xl",
          )}
          aria-label="Main navigation"
        >
          <button
            type="button"
            onClick={() => handleNav("#hero")}
            className={cn(
              "brand-name brand-name-glow font-mono font-bold uppercase transition hover:opacity-90 lg:ml-0 lg:text-sm lg:tracking-[0.24em]",
              scrolled
                ? "ml-3 text-xs tracking-[0.2em] sm:ml-4"
                : "ml-4 text-sm tracking-[0.22em] sm:ml-5",
            )}
          >
            ANAND
          </button>

          <ul className="hidden items-center gap-6 lg:flex lg:gap-8">
            {site.nav.map((item) => (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={() => handleNav(item.href)}
                  className="font-mono text-[10px] tracking-[0.18em] text-zinc-400 uppercase transition hover:text-white lg:text-[11px] lg:tracking-[0.2em]"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex lg:gap-5">
            <button
              type="button"
              onClick={handleToggleAudio}
              className="group inline-flex items-center font-mono text-[10px] tracking-[0.15em] text-zinc-500 uppercase transition hover:text-white lg:text-[11px]"
              aria-pressed={audioOn}
              aria-label={audioOn ? "Disable audio" : "Enable ambient audio and UI sounds"}
              title="Enable ambient audio and interface sounds"
            >
              <span>AUDIO · {audioOn ? "ON" : "OFF"}</span>
              <AudioDots active={audioOn && musicActive} />
            </button>
            <a
              href={site.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => play("click")}
              className="font-mono text-[10px] tracking-[0.15em] text-zinc-400 uppercase transition hover:text-white lg:text-[11px]"
            >
              Resume
            </a>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 lg:hidden">
            <button
              type="button"
              onClick={handleToggleAudio}
              className={cn(
                "inline-flex items-center justify-center font-mono tracking-wider text-zinc-500 transition-all duration-500",
                scrolled
                  ? "min-h-11 min-w-11 text-[8px]"
                  : "min-h-11 min-w-11 text-[9px]",
              )}
              aria-pressed={audioOn}
            >
              {audioOn ? "AUDIO ON" : "AUDIO OFF"}
            </button>
            <button
              type="button"
              className={cn(
                "relative z-50 flex items-center justify-center transition-all duration-500",
                scrolled ? "h-11 w-11" : "h-10 w-10",
              )}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <div className="flex w-5 flex-col gap-1.5">
                <motion.span
                  className="block h-px w-full bg-white"
                  animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                />
                <motion.span
                  className="block h-px w-full bg-white"
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span
                  className="block h-px w-full bg-white"
                  animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[45] flex flex-col bg-black/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-1 flex-col justify-center gap-6 px-8 pt-20">
              {site.nav.map((item, i) => (
                <motion.button
                  key={item.href}
                  type="button"
                  onClick={() => handleNav(item.href)}
                  className="text-left font-mono text-2xl tracking-[0.15em] text-white uppercase"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.06 }}
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.button
                type="button"
                onClick={handleToggleAudio}
                className="text-left font-mono text-lg tracking-[0.15em] text-zinc-400 uppercase"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: site.nav.length * 0.06 }}
              >
                Audio · {audioOn ? "On" : "Off"}
              </motion.button>
              <motion.a
                href={site.resumePath}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => play("click")}
                className="font-mono text-lg tracking-[0.15em] text-zinc-400 uppercase"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (site.nav.length + 1) * 0.06 }}
              >
                Resume
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
