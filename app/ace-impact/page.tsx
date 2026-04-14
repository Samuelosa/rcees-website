import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ACE Impact",
  description: "RCEES's role in the World Bank's Africa Centres of Excellence for Development Impact programme.",
};

const dlis = [
  { title: "DLI 1 — Accreditation and governance", body: "Internationally-recognised programme accreditation and institutional governance reforms." },
  { title: "DLI 2 — Students and research output", body: "Enrolment, graduation and peer-reviewed publication targets across the Centre's programmes." },
  { title: "DLI 3 — Partnerships and revenue", body: "Partnerships with industry, government and international universities, and diversification of revenue." },
  { title: "DLI 4 — Impact on development", body: "Measurable contribution to national and regional development priorities in energy and environment." },
];

export default function AceImpactPage() {
  return (
    <>
      <PageHeader
        eyebrow="ACE Impact"
        title="Africa Centres of Excellence for Development Impact."
        lead="RCEES is one of 46 Africa Centres of Excellence funded through the World Bank's ACE Impact programme, which supports specialised postgraduate training and applied research across the continent."
        image={images.researchHero}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "ACE Impact" }]}
      />

      <section className="container-rcees py-24">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionHeading eyebrow="Overview" title="What ACE Impact does." />
            <div className="mt-8 space-y-5 text-[1.025rem] leading-relaxed text-ink/80">
              <p>
                The Africa Centres of Excellence for Development Impact programme is a World Bank–funded
                initiative supporting specialised universities in West and Central Africa to deliver
                postgraduate education and applied research in priority development sectors.
              </p>
              <p>
                Through ACE Impact, RCEES has trained hundreds of postgraduates, built an international
                research profile, and established professional short-course delivery for practitioners
                across the region. The Centre's performance is measured against Disbursement-Linked
                Indicators (DLIs).
              </p>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="border border-rule bg-mist p-8">
              <p className="eyebrow">Quick references</p>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a href="https://grm.aau.org" className="inline-flex items-center gap-1 text-forest">
                    e-GRM reporting portal <ArrowUpRight className="h-4 w-4" />
                  </a>
                </li>
                <li>
                  <a href="https://ace.aau.org" className="inline-flex items-center gap-1 text-forest">
                    ACE Impact programme site <ArrowUpRight className="h-4 w-4" />
                  </a>
                </li>
                <li className="text-muted">PASET benchmarking: RCEES participates in the Partnership for Skills in Applied Sciences, Engineering and Technology benchmarking exercise.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-rule bg-mist">
        <div className="container-rcees py-24">
          <SectionHeading eyebrow="DLI milestones" title="How our performance is measured." />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {dlis.map((d) => (
              <div key={d.title} className="border border-rule bg-paper p-8">
                <h3 className="font-serif text-xl text-ink">{d.title}</h3>
                <p className="mt-3 text-[0.975rem] leading-relaxed text-ink/75">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
