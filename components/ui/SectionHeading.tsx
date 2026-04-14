import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  children?: ReactNode;
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-prose ${alignClass}`}>
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      <h2 className="font-serif text-display-md text-ink">{title}</h2>
      {lead ? <p className="mt-5 text-lg leading-relaxed text-ink/80">{lead}</p> : null}
      {children}
    </div>
  );
}
