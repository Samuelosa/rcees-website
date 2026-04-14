"use client";

import { useEffect, useMemo, useState } from "react";

type Author = { name: string; orcid: string | null; isRcees: boolean };
type Publication = {
  id: string;
  doi: string | null;
  title: string;
  year: number | null;
  date: string | null;
  type: string | null;
  citations: number;
  authors: Author[];
  venue: string | null;
  venueType: string | null;
  isOpenAccess: boolean;
  url: string;
  topics: string[];
};
type Payload = {
  source: string;
  fetchedAt: string;
  count: number;
  publications: Publication[];
};

type SortKey = "year-desc" | "year-asc" | "citations-desc" | "title-asc";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function PublicationsExplorer() {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("year-desc");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [oaOnly, setOaOnly] = useState(false);
  const [visible, setVisible] = useState(25);

  useEffect(() => {
    let cancelled = false;
    fetch(`${basePath}/data/publications.json`, { cache: "no-cache" })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: Payload) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const pubs = data?.publications || [];

  const types = useMemo(() => {
    const set = new Set<string>();
    pubs.forEach((p) => p.type && set.add(p.type));
    return ["all", ...Array.from(set).sort()];
  }, [pubs]);

  const years = useMemo(() => {
    const set = new Set<number>();
    pubs.forEach((p) => p.year && set.add(p.year));
    return ["all", ...Array.from(set).sort((a, b) => (b as number) - (a as number))];
  }, [pubs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = pubs.filter((p) => {
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (yearFilter !== "all" && String(p.year) !== yearFilter) return false;
      if (oaOnly && !p.isOpenAccess) return false;
      if (!q) return true;
      if (p.title.toLowerCase().includes(q)) return true;
      if (p.venue && p.venue.toLowerCase().includes(q)) return true;
      if (p.authors.some((a) => a.name.toLowerCase().includes(q))) return true;
      if (p.topics.some((t) => t.toLowerCase().includes(q))) return true;
      return false;
    });

    const sorted = [...list];
    switch (sort) {
      case "year-desc":
        sorted.sort((a, b) => (b.year || 0) - (a.year || 0) || b.citations - a.citations);
        break;
      case "year-asc":
        sorted.sort((a, b) => (a.year || 9999) - (b.year || 9999));
        break;
      case "citations-desc":
        sorted.sort((a, b) => b.citations - a.citations);
        break;
      case "title-asc":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return sorted;
  }, [pubs, query, sort, typeFilter, yearFilter, oaOnly]);

  const totalCitations = useMemo(
    () => pubs.reduce((s, p) => s + p.citations, 0),
    [pubs],
  );
  const rceesAuthors = useMemo(() => {
    const set = new Set<string>();
    pubs.forEach((p) =>
      p.authors.filter((a) => a.isRcees).forEach((a) => set.add(a.name)),
    );
    return set.size;
  }, [pubs]);

  if (error) {
    return (
      <div className="mt-10 border border-rule bg-paper p-8 text-sm text-ink/70">
        Could not load publications: {error}. The full list is available via the
        UENR library and the ACE Impact research repository.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-10 border border-rule bg-paper p-8 text-sm text-muted">
        Loading publications…
      </div>
    );
  }

  const fetchedOn = new Date(data.fetchedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="mt-10">
      <div className="grid gap-px border border-rule bg-rule md:grid-cols-4">
        <Stat label="Publications" value={data.count.toLocaleString()} />
        <Stat label="Citations" value={totalCitations.toLocaleString()} />
        <Stat label="RCEES authors" value={rceesAuthors.toLocaleString()} />
        <Stat label="Last updated" value={fetchedOn} small />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_auto_auto_auto]">
        <input
          type="search"
          placeholder="Search title, author, venue, topic…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(25);
          }}
          className="border border-rule bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink"
        />
        <Select
          value={sort}
          onChange={(v) => setSort(v as SortKey)}
          options={[
            { value: "year-desc", label: "Newest first" },
            { value: "year-asc", label: "Oldest first" },
            { value: "citations-desc", label: "Most cited" },
            { value: "title-asc", label: "Title A–Z" },
          ]}
        />
        <Select
          value={typeFilter}
          onChange={(v) => {
            setTypeFilter(v);
            setVisible(25);
          }}
          options={types.map((t) => ({
            value: String(t),
            label: t === "all" ? "All types" : String(t).replace("-", " "),
          }))}
        />
        <Select
          value={yearFilter}
          onChange={(v) => {
            setYearFilter(v);
            setVisible(25);
          }}
          options={years.map((y) => ({
            value: String(y),
            label: y === "all" ? "All years" : String(y),
          }))}
        />
        <label className="flex items-center gap-2 border border-rule bg-paper px-4 py-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={oaOnly}
            onChange={(e) => setOaOnly(e.target.checked)}
          />
          Open access
        </label>
      </div>

      <p className="mt-4 text-xs text-muted">
        Showing {Math.min(filtered.length, visible)} of {filtered.length}
        {filtered.length !== data.count && ` (filtered from ${data.count})`}
      </p>

      <ol className="mt-6 divide-y divide-rule border-y border-rule">
        {filtered.slice(0, visible).map((p) => (
          <li key={p.id} className="py-6">
            <article>
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="font-serif text-lg leading-snug text-ink">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {p.title}
                  </a>
                </h3>
                <span className="whitespace-nowrap font-mono text-xs text-muted">
                  {p.year ?? "—"}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink/75">
                {p.authors.slice(0, 6).map((a, i) => (
                  <span key={i}>
                    <span className={a.isRcees ? "font-medium text-ink" : ""}>
                      {a.name}
                    </span>
                    {i < Math.min(p.authors.length, 6) - 1 ? ", " : ""}
                  </span>
                ))}
                {p.authors.length > 6 && ` …+${p.authors.length - 6} more`}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                {p.venue && <span className="italic">{p.venue}</span>}
                {p.type && <span className="uppercase tracking-wide">{p.type}</span>}
                <span>{p.citations} citations</span>
                {p.isOpenAccess && (
                  <span className="border border-rule px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-ink">
                    Open access
                  </span>
                )}
                {p.doi && (
                  <a
                    href={p.doi}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-ink/60 hover:text-ink"
                  >
                    {p.doi.replace("https://doi.org/", "doi:")}
                  </a>
                )}
              </div>
            </article>
          </li>
        ))}
      </ol>

      {visible < filtered.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisible((v) => v + 25)}
            className="btn-primary"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="bg-paper p-6">
      <p className="eyebrow">{label}</p>
      <p
        className={`mt-2 font-serif text-ink ${small ? "text-lg" : "text-3xl"}`}
      >
        {value}
      </p>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-rule bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-ink"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
