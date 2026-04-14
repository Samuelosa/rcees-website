import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { images } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description:
    "RCEES is a World Bank-funded Africa Centre of Excellence at UENR, advancing research and postgraduate education in energy and environmental sustainability.",
};

const values = [
  { title: "Academic rigour", body: "We hold our research and teaching to the standards of the world's leading universities." },
  { title: "Regional impact", body: "Our questions are grounded in the realities of Africa's energy and environmental systems." },
  { title: "Interdisciplinary practice", body: "Engineering, economics, policy and environmental science working together, not in parallel." },
  { title: "Integrity", body: "Open research, honest reporting of results, and a commitment to ethical practice." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About RCEES"
        title="A research and education centre for Africa's energy future."
        lead="RCEES was established in 2019 at the University of Energy and Natural Resources as a World Bank Africa Centre of Excellence for Development Impact. We train postgraduates, conduct research, and build professional capacity across the continent."
        image={images.aboutTeaser}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="container-rcees py-24">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionHeading eyebrow="Welcome message" title="From the Centre Director" />
            <div className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-ink/80">
              <p>
                Welcome to RCEES. Since 2019, we have worked to build an academic institution in Sunyani capable
                of standing alongside the world's best research centres on energy and environmental
                sustainability. Our staff, students and alumni are now present across thirteen African
                countries and a growing number of partner universities in Europe, North America and Asia.
              </p>
              <p>
                The Centre's mission is practical as well as academic. Ghana and its neighbours are going
                through one of the most significant energy transitions in their history, and the decisions made
                in the next decade will shape the lives of millions. We exist to ensure those decisions are
                made by people with the training, data and research to make them well.
              </p>
              <blockquote className="border-l-2 border-gold pl-6 font-serif text-xl italic text-ink/90">
                "Our job is to prepare graduates who can walk into a utility, a ministry, a research lab or
                a consulting firm and deliver on the first day."
              </blockquote>
              <p className="text-sm text-muted">— Prof. Ing. Samuel Gyamfi, Centre Director</p>
            </div>
            <div className="mt-10">
              <Link href="/about/team" className="btn-primary">Meet the team</Link>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest-900">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/samuel-gyamfi.png`}
                alt="Prof. Ing. Samuel Gyamfi, Centre Director"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 text-xs uppercase tracking-wider text-muted">
              Prof. Ing. Samuel Gyamfi · Centre Director
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-rule bg-mist">
        <div className="container-rcees py-24">
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-5">
              <SectionHeading eyebrow="Vision, mission and values" title="What the Centre stands for." />
            </div>
            <div className="md:col-span-7">
              <div className="border border-rule bg-paper p-8 md:p-10">
                <p className="eyebrow">Vision</p>
                <p className="mt-4 font-serif text-xl leading-snug text-ink">
                  To be the leading internationally-accredited Centre of Excellence providing quality research
                  and postgraduate education in energy and environmental sustainability.
                </p>
              </div>
              <div className="mt-6 border border-rule bg-paper p-8 md:p-10">
                <p className="eyebrow">Mission</p>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink/80">
                  To produce rigorous, industry-ready graduates and applied research that supports Africa's
                  transition to sustainable energy systems and resilient environmental management.
                </p>
              </div>
              <div className="mt-6 grid gap-px border border-rule bg-rule sm:grid-cols-2">
                {values.map((v) => (
                  <div key={v.title} className="bg-paper p-6">
                    <p className="font-serif text-lg text-ink">{v.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">{v.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-rcees py-24">
        <SectionHeading eyebrow="Explore" title="More about the Centre." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { title: "The Team", href: "/about/team", body: "Leadership, faculty, advisory boards and fellows." },
            { title: "History", href: "/about/history", body: "Milestones from establishment in 2019 to ACE@10 recognition." },
            { title: "Facilities", href: "/about/facilities", body: "Laboratories, data centre and research infrastructure." },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="group block border border-rule bg-paper p-8 no-underline transition hover:border-forest">
              <h3 className="font-serif text-2xl text-ink">{c.title}</h3>
              <p className="mt-4 text-[0.975rem] leading-relaxed text-ink/75">{c.body}</p>
              <p className="mt-6 text-sm font-medium text-forest">Continue →</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
