import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { researchThemes, images } from "@/lib/constants";
import { PublicationsExplorer } from "@/components/research/PublicationsExplorer";

export const metadata: Metadata = {
  title: "Research",
  description: "Research themes, publications and agenda at RCEES.",
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Four themes, one agenda."
        lead="RCEES's research programme is organised around four themes that capture the most consequential questions facing Africa's energy systems and environment. Each theme supports doctoral training, professional practice and policy engagement."
        image={images.researchHero}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Research" }]}
      />

      <section className="container-rcees py-24">
        <SectionHeading eyebrow="Themes" title="The questions we work on." />
        <ol className="mt-14 grid gap-px border border-rule bg-rule md:grid-cols-2">
          {researchThemes.map((t, i) => (
            <li key={t.title} className="bg-paper p-10">
              <p className="font-mono text-xs text-muted">
                Theme {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 font-serif text-2xl text-ink">{t.title}</h3>
              <p className="mt-4 text-[1rem] leading-relaxed text-ink/75">{t.summary}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-rule bg-mist">
        <div className="container-rcees py-24">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr] md:items-end">
            <div>
              <SectionHeading eyebrow="Publications" title="Peer-reviewed output." />
              <p className="mt-6 max-w-2xl text-[1.025rem] leading-relaxed text-ink/80">
                The corpus below is pulled live from OpenAlex — an open scholarly
                database that indexes Scopus, Crossref and the broader literature —
                for works affiliated with RCEES and the University of Energy and
                Natural Resources. The list refreshes automatically whenever new
                work is indexed upstream.
              </p>
            </div>
            <div className="md:text-right">
              <Link href="/projects" className="btn-primary">View research projects</Link>
            </div>
          </div>

          <PublicationsExplorer />
        </div>
      </section>
    </>
  );
}
