# Image credits and licences

Every stock image used on the site is recorded here — local filename, source,
photographer, licence, date downloaded, and which page(s) use it. This protects
Craig if a licence is ever questioned. Real job photos (in `assets/projects/`)
are Craig's own and are not listed here.

## Sourcing rules (summary — full rules in the brief, section 11a)

- **Pexels** (pexels.com) or **Unsplash** (unsplash.com) only. Both licences allow
  commercial use with no attribution required. Prefer Pexels for API use.
- **Download the file** into `assets/src/` (git-ignored). Never hotlink.
- No identifiable faces without a model release. No visible third-party logos,
  badges, uniforms or vehicle signage. No competitor branded equipment. If a
  camera model is visible and it is not Hikvision, HiLook or PSA Centrii, pick
  another photo.
- Never caption a stock photo as Craig's work. Alt text describes what is shown
  ("CCTV camera mounted under a residential eave"), not "our recent Torquay job".
- When a real job photo arrives it replaces the stock in that slot.

## How to process a new image

Drop the original in `assets/src/`, add a job to `scripts/optimize-images.js`
under `responsiveJobs`, then run:

    npm run images:optimize

That writes `<name>-480.webp`, `<name>-960.webp`, `<name>-1440.webp` and, for a
hero, `<name>-1440.jpg` fallback into `assets/images/`. Hero ≤ 200 KB at 1440px;
section images ≤ 120 KB. Then add the `<img>` with `srcset`, `sizes`, explicit
`width`/`height`, `loading="lazy"` (below the fold), and for a hero
`fetchpriority="high"` plus a `<link rel="preload">`.

---

## Recorded images

_None yet. Add a row per image in this format:_

### `example-name-480/960/1440.webp`
- **Source:** https://www.pexels.com/photo/…-<id>/
- **Photographer:** …
- **Licence:** Pexels License (free commercial use, no attribution required)
- **Downloaded:** YYYY-MM-DD
- **Used on:** /hervey-bay.html (hero)
- **Alt text:** "…"

---

## Shot list still to source (brief section 11b)

Search terms are suggestions — judge each result on whether a Hervey Bay
homeowner would find it credible. A place locals recognise beats a generic
camera shot.

| Page | Slot | Look for |
| --- | --- | --- |
| `hervey-bay.html` | hero | Urangan Pier, the Esplanade, Torquay foreshore, whale-watching coastline. Fallback: a Queensland coastal residential street. |
| `maryborough.html` | hero | Maryborough heritage streetscape, Mary River, Queenslander homes. |
| `gympie.html` | hero | Mary Valley rural acreage, farm sheds, gravel driveway with a gate. |
| all 3 town pages | section | one dome/turret camera on a wall; one phone showing a camera feed; one technician on a ladder at an eave (no visible branding). |
| `cctv-installation.html` | hero | camera close-up in daylight, residential or small commercial. |
| `alarm-systems.html` | hero | alarm keypad or motion sensor on an interior wall. |
| `starlink-wireless.html` | hero | Starlink dish on a roof or rural property (no prominent Starlink logo). |
| `data-cabling-antennas.html` | hero | tidy patch panel or Cat 6 termination, or a TV antenna on a Queensland roofline. |

Until these are sourced, the town and service pages use an on-brand PSA Centrii
equipment photo (`home-safety-connected.webp`) as the hero figure — a real product
shot, not a misleading one — and the layout is ready to swap in a hero band.
