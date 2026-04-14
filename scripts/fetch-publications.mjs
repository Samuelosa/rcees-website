#!/usr/bin/env node
/**
 * Fetches RCEES publications from OpenAlex and writes public/data/publications.json.
 * Runs at build time (GitHub Actions cron + on push) so the static site always ships
 * with the latest corpus.
 *
 * Sources:
 *   - OpenAlex works filtered by UENR institution lineage + "RCEES" in raw affiliation
 *   - OpenAlex works where raw affiliation mentions the full centre name
 * Deduped by OpenAlex work ID.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(__dirname, "..", "public", "data", "publications.json");

const UENR_INSTITUTION = "I291863076";
const MAILTO = "rcees@uenr.edu.gh";
const PER_PAGE = 200;

const SELECT = [
  "id",
  "doi",
  "title",
  "display_name",
  "publication_year",
  "publication_date",
  "type",
  "cited_by_count",
  "authorships",
  "primary_location",
  "open_access",
  "language",
  "referenced_works_count",
  "concepts",
].join(",");

const FILTERS = [
  `authorships.institutions.lineage:${UENR_INSTITUTION},raw_affiliation_strings.search:RCEES`,
  `raw_affiliation_strings.search:"Regional Centre for Energy and Environmental Sustainability"`,
];

async function fetchAll(filter) {
  const works = [];
  let cursor = "*";
  let page = 0;
  while (cursor) {
    const url = new URL("https://api.openalex.org/works");
    url.searchParams.set("filter", filter);
    url.searchParams.set("per-page", String(PER_PAGE));
    url.searchParams.set("cursor", cursor);
    url.searchParams.set("select", SELECT);
    url.searchParams.set("mailto", MAILTO);

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`OpenAlex ${res.status}: ${await res.text()}`);
    }
    const data = await res.json();
    works.push(...data.results);
    cursor = data.meta.next_cursor;
    page++;
    if (page > 30) break; // safety ceiling
  }
  return works;
}

function normalise(w) {
  const authors = (w.authorships || []).map((a) => ({
    name: a.author?.display_name || "Unknown",
    orcid: a.author?.orcid || null,
    isRcees: (a.raw_affiliation_strings || []).some((s) =>
      /RCEES|Regional Centre for Energy and Environmental Sustainability/i.test(s),
    ),
  }));

  const venue = w.primary_location?.source?.display_name || null;
  const venueType = w.primary_location?.source?.type || null;
  const isOa = w.open_access?.is_oa || false;
  const oaUrl = w.open_access?.oa_url || null;
  const landingUrl = w.primary_location?.landing_page_url || null;

  const topics = (w.concepts || [])
    .filter((c) => c.level <= 1)
    .slice(0, 4)
    .map((c) => c.display_name);

  return {
    id: w.id,
    doi: w.doi,
    title: w.title || w.display_name || "Untitled",
    year: w.publication_year,
    date: w.publication_date,
    type: w.type,
    citations: w.cited_by_count || 0,
    authors,
    venue,
    venueType,
    isOpenAccess: isOa,
    url: oaUrl || landingUrl || w.doi || w.id,
    topics,
  };
}

async function main() {
  console.log("Fetching RCEES publications from OpenAlex…");
  const all = [];
  for (const f of FILTERS) {
    console.log(`  filter: ${f}`);
    const works = await fetchAll(f);
    console.log(`  -> ${works.length} works`);
    all.push(...works);
  }

  const byId = new Map();
  for (const w of all) byId.set(w.id, w);
  const deduped = [...byId.values()].map(normalise);

  deduped.sort((a, b) => {
    if (b.year !== a.year) return (b.year || 0) - (a.year || 0);
    return b.citations - a.citations;
  });

  const payload = {
    source: "openalex",
    fetchedAt: new Date().toISOString(),
    count: deduped.length,
    publications: deduped,
  };

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(payload, null, 2));
  console.log(`Wrote ${deduped.length} publications -> ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
