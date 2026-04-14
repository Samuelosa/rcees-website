import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { partners, images } from "@/lib/constants";

export const metadata: Metadata = { title: "Partners", description: "Institutional partners and affiliations of RCEES." };

export default function PartnersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Partners"
        title="An international network of collaborators."
        lead="RCEES works with funders, universities, government agencies and industry partners across Africa, Europe and North America. Together they underwrite the Centre's research, training and professional practice."
        image={images.academicsHero}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Partners" }]}
      />
      <section className="container-rcees py-24">
        <SectionHeading eyebrow="Our partners" title="Institutions we work with." />
        <ul className="mt-14 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <li key={p.name} className="flex min-h-[160px] flex-col justify-center bg-paper p-7">
              <p className="font-serif text-lg leading-snug text-ink">{p.name}</p>
              <p className="mt-2 text-xs uppercase tracking-wider text-muted">{p.role}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
