import { partners } from "@/lib/constants";

export function PartnerMarquee() {
  const items = [...partners, ...partners];
  return (
    <section className="border-b border-rule bg-paper py-12">
      <div className="container-wide mb-8 flex items-center gap-4">
        <span className="h-px flex-1 bg-rule" />
        <p className="eyebrow">Backed by partners across four continents</p>
        <span className="h-px flex-1 bg-rule" />
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {items.map((p, i) => (
            <span key={`${p.name}-${i}`} className="whitespace-nowrap font-serif text-xl italic text-ink/55">
              {p.name}
              <span className="ml-16 inline-block h-1.5 w-1.5 rounded-full bg-sun align-middle" />
            </span>
          ))}
        </div>
        <div className="marquee-track" aria-hidden="true">
          {items.map((p, i) => (
            <span key={`b-${p.name}-${i}`} className="whitespace-nowrap font-serif text-xl italic text-ink/55">
              {p.name}
              <span className="ml-16 inline-block h-1.5 w-1.5 rounded-full bg-sun align-middle" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
