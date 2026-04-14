import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { milestones, images } from "@/lib/constants";

export const metadata: Metadata = { title: "History", description: "Milestones in the history of RCEES." };

export default function HistoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="History"
        title="From a World Bank selection to ACE@10 recognition."
        lead="RCEES's short history is defined by the pace of its growth — from establishment in 2019 to recognition among the top ten ACE Impact centres on the continent."
        image={images.history}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "History" }]}
      />

      <section className="container-rcees py-24">
        <ol className="relative border-l border-rule pl-8 md:pl-12">
          {milestones.map((m) => (
            <li key={m.year} className="relative mb-14 last:mb-0">
              <span className="absolute -left-[37px] top-1 h-3 w-3 rounded-full bg-forest md:-left-[49px]" />
              <p className="font-mono text-sm text-forest">{m.year}</p>
              <h3 className="mt-2 font-serif text-2xl text-ink">{m.title}</h3>
              <p className="mt-3 max-w-prose text-[1.025rem] leading-relaxed text-ink/80">{m.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
