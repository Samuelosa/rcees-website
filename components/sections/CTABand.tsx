"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, CalendarDays } from "lucide-react";
import { images } from "@/lib/constants";

export function CTABand() {
  return (
    <section className="relative isolate overflow-hidden bg-maroon text-paper">
      {/* background image */}
      <div className="absolute inset-0 -z-10">
        <Image src={images.heroSolar} alt="" fill sizes="100vw" className="object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-900 via-maroon to-maroon-900" />
      </div>

      {/* subtle dot texture */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(rgba(250,248,241,0.6) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

      <div className="container-wide relative py-24 md:py-28">
        {/* Top band: eyebrow row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-6 border-t-2 border-paper/30 pt-6"
        >
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-sun">
            09 — Join the Centre
          </p>
          <span className="hidden h-px flex-1 bg-paper/20 md:block" />
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50 md:block">
            2026 intake · Rolling admissions
          </p>
        </motion.div>

        {/* Main row */}
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT — headline + copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.2, 0.65, 0.3, 0.95] }}
            className="lg:col-span-8"
          >
            <h2 className="text-[clamp(2.5rem,6vw,6rem)] font-extrabold leading-[0.92] tracking-[-0.035em] text-paper text-balance">
              Your research career
              <br />
              starts{" "}
              <span className="relative inline-block">
                <span className="relative z-10 italic text-sun">in Sunyani</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-sun/20 md:bottom-2 md:h-4" />
              </span>
              .
            </h2>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-paper/80 md:text-xl">
              Fully-funded PhD and MSc places for the 2026 intake. Professional short courses year-round.
              Applications are open — and we're waiting for yours.
            </p>
          </motion.div>

          {/* RIGHT — action stack */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.65, 0.3, 0.95] }}
            className="flex flex-col lg:col-span-4 lg:items-end"
          >
            <div className="w-full max-w-sm border border-paper/20 bg-paper/[0.04] p-6 backdrop-blur-sm md:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sun">
                Ready when you are
              </p>
              <p className="mt-3 text-lg font-semibold leading-snug text-paper">
                Apply now, or talk to the admissions team first.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href="/academics/admissions"
                  className="group flex w-full items-center justify-between gap-3 bg-sun px-6 py-4 text-sm font-bold uppercase tracking-wider text-ink no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Apply for 2026
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contact"
                  className="group flex w-full items-center justify-between gap-3 border border-paper/50 px-6 py-4 text-sm font-semibold uppercase tracking-wider text-paper no-underline transition-all duration-300 hover:bg-paper hover:text-maroon"
                >
                  Talk to admissions
                  <Mail className="h-4 w-4" />
                </Link>
              </div>

              <p className="mt-5 border-t border-paper/15 pt-4 font-mono text-[10px] uppercase tracking-wider text-paper/50">
                rcees@uenr.edu.gh
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom facts row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 gap-px border-y-2 border-paper/20 bg-paper/10 sm:grid-cols-3"
        >
          {[
            { k: "PhD", v: "Fully funded", d: "3-year doctoral programmes across 4 routes" },
            { k: "MSc", v: "2-year track", d: "Taught + research across 4 programmes" },
            { k: "Professional", v: "Year-round", d: "Short courses for working engineers" },
          ].map((f) => (
            <div key={f.k} className="flex flex-col gap-2 bg-maroon px-6 py-7 md:px-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-sun">{f.k}</p>
              <p className="text-xl font-bold text-paper md:text-2xl">{f.v}</p>
              <p className="text-xs leading-relaxed text-paper/60">{f.d}</p>
            </div>
          ))}
        </motion.div>

        {/* Calendar footnote */}
        <p className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/50">
          <CalendarDays className="h-3.5 w-3.5 text-sun" />
          Applications close 30 June 2026 · Rolling interviews from March
        </p>
      </div>
    </section>
  );
}
