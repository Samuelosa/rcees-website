import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images } from "@/lib/constants";

export const metadata: Metadata = { title: "Student Resources", description: "Handbooks, thesis guidelines and policies for RCEES students." };

const resources = [
  { title: "Student Handbook", body: "Programme regulations, code of conduct, academic calendar and policies for postgraduate students." },
  { title: "Thesis and Dissertation Guidelines", body: "Standards for structure, formatting, submission and examination of MSc, MPhil and PhD theses." },
  { title: "Guidelines on Publishing", body: "Expectations and standards for publication in Scopus-indexed journals as part of the programme requirements." },
  { title: "Results Checker", body: "Online portal to view examination results and academic progress." },
  { title: "Postgraduate Student Portal", body: "Core UENR postgraduate portal for registration, course enrolment and records." },
  { title: "Anti-Sexual Harassment Policy", body: "RCEES and UENR's policy, reporting channels and support services." },
];

export default function StudentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Student resources"
        title="Handbooks, guidelines and policies."
        lead="Essential resources for RCEES postgraduate students — from examination regulations to publication standards and wellbeing policies."
        image={images.academicsHero}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academics", href: "/academics" },
          { label: "Students" },
        ]}
      />
      <section className="container-rcees py-24">
        <SectionHeading eyebrow="Resources" title="Everything you need as a student." />
        <ul className="mt-14 grid gap-px border border-rule bg-rule md:grid-cols-2">
          {resources.map((r) => (
            <li key={r.title} className="group flex items-start justify-between gap-6 bg-paper p-7 hover:bg-mist">
              <div>
                <h3 className="font-serif text-xl text-ink">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{r.body}</p>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-forest" />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
