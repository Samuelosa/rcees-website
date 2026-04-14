import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { mphilProgrammes, images } from "@/lib/constants";

export const metadata: Metadata = { title: "MPhil Programmes", description: "Research master's programmes at RCEES." };

export default function MPhilPage() {
  return (
    <>
      <PageHeader
        eyebrow="MPhil Programmes"
        title="Research-led master's degrees."
        lead="For candidates pursuing advanced research training in energy policy and energy economics, with a view to doctoral work or senior practice."
        image={images.academicsHero}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academics", href: "/academics" },
          { label: "MPhil Programmes" },
        ]}
      />
      <section className="container-rcees py-24">
        <div className="grid gap-6 md:grid-cols-2">
          {mphilProgrammes.map((p) => (
            <article key={p.title} className="flex h-full flex-col border border-rule bg-paper p-8">
              <p className="font-mono text-xs uppercase tracking-wider text-forest">{p.duration}</p>
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
