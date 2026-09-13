import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Linkedin, Mail, Copy, Check, Phone, Sparkles } from "lucide-react";
import { site } from "@/data/site";
import { useSound } from "@/context/SoundContext";
import { useReducedMotion } from "@/hooks/useScroll";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function Contact() {
  const { play } = useSound();
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const emailEnabled = site.email.enabled && site.email.address.length > 0;

  const copyEmail = async () => {
    if (!emailEnabled) return;
    await navigator.clipboard.writeText(site.email.address);
    setCopied(true);
    play("success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="section-padding pb-16 sm:pb-20">
      <div className="container-wide">
        <Reveal>
          <p className="section-index-label mb-5">
            06 — Contact
          </p>

          <div className="relative overflow-hidden rounded-[1.75rem] border border-indigo-500/15 sm:rounded-[2rem] lg:grid lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              className="accent-beam-rise pointer-events-none absolute bottom-0 left-1/2 z-0 h-[32%] -translate-x-1/2 sm:h-[38%] lg:h-[40%]"
              initial={reduced ? false : { opacity: 0, scaleY: 0 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={
                reduced ? { duration: 0 } : { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
              }
              aria-hidden="true"
            />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.025)_0%,transparent_50%,rgba(99,102,241,0.03)_100%)]" />
            <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-blue-500/[0.03] blur-3xl sm:h-72 sm:w-72 sm:bg-blue-500/[0.05]" />
            <div className="pointer-events-none absolute -right-16 top-0 h-44 w-44 rounded-full bg-indigo-500/[0.035] blur-3xl sm:h-56 sm:w-56 sm:bg-indigo-500/[0.05]" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-400/10 to-transparent" />

            <div className="relative z-10 border-b border-white/[0.06] p-6 sm:p-10 md:p-12 lg:border-b-0 lg:border-r lg:border-white/[0.05] lg:p-14">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/[0.1] px-3 py-1 font-mono text-[10px] tracking-wider text-indigo-200/90 uppercase">
                <Sparkles size={12} className="text-indigo-300" />
                Let&apos;s collaborate
              </div>

              <h2 className="text-[clamp(2rem,7vw,4.5rem)] font-semibold leading-[0.95] tracking-tight text-white">
                LET&apos;S BUILD
                <br />
                SOMETHING
                <br />
                <span className="bg-gradient-to-r from-blue-200 via-white to-indigo-300 bg-clip-text text-transparent">
                  RELIABLE.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400">
                For backend engineering, API development, system architecture, and product
                engineering opportunities.
              </p>

              <div className="mt-8 hidden items-center gap-3 text-xs text-zinc-500 sm:flex">
                <span className="h-px w-8 bg-indigo-500/45" />
                {site.location}
              </div>
            </div>

            <div className="relative z-10 bg-black/35 p-6 sm:p-8 lg:p-10">
              <div className="space-y-5">
                <ContactRow label="Email">
                  {emailEnabled ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      <a
                        href={`mailto:${site.email.address}`}
                        className="group inline-flex min-w-0 items-center gap-2 break-all text-sm text-zinc-100 transition hover:text-white"
                        onMouseEnter={() => play("hover")}
                      >
                        <Mail size={16} className="shrink-0 text-indigo-400" />
                        {site.email.address}
                      </a>
                      <button
                        type="button"
                        onClick={copyEmail}
                        className="inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-zinc-400 transition hover:border-indigo-500/35 hover:bg-indigo-500/10 hover:text-white active:scale-[0.98] sm:w-auto"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? "Copied" : "Copy Email"}
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-zinc-500">Email coming soon</span>
                  )}
                </ContactRow>

                <ContactRow label="Phone">
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="group inline-flex items-center gap-2 text-sm text-zinc-100 transition hover:text-white"
                    onMouseEnter={() => play("hover")}
                  >
                    <Phone size={16} className="text-indigo-400" />
                    {site.phone}
                  </a>
                </ContactRow>

                <ContactRow label="LinkedIn">
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-w-0 items-center gap-2 break-all text-sm text-zinc-100 transition hover:text-white"
                    onMouseEnter={() => play("hover")}
                  >
                    <Linkedin size={16} className="text-indigo-400" />
                    linkedin.com/in/anand-vankhede
                    <ExternalLink
                      size={12}
                      className="text-zinc-500 transition group-hover:text-zinc-300"
                    />
                  </a>
                </ContactRow>
              </div>

              <Button
                magnetic
                className="group mt-8 w-full justify-center text-base sm:w-auto"
                onClick={() => {
                  play("click");
                  window.open(site.linkedin, "_blank", "noopener,noreferrer");
                }}
              >
                Start a Conversation
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Button>

              <p className="mt-5 text-xs text-zinc-600 sm:hidden">{site.location}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-indigo-500/10 bg-white/[0.02] p-4">
      <p className="mb-2.5 font-mono text-[10px] tracking-[0.2em] text-indigo-400/65 uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}
