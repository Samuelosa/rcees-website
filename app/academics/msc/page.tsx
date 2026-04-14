import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { mscProgrammes, images } from "@/lib/constants";

export const metadata: Metadata = { title: "MSc Programmes", description: "Master's programmes at RCEES." };

export default function MScPage() {
  return (
    <>
      <PageHeader
        eyebrow="MSc Programmes"
        title="Master's training for research, industry and policy."
        lead="RCEES's MSc programmes combine one year of taught modules with a year of supervised research, producing graduates prepared for technical leadership in energy and environmental sectors."
        image={images.academicsHero}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academics", href: "/academics" },
          { label: "MSc Programmes" },
        ]}
      />
      <section className="container-rcees py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {mscProgrammes.map((p) => (
            <article key={p.title} className="flex h-full flex-col border border-rule bg-paper p-8">
              <p className="font-mono text-xs uppercase tracking-wider text-forest">{p.duration} · {p.structure}</p>
              <h3 className="mt-4 font-serif text-2xl text-ink">{p.title}</h3>
              <p className="mt-4 flex-1 text-[0.975rem] leading-relaxed text-ink/75">{p.summary}</p>
              <Link href="/academics/admissions" className="mt-6 text-sm font-medium text-forest">Apply →</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
