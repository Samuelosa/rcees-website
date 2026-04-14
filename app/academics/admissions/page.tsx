import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site, images } from "@/lib/constants";

export const metadata: Metadata = { title: "Admissions", description: "How to apply to RCEES." };

const steps = [
  { n: "01", title: "Review programme requirements", body: "Identify the programme that fits your background and career goals, and read its eligibility criteria." },
  { n: "02", title: "Prepare your application materials", body: "Academic transcripts, CV, personal statement, references and (for PhD candidates) a research proposal." },
  { n: "03", title: "Apply through the UENR portal", body: "Submit your application through the University of Energy and Natural Resources admissions portal." },
  { n: "04", title: "Interview and decision", body: "Shortlisted applicants are invited for an interview with the programme committee." },
];

export default function AdmissionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admissions"
        title="How to apply."
        lead="Applications for RCEES's postgraduate programmes are processed through the University of Energy and Natural Resources. This page outlines the steps, requirements and sources of funding."
        image={images.academicsHero}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academics", href: "/academics" },
          { label: "Admissions" },
        ]}
      />

      <section className="container-rcees py-24">
        <SectionHeading eyebrow="Application process" title="Four steps from interest to enrolment." />
        <ol className="mt-14 grid gap-px border border-rule bg-rule md:grid-cols-2">
          {steps.map((s) => (
            <li key={s.n} className="bg-paper p-8">
              <p className="font-mono text-sm text-forest">{s.n}</p>
              <h3 className="mt-3 font-serif text-xl text-ink">{s.title}</h3>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-ink/75">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-rule bg-mist">
        <div className="container-rcees py-24 grid gap-8 md:grid-cols-3">
          {[
            { title: "Fee structure", body: "Fee details for international and domestic applicants are published on the UENR fees page.", href: "https://uenr.edu.gh", label: "UENR fees" },
            { title: "Admission portal", body: "All applications are submitted through the UENR admissions portal.", href: site.admissionsPortal, label: "Open portal" },
            { title: "Funding and scholarships", body: "RCEES runs a regular call for fully-funded PhD and MSc scholarships under the ACE Impact programme.", href: "/academics/admissions#scholarships", label: "Scholarships" },
          ].map((c) => (
            <div key={c.title} className="flex flex-col border border-rule bg-paper p-8">
              <h3 className="font-serif text-xl text-ink">{c.title}</h3>
              <p className="mt-4 flex-1 text-[0.975rem] leading-relaxed text-ink/75">{c.body}</p>
              <a href={c.href} className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-forest">
                {c.label} <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
