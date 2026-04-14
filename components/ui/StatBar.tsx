"use client";
import { motion } from "framer-motion";
import { stats } from "@/lib/constants";
import { CountUp } from "@/components/ui/CountUp";

export function StatBar() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-28">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.95] }}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="eyebrow">By the numbers</p>
            <h2 className="mt-5 font-serif text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[0.98] tracking-[-0.035em] text-ink text-balance">
              Built in six years.{" "}
              <span className="italic text-maroon">Only getting started.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            From a World Bank selection in 2019 to recognition among the continent's top ten ACE Impact centres.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => {
            const numeric = Number(s.value);
            const isNumber = !Number.isNaN(numeric);
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.2, 0.65, 0.3, 0.95] }}
                className="group relative flex flex-col overflow-hidden border-2 border-maroon/10 bg-cream p-7 transition-all duration-500 hover:-translate-y-2 hover:border-maroon hover:bg-maroon hover:text-paper md:p-9"
              >
                <span className="font-mono text-xs text-maroon/60 group-hover:text-sun">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-6 font-serif text-[clamp(2.75rem,5.5vw,5rem)] font-bold leading-none tracking-[-0.03em] text-maroon group-hover:text-sun">
                  {isNumber ? <CountUp to={numeric} /> : s.value}
                  {s.suffix}
                </p>
                <p className="mt-6 text-sm font-medium uppercase tracking-wider text-ink/80 group-hover:text-paper/90">
                  {s.label}
                </p>
                <span className="absolute -right-6 -top-6 font-serif text-[8rem] italic leading-none text-maroon/[0.04] transition group-hover:text-sun/20">
                  {i + 1}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
