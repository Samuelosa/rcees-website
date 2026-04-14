import Image from "next/image";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { facilities, images } from "@/lib/constants";

export const metadata: Metadata = { title: "Facilities", description: "RCEES laboratories, data centre and research infrastructure." };

export default function FacilitiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Facilities"
        title="Laboratories and infrastructure."
        lead="The Centre's ultramodern building hosts dedicated laboratories, a data centre and postgraduate research spaces built around the four research themes."
        image={images.facilityA}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Facilities" }]}
      />

      <section className="container-rcees py-24">
        <SectionHeading eyebrow="Research infrastructure" title="Where the work happens." />
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {facilities.map((f) => (
            <article key={f.title} className="flex flex-col border border-rule bg-paper">
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-forest-900">
                <Image src={f.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="p-7">
                <h3 className="font-serif text-2xl text-ink">{f.title}</h3>
                <p className="mt-4 text-[0.975rem] leading-relaxed text-ink/75">{f.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
