import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { shortCourses, images } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Professional Short Courses",
  description: "Industry-aligned professional short courses at RCEES.",
};

export default function ShortCoursesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Professional Short Courses"
        title="Industry-aligned training for working professionals."
        lead="Short courses are designed for engineers, policymakers and practitioners in energy and environmental sectors, and for professionals transitioning into the field. Each course combines classroom instruction with field delivery and leads to certification."
        image={images.academicsHero}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academics", href: "/academics" },
          { label: "Short Courses" },
        ]}
      />

      <section className="container-rcees py-24">
        <SectionHeading eyebrow="Current courses" title="What you can study." />
        <ul className="mt-14 grid gap-px border border-rule bg-rule md:grid-cols-2">
          {shortCourses.map((c, i) => (
            <li key={c.title} className="flex items-start justify-between gap-6 bg-paper p-7">
              <div>
                <p className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-serif text-xl text-ink">{c.title}</h3>
              </div>
              <span className="shrink-0 self-start border border-forest px-3 py-1 text-xs uppercase tracking-wide text-forest">
                {c.mode}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
