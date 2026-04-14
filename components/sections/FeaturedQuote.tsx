import Image from "next/image";
import { Quote } from "lucide-react";
import { images } from "@/lib/constants";

export function FeaturedQuote() {
  return (
    <section className="relative overflow-hidden bg-paper py-28">
      <div className="container-wide">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] max-w-md">
              <div className="absolute -left-5 -top-5 h-full w-full bg-sun" />
              <div className="absolute inset-0 overflow-hidden bg-maroon-900">
                <Image
                  src={images.directorWelcome}
                  alt="Prof. Eric Ofosu Antwi, Centre Leader"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-maroon-900/70 to-transparent" />
              </div>
              <div className="absolute -bottom-6 right-4 bg-maroon px-8 py-5 text-paper shadow-2xl">
                <p className="eyebrow-sun">Centre Leader</p>
                <p className="mt-1 font-serif text-xl italic">Prof. Eric Ofosu Antwi</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center lg:col-span-7">
            <Quote className="h-14 w-14 text-sun" />
            <blockquote className="mt-8 font-serif text-[clamp(2rem,3.5vw,3.25rem)] font-[550] leading-[1.1] tracking-[-0.02em] text-ink text-balance">
              "Our job is to prepare graduates who can walk into a utility, a ministry, a research lab
              <span className="italic text-maroon"> or a consulting firm </span>
              and deliver on the first day."
            </blockquote>
            <div className="mt-12 flex items-center gap-4">
              <span className="h-[2px] w-20 bg-maroon" />
              <div>
                <p className="font-serif text-lg font-semibold text-ink">Prof. Ing. Eric Ofosu Antwi</p>
                <p className="text-xs uppercase tracking-wider text-muted">Centre Leader · RCEES</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
