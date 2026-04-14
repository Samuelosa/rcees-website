import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function Card({
  title,
  children,
  href,
  footer,
  eyebrow,
}: {
  title: ReactNode;
  children?: ReactNode;
  href?: string;
  footer?: ReactNode;
  eyebrow?: string;
}) {
  const inner = (
    <div className="group flex h-full flex-col border border-rule bg-paper p-7 transition hover:border-forest">
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h3 className="font-serif text-2xl text-ink">{title}</h3>
      <div className="mt-4 flex-1 text-[0.975rem] leading-relaxed text-ink/75">{children}</div>
      {footer ? (
        <div className="mt-6 text-sm text-muted">{footer}</div>
      ) : href ? (
        <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-forest">
          Learn more <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      ) : null}
    </div>
  );
  if (href) return <Link href={href} className="block no-underline">{inner}</Link>;
  return inner;
}
