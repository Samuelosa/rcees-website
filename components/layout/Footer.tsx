import Link from "next/link";
import { site } from "@/lib/constants";

const quickLinks = [
  { label: "About RCEES", href: "/about" },
  { label: "Programmes", href: "/academics" },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
  { label: "News & Events", href: "/news" },
  { label: "Admissions", href: "/academics/admissions" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-rule bg-forest-900 text-paper">
      <div className="container-rcees py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-2xl text-paper">{site.name}</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-wider text-gold">{site.tagline}</p>
            <p className="mt-6 text-sm leading-relaxed text-paper/75">
              The Regional Centre for Energy and Environmental Sustainability is a World Bank–funded Africa
              Centre of Excellence at the University of Energy and Natural Resources, Ghana.
            </p>
          </div>

          <div>
            <p className="eyebrow text-gold">Quick links</p>
            <ul className="mt-5 space-y-3 text-sm">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-paper/80 no-underline hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gold">Contact</p>
            <address className="mt-5 space-y-2 not-italic text-sm leading-relaxed text-paper/80">
              {site.address.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </address>
            <div className="mt-4 space-y-1 text-sm text-paper/80">
              {site.phones.map((p) => (
                <p key={p}>
                  <a href={`tel:${p.replace(/\s/g, "")}`} className="text-paper/80 no-underline hover:text-paper">
                    {p}
                  </a>
                </p>
              ))}
              <p>
                <a href={`mailto:${site.email}`} className="text-paper/80 no-underline hover:text-paper">
                  {site.email}
                </a>
              </p>
            </div>
          </div>

          <div>
            <p className="eyebrow text-gold">Newsletter</p>
            <p className="mt-5 text-sm text-paper/80">
              Occasional updates on research, admissions and events. No spam.
            </p>
            <form
              className="mt-5 flex border border-paper/30"
              action={`mailto:${site.email}`}
              method="post"
              encType="text/plain"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full bg-transparent px-4 py-3 text-sm text-paper placeholder:text-paper/50 focus:outline-none"
              />
              <button type="submit" className="bg-gold px-5 text-xs font-semibold uppercase tracking-wider text-ink transition hover:bg-gold-600">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/15 pt-8 text-xs text-paper/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} RCEES, University of Energy and Natural Resources. All rights reserved.</p>
          <p>World Bank Africa Centre of Excellence for Development Impact (ACE Impact).</p>
        </div>
      </div>
    </footer>
  );
}
