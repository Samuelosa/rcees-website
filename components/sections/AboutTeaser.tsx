"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Minus } from "lucide-react";
import { images } from "@/lib/constants";


const pillars = [
  { k: "01", t: "Research", d: "Four themes, forty researchers, one agenda for Africa's energy future." },
  { k: "02", t: "Teaching", d: "Doctoral, master's and professional students across twelve active programmes." },
  { k: "03", t: "Partnership", d: "Thirteen countries, four continents, one network of collaborators." },
];

export function AboutTeaser() {
  return (
    <section className="relative overflow-hidden bg-paper py-28 text-ink">
      <div className="container-wide">
        {/* Top band: eyebrow row with hairline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-6 border-t-2 border-ink pt-6"
        >
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-maroon">
            01 — About the Centre
          </p>
          <span className="hidden h-px flex-1 bg-ink/20 md:block" />
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-ink/50 md:block">
            Established 2019 · Sunyani · Ghana
          </p>
        </motion.div>

        {/* Headline + side image row */}
        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* LEFT — editorial copy */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.95] }}
            className="lg:col-span-7"
          >
            <h2 className="text-[clamp(2.5rem,5.5vw,5rem)] font-extrabold leading-[0.94] tracking-[-0.035em] text-ink text-balance">
              Built in{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Ghana</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-sun md:bottom-2 md:h-4" />
              </span>
              .
              <br />
              <span className="italic font-bold text-maroon">Made for the continent.</span>
            </h2>

            {/* Two-column editorial body */}
            <div className="mt-12 grid gap-10 text-[1.05rem] leading-[1.7] text-ink/80 md:grid-cols-2 md:gap-12">
              <p className="first-letter:font-serif first-letter:mr-2 first-letter:float-left first-letter:text-[4.2rem] first-letter:font-extrabold first-letter:leading-[0.85] first-letter:text-maroon">
                RCEES was established in 2019 as a World Bank Africa Centre of Excellence at the
                University of Energy and Natural Resources, closing the skills gap between African
                universities and the industries that depend on their graduates.
              </p>
              <p className="text-ink/70">
                We train doctoral, master's and professional students, run research on the energy
                transition, storage, environmental systems and sustainable development, and deliver
                short courses to working engineers and policymakers across West and Central Africa.
              </p>
            </div>

            {/* Pillars row */}
            <ul className="mt-14 grid grid-cols-1 gap-px border-y-2 border-ink/10 sm:grid-cols-3 sm:border-2 sm:bg-ink/10">
              {pillars.map((p) => (
                <li key={p.k} className="flex flex-col bg-paper p-6 md:p-7">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-maroon">
                    {p.k} / {p.t}
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-ink/70">{p.d}</p>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link href="/about" className="btn-primary group">
                Read the full story
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/about/team" className="btn-ghost">
                Meet the team
              </Link>
            </div>
          </motion.div>

          {/* RIGHT — feature image column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.2, 0.65, 0.3, 0.95] }}
            className="relative lg:col-span-5"
          >
            <div className="sticky top-28">
              <div className="relative">
                {/* hairline corner marks */}
                <span className="absolute -left-3 -top-3 h-6 w-6 border-l-2 border-t-2 border-maroon" />
                <span className="absolute -right-3 -top-3 h-6 w-6 border-r-2 border-t-2 border-maroon" />
                <span className="absolute -bottom-3 -left-3 h-6 w-6 border-b-2 border-l-2 border-maroon" />
                <span className="absolute -bottom-3 -right-3 h-6 w-6 border-b-2 border-r-2 border-maroon" />

                <div className="relative aspect-[4/5] w-full overflow-hidden bg-maroon-900">
                  <Image
                    src={images.heroStudents}
                    alt="RCEES students on campus"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-maroon-900/85 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-sun">
                      <Minus className="h-3 w-3" />
                      Fig. 01
                    </p>
                    <p className="mt-3 text-lg font-semibold leading-snug text-paper md:text-xl">
                      A postgraduate research community built on rigour and relevance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Signature stats column under image */}
              <dl className="mt-8 divide-y divide-ink/15 border-y border-ink/15">
                {[
                  { k: "Established", v: "2019" },
                  { k: "Host institution", v: "UENR, Sunyani" },
                  { k: "Funding body", v: "World Bank ACE" },
                  { k: "Programmes", v: "PhD · MSc · MPhil · Pro" },
                ].map((row) => (
                  <div key={row.k} className="flex items-baseline justify-between gap-6 py-3.5">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                      {row.k}
                    </dt>
                    <dd className="text-right text-sm font-semibold text-ink">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
