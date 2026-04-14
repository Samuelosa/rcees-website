import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects, images } from "@/lib/constants";

export const metadata: Metadata = { title: "Projects", description: "Active and completed research projects at RCEES." };

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Active research and partnerships."
        lead="RCEES leads and participates in research projects spanning the water–energy–food nexus, renewable integration, engineering education and climate resilience. Each project is run in partnership with African and international institutions."
        image={images.projects}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />

      <section className="container-rcees py-24">
        <SectionHeading eyebrow="Portfolio" title="Current and recent projects." />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <article key={p.title} className="flex h-full flex-col border border-rule bg-paper p-8">
              <div className="flex items-center justify-between">
                <span className="inline-block border border-forest px-3 py-1 text-xs uppercase tracking-wider text-forest">
                  {p.status}
                </span>
                <span className="font-mono text-xs text-muted">{p.funder}</span>
              </div>
              <h3 className="mt-5 font-serif text-2xl text-ink">{p.title}</h3>
              <p className="mt-4 flex-1 text-[0.975rem] leading-relaxed text-ink/75">{p.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
