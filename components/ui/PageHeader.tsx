import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  lead,
  image,
  breadcrumbs,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  image?: string;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-rule bg-forest-900 text-paper">
      {image ? (
        <div className="absolute inset-0 -z-10">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-900/70 via-forest-900/80 to-forest-900/95" />
        </div>
      ) : null}
      <div className="container-rcees py-20 md:py-28">
        {breadcrumbs ? (
          <nav className="mb-6 flex items-center gap-1.5 text-xs uppercase tracking-wider text-paper/60">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {b.href ? (
                  <Link href={b.href} className="text-paper/60 no-underline hover:text-paper">{b.label}</Link>
                ) : (
                  <span className="text-paper/90">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 ? <ChevronRight className="h-3 w-3" /> : null}
              </span>
            ))}
          </nav>
        ) : null}
        <p className="eyebrow text-gold">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-serif text-display-lg text-paper">{title}</h1>
        {lead ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85">{lead}</p>
        ) : null}
      </div>
    </section>
  );
}
