# Traffic baseline — fixed reference for the 30/60/90 day checks

Recorded 10 September 2026, before the local SEO rebuild (branch `seo-local-rebuild`).
Do not edit these numbers. They are the fixed "before" that the post-launch checks compare against.

## Search Console — 90 days to 7 September 2026

| Metric | Value |
| --- | --- |
| Mobile impressions | 422 |
| Mobile clicks | 37 |
| Mobile CTR | 8.8% |
| Clicks on any "Hervey Bay" query | 0 |
| `hervey-bay.html` average position | 13.6 |
| `maryborough.html` | not indexed |
| `gympie.html` | not indexed |

Note: the last quarter also shows ~576 desktop impressions on `hervey-bay.html` across
26–27 Aug against anonymised queries. That is automated rank checking / SERP scraping,
not customers. Ignore it. The mobile figures above are the human signal.

## Search Console — 16 months to 7 September 2026

| Metric | Value |
| --- | --- |
| Total clicks | 229 |
| Total impressions | 4,460 |
| Average position | 18.6 |

## Key town-named queries (impressions / avg position)

| Query | Impressions | Avg position |
| --- | --- | --- |
| security cameras hervey bay | 91 | 18.9 |
| security systems hervey bay | 54 | 21.6 |
| cctv and surveillance cameras hervey bay | 45 | 23.0 |
| hikvision installers | 39 | 63 |
| school key fob security systems hervey bay | 29 | — |

The homepage and `hervey-bay.html` both showed for "security cameras hervey bay"
(39 and 53 impressions respectively) — Google could not tell which page was the
Hervey Bay page. The retitling points the homepage at Maryborough to resolve this.

## Formspree inbox

| Metric | Value |
| --- | --- |
| Genuine leads, Sep 2025 – Aug 2026 (11 months) | 15 |
| Spam submissions caught | 347 |
| Leads from Hervey Bay | 1 |
| Leads from Gympie | 0 |

Conversion of the clicks the site gets is fine (8.8% mobile CTR). Reach is the problem:
roughly 140 qualified impressions a month.

## Checks Matt will run at 30 / 60 / 90 days

1. Search Console, mobile only, last 28 days: impressions, clicks, and the position of
   `security cameras hervey bay`, `security systems hervey bay`,
   `security services maryborough`, `security systems gympie`.
2. Pages report: are `maryborough.html` and `gympie.html` indexed and showing impressions.
3. Business Profile: calls, direction requests, website clicks.
4. Formspree inbox count.

If mobile impressions have not moved by day 60, the next lever is content depth and
reviews (real project write-ups from Craig via `content/projects.yml`), not more code.
