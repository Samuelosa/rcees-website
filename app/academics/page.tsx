import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Academics",
  description: "Doctoral, master's, MPhil and professional programmes at RCEES.",
};

const tiers = [
  {
    href: "/academics/phd",
    title: "PhD Programmes",
    summary: "Four doctoral programmes combining coursework and supervised research in sustainable energy engineering, environmental engineering, energy economics and energy policy.",
    meta: "3 years · 1 year coursework + 2 years research",
  },
  {
    href: "/academics/msc",
    title: "MSc Programmes",
    summary: "Four master's degrees integrating taught modules and a supervised research project, preparing graduates for industry and further research.",
    meta: "2 years · 1 year taught + 1 year research",
  },
  {
    href: "/academics/mphil",
    title: "MPhil Programmes",
    summary: "Research-led master's programmes in energy policy and energy economics for candidates pursuing advanced scholarship.",
    meta: "2 years",
  },
  {
    href: "/academics/short-courses",
    title: "Professional Short Courses",
    summary: "Certified, industry-aligned short courses for working engineers and policymakers in solar PV, energy audit, wind power and more.",
    meta: "Classroom + field delivery",
  },
];

export default function AcademicsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Academics"
        title="Postgraduate education in energy and environmental sustainability."
        lead="RCEES's programmes are designed for graduates who want to work on Africa's most consequential energy and environmental questions — whether in research, industry or government."
        image={images.academicsHero}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Academics" }]}
      />

      <section className="container-rcees py-24">
        <SectionHeading eyebrow="Programme tiers" title="Four routes through the Centre." />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {tiers.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group flex flex-col border border-rule bg-paper p-8 no-underline transition hover:border-forest"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-forest">{t.meta}</p>
              <h3 className="mt-4 font-serif text-2xl text-ink">{t.title}</h3>
              <p className="mt-4 text-[0.975rem] leading-relaxed text-ink/75">{t.summary}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-forest">
                View programmes
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-rule bg-mist">
        <div className="container-rcees py-24">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="border border-rule bg-paper p-8 md:p-10">
              <p className="eyebrow">Admissions</p>
              <h3 className="mt-4 font-serif text-2xl text-ink">How to apply</h3>
              <p className="mt-4 text-[0.975rem] leading-relaxed text-ink/75">
                Applications are made through the UENR admissions portal. Information on fees, eligibility
                and scholarships is provided in the admissions section.
              </p>
              <Link href="/academics/admissions" className="mt-6 inline-block btn-primary">Admissions</Link>
            </div>
            <div className="border border-rule bg-paper p-8 md:p-10">
              <p className="eyebrow">Student resources</p>
              <h3 className="mt-4 font-serif text-2xl text-ink">For current students</h3>
              <p className="mt-4 text-[0.975rem] leading-relaxed text-ink/75">
                Handbooks, thesis guidelines, publishing standards, portals and policies for RCEES
                postgraduate students.
              </p>
              <Link href="/academics/students" className="mt-6 inline-block btn-ghost">Student resources</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
