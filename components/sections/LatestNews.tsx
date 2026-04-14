"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { newsItems, images } from "@/lib/constants";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function LatestNews() {
  const [feature, ...rest] = newsItems;
  return (
    <section className="relative bg-cream py-28">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.65, 0.3, 0.95] }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="eyebrow">Latest news</p>
            <h2 className="mt-5 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-ink text-balance">
              Fresh from{" "}
              <span className="italic text-maroon">the Centre.</span>
            </h2>
          </div>
          <Link href="/news" className="group inline-flex items-center gap-2 border-b-2 border-maroon pb-1 text-sm font-semibold uppercase tracking-wider text-maroon no-underline">
            All stories
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          {/* Feature */}
          <Link href="/news" className="group block lg:col-span-7 no-underline">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-maroon-900">
              <Image
                src={feature.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-900 via-maroon-900/50 to-transparent" />
              <div className="absolute left-6 top-6 bg-sun px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                Featured
              </div>
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
                <p className="eyebrow-sun">{formatDate(feature.date)}</p>
                <h3 className="mt-4 max-w-2xl font-serif text-3xl font-semibold leading-tight text-paper md:text-5xl md:leading-[1]">
                  {feature.title}
                </h3>
                <p className="mt-5 max-w-2xl text-[0.975rem] leading-relaxed text-paper/80">
                  {feature.excerpt}
                </p>
                <div className="mt-7 inline-flex items-center gap-2 border-b-2 border-sun pb-1 text-sm font-semibold text-sun">
                  Read the story
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </div>
          </Link>

          {/* Side list */}
          <div className="lg:col-span-5">
            <ul className="divide-y-2 divide-maroon/10 border-y-2 border-maroon/10">
              {rest.map((n) => (
                <li key={n.title}>
                  <Link href="/news" className="group flex items-start gap-5 py-7 no-underline">
                    <div className="relative h-24 w-32 shrink-0 overflow-hidden bg-maroon-900">
                      <Image src={n.image} alt="" fill sizes="140px" className="object-cover transition duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{formatDate(n.date)}</p>
                      <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-ink group-hover:text-maroon">
                        {n.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-ink/65">{n.excerpt}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/news"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 border-2 border-maroon px-6 py-4 text-sm font-semibold uppercase tracking-wider text-maroon no-underline transition hover:bg-maroon hover:text-paper"
            >
              Browse all news
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
