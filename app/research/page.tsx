import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { researchThemes, images } from "@/lib/constants";

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
        <div className="container-rcees py-24 grid gap-12 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Publications" title="Scopus-indexed output." />
            <div className="mt-8 space-y-5 text-[1.025rem] leading-relaxed text-ink/80">
              <p>
                RCEES's faculty and doctoral students publish in Scopus-indexed journals across engineering,
                environmental science, economics and policy. All programme candidates are expected to meet
                the Centre's publishing standards as a condition of graduation.
              </p>
              <p>
                A curated list of recent publications is available through the UENR library and the ACE
                Impact research repository.
              </p>
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Projects" title="Research in the field." />
            <div className="mt-8 space-y-5 text-[1.025rem] leading-relaxed text-ink/80">
              <p>
                Our research is funded by the World Bank, Horizon Europe, DAAD, GIZ and international
                university partners. Current projects span eight active research consortia.
              </p>
            </div>
            <Link href="/projects" className="mt-8 inline-block btn-primary">View projects</Link>
          </div>
        </div>
      </section>
    </>
  );
}
