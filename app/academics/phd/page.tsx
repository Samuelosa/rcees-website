import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { phdProgrammes, images } from "@/lib/constants";

export const metadata: Metadata = { title: "PhD Programmes", description: "Doctoral programmes at RCEES." };

export default function PhDPage() {
  return (
    <>
      <PageHeader
        eyebrow="PhD Programmes"
        title="Doctoral training grounded in rigour and relevance."
        lead="RCEES offers four doctoral programmes combining a year of structured coursework with two years of supervised research. Each is anchored in a research theme aligned with the Centre's agenda."
        image={images.academicsHero}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academics", href: "/academics" },
          { label: "PhD Programmes" },
        ]}
      />
      <section className="container-rcees py-24">
        <div className="grid gap-6">
          {phdProgrammes.map((p) => (
            <article key={p.title} className="border border-rule bg-paper p-8 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h2 className="max-w-3xl font-serif text-2xl text-ink md:text-3xl">{p.title}</h2>
                <div className="text-right text-xs uppercase tracking-wider text-muted">
                  <p className="font-mono text-forest">{p.duration}</p>
                  <p className="mt-1">{p.structure}</p>
                </div>
              </div>
              <p className="mt-2 text-xs uppercase tracking-wider text-muted">{p.department}</p>
              <p className="mt-6 max-w-prose text-[1.025rem] leading-relaxed text-ink/80">{p.summary}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/academics/admissions" className="btn-primary">Admissions</Link>
                <Link href="/research" className="btn-ghost">Research themes</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
