"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { researchThemes } from "@/lib/constants";

export function ResearchThemes() {
  return (
    <section className="relative overflow-hidden bg-cream py-28">
      <div className="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-sun/40 blur-3xl" />
      <div className="container-wide relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow">Research</p>
            <h2 className="mt-5 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-ink text-balance">
              Four themes.
              <br />
              <span className="italic text-maroon">One agenda.</span>
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-ink/75">
              Our research asks the questions that matter most to Africa's energy future — and answers them
              with the rigour of a top-tier international lab.
            </p>
            <Link href="/research" className="group mt-10 inline-flex items-center gap-2 border-b-2 border-maroon pb-1 text-sm font-semibold uppercase tracking-wider text-maroon no-underline">
              See the full agenda
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <ol className="grid gap-6 lg:col-span-8 md:grid-cols-2">
            {researchThemes.map((t, i) => (
              <motion.li
                key={t.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.2, 0.65, 0.3, 0.95] }}
                className="group relative flex flex-col overflow-hidden border-2 border-maroon/10 bg-paper p-8 transition-all duration-500 hover:-translate-y-1 hover:border-maroon md:p-10"
              >
                <div className="flex items-start justify-between">
                  <span className="stamp text-maroon">Theme {String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-7xl italic leading-none text-cream transition-colors group-hover:text-sun">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-2xl leading-tight text-ink md:text-3xl">{t.title}</h3>
                <p className="mt-4 flex-1 text-[0.975rem] leading-relaxed text-ink/70">{t.summary}</p>
                <div className="mt-8 h-[3px] w-12 bg-sun transition-all duration-500 group-hover:w-full" />
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
