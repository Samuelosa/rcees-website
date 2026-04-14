"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { images } from "@/lib/constants";

type Slide = {
  eyebrow: string;
  titleA: string;
  titleItalic: string;
  titleB?: string;
  lead: string;
  image: string;
  cta: { label: string; href: string };
  accent: "sun" | "maroon";
};

const slides: Slide[] = [
  {
    eyebrow: "World Bank Africa Centre of Excellence",
    titleA: "Training Africa's",
    titleItalic: "next-gen",
    titleB: "energy leaders.",
    lead:
      "A research and postgraduate centre at the University of Energy and Natural Resources — home to the engineers, researchers and policymakers rewriting the continent's energy story.",
    image: images.heroStudents,
    cta: { label: "About RCEES", href: "/about" },
    accent: "sun",
  },
  {
    eyebrow: "Energy Transition",
    titleA: "Powering the",
    titleItalic: "renewable",
    titleB: "revolution.",
    lead:
      "From solar mini-grids to utility-scale wind — our research is building the case for Africa's shift to clean, reliable, affordable energy.",
    image: images.heroSolar,
    cta: { label: "Explore research", href: "/research" },
    accent: "sun",
  },
  {
    eyebrow: "Academics · 2026 intake",
    titleA: "Postgraduate",
    titleItalic: "education",
    titleB: "that gets you hired.",
    lead:
      "PhD, MSc, MPhil and professional short courses across sustainable energy engineering, environmental engineering, energy economics and policy.",
    image: images.heroGraduation,
    cta: { label: "Explore programmes", href: "/academics" },
    accent: "sun",
  },
  {
    eyebrow: "Research · Four themes",
    titleA: "Science that",
    titleItalic: "moves",
    titleB: "policy forward.",
    lead:
      "Energy transition, storage, the energy-environment nexus, and sustainable development — anchored in the questions that matter most to Africa's future.",
    image: images.heroLab,
    cta: { label: "Our research", href: "/research" },
    accent: "sun",
  },
  {
    eyebrow: "Admissions open",
    titleA: "Your career starts",
    titleItalic: "in",
    titleB: "Sunyani.",
    lead:
      "Fully-funded PhD and MSc places for the 2026 intake, plus year-round professional short courses for working engineers and policymakers.",
    image: images.heroWind,
    cta: { label: "Apply for 2026", href: "/academics/admissions" },
    accent: "sun",
  },
];

const INTERVAL = 6500;

export function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setI((v) => (v + 1) % slides.length), []);
  const prev = useCallback(() => setI((v) => (v - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), INTERVAL);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const slide = slides[i];
  const accentBg = slide.accent === "sun" ? "bg-sun text-ink" : "bg-maroon text-paper";

  return (
    <section
      className="relative isolate min-h-[88vh] overflow-hidden bg-ink text-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image crossfade */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`bg-${i}`}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.4, 0.0, 0.2, 1] }}
          className="absolute inset-0 -z-10"
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative dot grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(rgba(250,248,241,0.6) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

      {/* Top utility bar */}
      <div className="relative border-b border-paper/15">
        <div className="container-wide flex items-center justify-between py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/70">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 animate-blink rounded-full bg-sun" />
            Applications open · 2026 intake
          </span>
          <span className="hidden md:inline">University of Energy and Natural Resources · Sunyani, Ghana</span>
          <span className="hidden md:inline">Since 2019</span>
        </div>
      </div>

      {/* Slide content */}
      <div className="container-wide relative grid min-h-[72vh] grid-cols-1 items-center gap-12 py-16 md:py-20 lg:grid-cols-12">
        <div className="relative lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${i}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.75, ease: [0.2, 0.65, 0.3, 0.95] }}
            >
              <div className="flex items-center gap-4">
                <span className="h-px w-14 bg-sun" />
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-sun">
                  {slide.eyebrow}
                </p>
              </div>

              <h1 className="mt-8 font-serif font-bold leading-[0.88] tracking-[-0.035em] text-paper">
                <span className="block text-[clamp(2.75rem,7vw,6.75rem)]">{slide.titleA}</span>
                <span className="relative mt-2 block text-[clamp(2.75rem,7vw,6.75rem)]">
                  <span className="relative z-10 italic text-sun">{slide.titleItalic}</span>
                  {slide.titleB ? <span> {slide.titleB}</span> : null}
                </span>
              </h1>

              <p className="mt-10 max-w-2xl text-lg leading-relaxed text-paper/80 md:text-xl">
                {slide.lead}
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-4">
                <Link
                  href={slide.cta.href}
                  className={`group inline-flex items-center gap-2 px-8 py-5 text-sm font-bold uppercase tracking-wider no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${accentBg}`}
                >
                  {slide.cta.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border-2 border-paper/60 px-8 py-5 text-sm font-semibold uppercase tracking-wider text-paper no-underline transition hover:bg-paper hover:text-ink"
                >
                  Get in touch
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right meta / slide counter */}
        <div className="relative flex flex-col items-start gap-6 lg:col-span-4 lg:items-end lg:text-right">
          <div className="flex items-baseline gap-3">
            <AnimatePresence mode="wait">
              <motion.span
                key={`num-${i}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
                className="font-serif text-7xl font-bold leading-none text-sun"
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
            <span className="font-mono text-sm uppercase tracking-[0.22em] text-paper/60">
              / {String(slides.length).padStart(2, "0")}
            </span>
          </div>
          <p className="max-w-[220px] font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
            Use ← → keys · hover to pause · click dots to jump
          </p>
        </div>
      </div>

      {/* Bottom controls bar */}
      <div className="relative border-t border-paper/15 bg-ink/60 backdrop-blur-sm">
        <div className="container-wide flex items-center justify-between gap-6 py-5">
          {/* Dots */}
          <div className="flex items-center gap-3">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className="group flex items-center gap-2"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <span
                  className={`h-[3px] transition-all duration-500 ${
                    idx === i ? "w-14 bg-sun" : "w-7 bg-paper/30 group-hover:bg-paper/60"
                  }`}
                />
                <span
                  className={`hidden font-mono text-[10px] uppercase tracking-wider md:inline ${
                    idx === i ? "text-sun" : "text-paper/40"
                  }`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="flex h-12 w-12 items-center justify-center border border-paper/30 text-paper transition hover:border-sun hover:bg-sun hover:text-ink"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="flex h-12 w-12 items-center justify-center border border-paper/30 text-paper transition hover:border-sun hover:bg-sun hover:text-ink"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Auto-advance progress bar */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-paper/10">
          <motion.div
            key={`bar-${i}-${paused}`}
            initial={{ width: "0%" }}
            animate={{ width: paused ? "0%" : "100%" }}
            transition={{ duration: paused ? 0 : INTERVAL / 1000, ease: "linear" }}
            className="h-full bg-sun"
          />
        </div>
      </div>
    </section>
  );
}
