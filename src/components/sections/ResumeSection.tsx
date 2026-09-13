import { site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function ResumeSection() {
  return (
    <section id="resume" className="section-padding bg-[var(--color-bg-elevated)]">
      <div className="container-narrow text-center">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Want the complete story?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[var(--color-text-muted)]">
            Download my resume for a detailed view of my experience, skills, and backend engineering work.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href={site.resumePath} variant="primary">
              View Resume
            </Button>
            <Button href={site.resumePath} variant="secondary" download="Anand_Vankhede_Resume.pdf">
              Download Resume
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
