import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ExternalLink, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/data/site";
import { useSound } from "@/context/SoundContext";
import { useReducedMotion } from "@/hooks/useScroll";
import { scrollToSection } from "@/lib/utils";

export function Footer() {
  const reduced = useReducedMotion();
  const { play } = useSound();

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    play("transition");
  };

  const handleNav = (href: string) => {
    play("click");
    scrollToSection(href);
  };

  return (
    <footer className="relative mt-0 overflow-hidden border-t border-white/[0.08] bg-[linear-gradient(180deg,#09090b_0%,#030303_55%,#020202_100%)] pb-0">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />

      <div className="pointer-events-none absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-32 h-56 w-56 rounded-full bg-violet-600/8 blur-3xl" />

      <div className="container-wide relative z-10 px-5 pt-10 pb-2 sm:px-8 sm:pt-12 sm:pb-3 md:pt-14">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm sm:rounded-3xl"
        >
          <div className="p-6 sm:p-8 md:p-10">
            <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.05fr_0.75fr_0.85fr] lg:gap-10">
              <div>
                <h2 className="leading-none">
                  <span className="brand-name brand-name-glow block font-mono text-[clamp(1.85rem,5.5vw,2.85rem)] font-bold tracking-[0.16em]">
                    ANAND
                  </span>
                  <span className="mt-1.5 block text-base font-medium tracking-tight text-zinc-300 sm:text-lg">
                    Vankhede
                  </span>
                </h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">{site.role}</p>
                {site.available && (
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/[0.08] px-3 py-1 font-mono text-[10px] tracking-wider text-indigo-200/90 uppercase">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
                    Open to opportunities
                  </span>
                )}
              </div>

              <nav aria-label="Footer navigation">
                <p className="mb-4 font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase">
                  Explore
                </p>
                <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {site.footerNav.map((item) => (
                    <li key={item.href}>
                      <button
                        type="button"
                        onClick={() => handleNav(item.href)}
                        className="group flex min-h-10 w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-zinc-400 transition hover:bg-white/[0.04] hover:text-white"
                      >
                        <span className="h-1 w-1 rounded-full bg-indigo-500/0 transition group-hover:bg-indigo-400/80" />
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1">
                <p className="font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase">
                  Connect
                </p>
                <div className="flex flex-col gap-2">
                  <FooterLink
                    href={`mailto:${site.email.address}`}
                    icon={<Mail size={15} />}
                    label={site.email.address}
                    onHover={() => play("hover")}
                  />
                  <FooterLink
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    icon={<Phone size={15} />}
                    label={site.phone}
                    onHover={() => play("hover")}
                  />
                  <FooterLink
                    href={site.linkedin}
                    icon={<Linkedin size={15} />}
                    label="LinkedIn"
                    external
                    onHover={() => play("hover")}
                  />
                  {site.resumePath && (
                    <FooterLink
                      href={site.resumePath}
                      icon={<ExternalLink size={14} />}
                      label="View Resume"
                      external
                      accent
                      onHover={() => play("hover")}
                    />
                  )}
                </div>
                <p className="inline-flex items-center gap-2 text-xs text-zinc-500">
                  <MapPin size={13} className="text-indigo-400/70" />
                  {site.location}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-left text-[11px] text-zinc-600">
                © {new Date().getFullYear()} {site.name}
              </p>
              <button
                type="button"
                onClick={scrollTop}
                className="group hidden min-h-10 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 text-[11px] font-mono tracking-[0.14em] text-zinc-400 uppercase transition hover:border-indigo-500/35 hover:bg-indigo-500/10 hover:text-white active:scale-[0.98] sm:inline-flex"
              >
                Back to Top
                <ArrowUp size={13} className="transition group-hover:-translate-y-0.5 group-hover:text-indigo-300" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="footer-watermark-zone relative z-[1] -mt-1 sm:-mt-2">
        <p className="anand-watermark" aria-hidden="true">
          ANAND
        </p>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  icon,
  label,
  external,
  accent,
  onHover,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  external?: boolean;
  accent?: boolean;
  onHover?: () => void;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseEnter={onHover}
      className={`inline-flex min-h-10 items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2 text-sm transition hover:border-white/10 hover:bg-white/[0.04] ${
        accent ? "text-indigo-300/90 hover:text-indigo-200" : "text-zinc-400 hover:text-white"
      }`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03] text-indigo-400/80">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </a>
  );
}
