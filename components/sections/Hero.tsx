"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { images, site } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-paper text-ink">
      {/* Top utility strip */}
      <div className="border-b border-ink/10">
        <div className="container-wide flex items-center justify-between py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/70">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-blink rounded-full bg-maroon" />
            Applications open · 2026 intake
          </span>
          <span className="hidden md:inline">University of Energy and Natural Resources · Sunyani, Ghana</span>
          <span className="hidden md:inline">Since 2019</span>
        </div>
      </div>

      {/* Main hero grid */}
      <div className="container-wide relative grid grid-cols-1 gap-14 py-20 md:py-24 lg:grid-cols-12 lg:gap-12 lg:py-28">
        {/* LEFT — copy */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.95] }}
          >
            <div className="flex items-center gap-4">
              <span className="h-px w-14 bg-maroon" />
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-maroon">
                {site.tagline}
              </p>
            </div>

            <h1 className="mt-10 text-[clamp(2.75rem,6.5vw,6.5rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink text-balance">
              Advancing energy and
              <br />
              environmental{" "}
              <span className="relative inline-block">
                <span className="relative z-10 italic text-maroon">sustainability</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-4 bg-sun md:bottom-2 md:h-5" />
              </span>
              <br />
              across Africa.
            </h1>

            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-ink/70 md:text-xl">
              The Regional Centre for Energy and Environmental Sustainability is a World Bank Africa
              Centre of Excellence at the University of Energy and Natural Resources — training
              the researchers, engineers and policymakers shaping the continent's energy transition.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link href="/academics/admissions" className="btn-primary group">
                Apply for 2026
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/about" className="btn-ghost">
                About the Centre
              </Link>
            </div>

            <p className="mt-16 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-ink/40">
              <ArrowDown className="h-3.5 w-3.5" />
              Scroll to explore
            </p>
          </motion.div>
        </div>

        {/* RIGHT — single striking image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.2, 0.65, 0.3, 0.95], delay: 0.15 }}
          className="relative lg:col-span-5"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-none">
            {/* back block */}
            <div className="absolute -right-5 -top-5 h-full w-full bg-sun" />
            {/* main image */}
            <div className="absolute inset-0 overflow-hidden bg-maroon-900">
              <Image
                src={images.heroStudents}
                alt="RCEES students on campus"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-maroon-900/70 to-transparent" />
            </div>
            {/* caption card */}
            <div className="absolute -bottom-6 -left-6 z-10 max-w-[72%] bg-ink px-6 py-5 text-paper shadow-2xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sun">Regional Centre</p>
              <p className="mt-2 text-lg font-semibold leading-snug">
                Energy & Environmental Sustainability
              </p>
              <p className="mt-1 text-xs text-paper/60">Sunyani · Ghana · Est. 2019</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom facts strip — classic editorial 4-column */}
      <div className="border-y border-ink/10 bg-cream">
        <div className="container-wide grid grid-cols-2 divide-x divide-ink/10 md:grid-cols-4">
          {[
            { k: "Since", v: "2019" },
            { k: "Graduates", v: "300+" },
            { k: "Partner countries", v: "13+" },
            { k: "ACE@10 ranking", v: "Top 10" },
          ].map((f, i) => (
            <div key={f.k} className={`px-6 py-8 md:px-10 md:py-10 ${i === 0 ? "md:border-l md:border-ink/10" : ""}`}>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">{f.k}</p>
              <p className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-maroon md:text-4xl">
                {f.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
