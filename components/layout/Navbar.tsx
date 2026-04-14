"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { nav, site, images } from "@/lib/constants";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur">
      <div className="container-rcees flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="relative h-10 w-[140px]">
            <Image src={images.logo} alt={`${site.name} — ${site.fullName}`} fill className="object-contain object-left" priority />
          </div>
          <span className="sr-only">{site.fullName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item, i) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setOpenIdx(i)}
              onMouseLeave={() => setOpenIdx(null)}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-ink no-underline transition hover:text-forest"
              >
                {item.label}
                {item.children ? <ChevronDown className="h-3.5 w-3.5 text-muted" /> : null}
              </Link>
              {item.children && openIdx === i ? (
                <div className="absolute left-0 top-full min-w-[280px] border border-rule bg-paper shadow-lg">
                  <ul className="py-2">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="block px-5 py-3 text-sm text-ink no-underline hover:bg-mist hover:text-forest"
                        >
                          <span className="block font-medium">{c.label}</span>
                          {c.description ? (
                            <span className="mt-0.5 block text-xs text-muted">{c.description}</span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href="/academics/admissions" className="btn-primary">Apply</Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-ink" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-[360px] overflow-y-auto bg-paper shadow-xl">
            <div className="flex h-20 items-center justify-between border-b border-rule px-6">
              <span className="font-serif text-xl text-ink">Menu</span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6 text-ink" />
              </button>
            </div>
            <ul className="divide-y divide-rule">
              {nav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-6 py-4 font-serif text-lg text-ink no-underline hover:bg-mist"
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="bg-mist/50">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            onClick={() => setOpen(false)}
                            className="block px-10 py-3 text-sm text-ink/80 no-underline hover:text-forest"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
            <div className="p-6">
              <Link href="/academics/admissions" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
                Apply
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
