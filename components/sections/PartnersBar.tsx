import Link from "next/link";
import { partners } from "@/lib/constants";

export function PartnersBar() {
  const featured = partners.slice(0, 8);
  return (
    <section className="container-rcees py-24">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Partners and affiliations</p>
          <h2 className="mt-3 font-serif text-display-md text-ink">A network across four continents.</h2>
        </div>
        <Link href="/partners" className="text-sm font-medium text-forest">
          View all partners →
        </Link>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-3 lg:grid-cols-4">
        {featured.map((p) => (
          <li key={p.name} className="flex min-h-[120px] flex-col justify-center bg-paper px-6 py-6">
            <p className="font-serif text-base leading-snug text-ink">{p.name}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-muted">{p.role}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
