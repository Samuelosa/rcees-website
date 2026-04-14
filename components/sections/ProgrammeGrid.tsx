"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, GraduationCap, Layers } from "lucide-react";
import { images } from "@/lib/constants";

type Tier = {
  number: string;
  kicker: string;
  title: string;
  href: string;
  blurb: string;
  image: string;
  duration: string;
  routes: string;
  tags: string[];
};

const tiers: Tier[] = [
  {
    number: "01",
    kicker: "Doctoral",
    title: "PhD Programmes",
    href: "/academics/phd",
    blurb:
      "Four doctoral routes combining one year of coursework with two years of original research — rigorous, funded, and built for impact.",
    image: images.heroLab,
    duration: "3 years",
    routes: "4 routes",
    tags: ["Funded", "Research", "Publishing required"],
  },
  {
    number: "02",
    kicker: "Master's",
    title: "MSc Programmes",
    href: "/academics/msc",
    blurb:
      "Two-year master's degrees across engineering, economics, policy and environmental management — taught by faculty who publish in the journals they teach from.",
    image: images.heroGraduation,
    duration: "2 years",
    routes: "4 routes",
    tags: ["Industry-ready", "Coursework + research"],
  },
  {
    number: "03",
    kicker: "Professional",
    title: "Short Courses",
    href: "/academics/short-courses",
    blurb:
      "Certified, industry-aligned short courses for working engineers and policymakers — classroom instruction plus field delivery and project work.",
    image: images.heroSolar,
    duration: "Flexible",
    routes: "7 courses",
    tags: ["Certified", "Field delivery"],
  },
];

export function ProgrammeGrid() {
  return (
    <section className="relative overflow-hidden bg-maroon py-28 text-paper">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(to right, #FAF8F1 1px, transparent 1px), linear-gradient(to bottom, #FAF8F1 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="pointer-events-none absolute -top-12 right-0 select-none font-serif text-[22vw] font-bold italic leading-none text-paper/[0.04]">
        academics
      </div>

      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.95] }}
          className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-3xl">
            <p className="eyebrow-sun">Academics</p>
            <h2 className="mt-5 font-serif text-[clamp(2.5rem,5.5vw,5rem)] font-bold leading-[0.95] tracking-[-0.035em] text-paper text-balance">
              Postgraduate education{" "}
              <span className="italic text-sun">that actually</span>{" "}
              <br className="hidden md:block" />
              gets you <span className="italic">hired.</span>
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-paper/75">
              Our graduates lead ministries, utilities, research labs and development banks across thirteen
              African countries. Pick your way in.
            </p>
          </div>
          <Link
            href="/academics"
            className="group hidden shrink-0 items-center gap-2 border-b-2 border-sun pb-1 text-sm font-semibold uppercase tracking-wider text-sun no-underline md:inline-flex"
          >
            All programmes
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-7">
          {tiers.map((t, i) => (
            <motion.div
              key={t.href}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.75, delay: i * 0.12, ease: [0.2, 0.65, 0.3, 0.95] }}
            >
              <Link
                href={t.href}
                className="group relative flex h-full flex-col overflow-hidden bg-paper text-ink no-underline shadow-[0_20px_60px_-25px_rgba(0,0,0,0.4)] ring-1 ring-paper/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_70px_-20px_rgba(235,231,45,0.25)]"
              >
                {/* Image top */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={t.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.08]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />

                  {/* Number badge top-left */}
                  <div className="absolute left-5 top-5 flex items-center gap-2 bg-paper/95 px-3 py-1.5 backdrop-blur">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-maroon">
                      {t.number}
                    </span>
                    <span className="h-3 w-px bg-maroon/30" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/70">
                      {t.kicker}
                    </span>
                  </div>

                  {/* Sun arrow badge top-right */}
                  <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center bg-sun text-ink shadow-lg transition-all duration-500 group-hover:rotate-[-15deg] group-hover:scale-110">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-7 md:p-8">
                  {/* Meta row */}
                  <div className="flex items-center gap-5 text-xs font-medium text-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-maroon" />
                      {t.duration}
                    </span>
                    <span className="h-3 w-px bg-rule" />
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-maroon" />
                      {t.routes}
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-3xl font-bold leading-tight tracking-[-0.025em] text-ink transition-colors group-hover:text-maroon">
                    {t.title}
                  </h3>
                  <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink/70">
                    {t.blurb}
                  </p>

                  {/* Tag chips */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {t.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 border border-maroon/15 bg-cream px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-maroon"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer link */}
                  <div className="mt-7 flex items-center justify-between border-t border-rule pt-5">
                    <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-maroon">
                      <GraduationCap className="h-4 w-4" />
                      Learn more
                    </span>
                    <span className="h-[2px] w-12 bg-maroon transition-all duration-500 group-hover:w-24" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
