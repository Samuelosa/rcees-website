const https = require('https');
const fs    = require('fs');

const KEY = process.env.SERPAPI_KEY;
if (!KEY) { console.error('SERPAPI_KEY not set'); process.exit(1); }

const AUTHORS = [
  { id: '7XmmVJQAAAAJ', slug: 'gyamfi'      },
  { id: 'lWjktyYAAAAJ', slug: 'diawuo'      },
  { id: 'uelQVKAAAAAJ', slug: 'batinge'     },
  { id: 't_vJFsUAAAAJ', slug: 'mensah'      },
  { id: 'EV3PmdEAAAAJ', slug: 'antwi-agyei' },
  { id: 'K8VpdiEAAAAJ', slug: 'derkyi'      },
  { id: 'gl-DhpEAAAAJ', slug: 'nyantakyi'   },
  { id: 'JqhwKYkAAAAJ', slug: 'attiogbe'    },
  { id: 'XkBOIsYAAAAJ', slug: 'okyereh'     },
  { id: 'Kt6MnSAAAAAJ', slug: 'ofosu'       },
  { id: 'qwmXbKIAAAAJ', slug: 'kabo-bah'    },
  { id: 'cGq_c64AAAAJ', slug: 'asuamah'     },
];

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try { resolve(JSON.parse(buf)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const raw = [];

  for (let i = 0; i < AUTHORS.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, 300));
    const author = AUTHORS[i];
    try {
      const url = `https://serpapi.com/search.json?engine=google_scholar_author`
        + `&author_id=${author.id}&api_key=${KEY}&hl=en&sort=pubdate&num=100`;
      const data = await get(url);
      const articles = data.articles || [];
      articles.forEach(a => {
        if (!a.title || !a.year) return;
        raw.push({
          title:       a.title,
          authors:     a.authors      || '',
          publication: a.publication  || '',
          year:        String(a.year),
          link:        a.link         || '',
          citations:   (a.cited_by && a.cited_by.value) || 0,
          slug:        author.slug,
        });
      });
      console.log(`✓ ${author.slug}: ${articles.length} articles`);
    } catch(e) {
      console.warn(`✗ ${author.slug}: ${e.message}`);
    }
  }

  // Deduplicate by normalised title+year
  const map = new Map();
  raw.forEach(a => {
    const key = (a.title + a.year).toLowerCase().replace(/\s+/g, '');
    if (map.has(key)) {
      const ex = map.get(key);
      if (!ex.slugs.includes(a.slug)) ex.slugs.push(a.slug);
    } else {
      map.set(key, { ...a, slugs: [a.slug] });
    }
  });

  const articles = [...map.values()]
    .sort((a, b) => Number(b.year) - Number(a.year));

  const out = { updated: new Date().toISOString(), count: articles.length, articles };
  fs.writeFileSync('publications.json', JSON.stringify(out, null, 2));
  console.log(`\nWrote ${articles.length} articles → publications.json`);
}

main().catch(e => { console.error(e); process.exit(1); });
