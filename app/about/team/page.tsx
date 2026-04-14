import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { team, images } from "@/lib/constants";

export const metadata: Metadata = {
  title: "The Team",
  description: "Centre management, faculty, advisory boards and fellows at RCEES.",
};

export default function TeamPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our people"
        title="Leadership, faculty and advisory boards."
        lead="The Centre is led by a management team of engineers, economists and policy researchers, supported by faculty, international advisors and industrial partners."
        image={images.directorWelcome}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "The Team" }]}
      />

      <section className="container-rcees py-24">
        <SectionHeading eyebrow="Centre management" title="The leadership team." />
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {team.management.map((m) => (
            <article key={m.name} className="flex h-full flex-col border border-rule bg-paper p-7">
              <div className="h-28 w-28 rounded-full bg-mist border border-rule" aria-hidden="true" />
              <p className="mt-6 eyebrow">{m.role}</p>
              <h3 className="mt-2 font-serif text-xl leading-snug text-ink">{m.name}</h3>
              <p className="mt-1 text-sm text-muted">{m.credentials}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink/75">{m.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-rule bg-mist">
        <div className="container-rcees py-24">
          <div className="grid gap-12 md:grid-cols-2">
            {[
              { title: "Faculty", body: "Teaching and research staff across the Centre's MSc, MPhil and PhD programmes. Drawn from engineering, environmental science, economics and policy disciplines." },
              { title: "International Scientific Advisory Board", body: "Senior academics from partner universities across Europe and North America, providing peer review and scientific guidance on the Centre's research agenda." },
              { title: "Industrial Advisory Board", body: "Executives and senior practitioners from utilities, regulators, development banks and industry, ensuring the Centre's work stays relevant to professional practice." },
              { title: "Steering Committee", body: "Representatives of UENR, the World Bank and partner institutions who oversee the Centre's programme delivery and reporting." },
              { title: "Fellows", body: "Visiting researchers and senior scholars on short-term appointments, collaborating on joint projects and doctoral supervision." },
              { title: "Alumni network", body: "Graduates of RCEES now working across thirteen African countries in research, industry, government and international organisations." },
            ].map((s) => (
              <article key={s.title} className="border border-rule bg-paper p-8">
                <h3 className="font-serif text-xl text-ink">{s.title}</h3>
                <p className="mt-3 text-[0.975rem] leading-relaxed text-ink/75">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
