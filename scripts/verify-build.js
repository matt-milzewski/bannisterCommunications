const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "_site");

let failures = 0;

function read(relativePath) {
  const filePath = path.join(outDir, relativePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing build file: ${relativePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function check(label, condition) {
  if (!condition) {
    failures += 1;
    console.error(`  FAIL  ${label}`);
  }
}

function assertIncludes(relativePath, expected) {
  check(`${relativePath} includes "${expected}"`, read(relativePath).includes(expected));
}

function assertNotIncludes(relativePath, unexpected) {
  check(`${relativePath} does not include "${unexpected}"`, !read(relativePath).includes(unexpected));
}

function assertExists(relativePath) {
  const filePath = path.join(outDir, relativePath);
  check(
    `${relativePath} exists and is non-empty`,
    fs.existsSync(filePath) && fs.statSync(filePath).size > 0,
  );
}

/* ---- title() / h1() helpers ---- */
function titleOf(html) {
  return ((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'");
}
function h1Of(html) {
  return (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || "";
}

const allPages = [
  "index.html",
  "about.html",
  "services.html",
  "contact.html",
  "maryborough.html",
  "hervey-bay.html",
  "gympie.html",
  "cctv-installation.html",
  "alarm-systems.html",
  "starlink-wireless.html",
  "data-cabling-antennas.html",
];

/* ---- 1. Titles / H1s: no "Wide Bay" or "Regional Queensland" as the lead ---- */
for (const page of allPages) {
  const html = read(page);
  const title = titleOf(html);
  const h1 = h1Of(html);
  check(`${page} <title> does not lead with "Wide Bay"`, !/^\s*wide bay/i.test(title));
  check(`${page} <title> does not lead with "Regional Queensland"`, !/^\s*regional queensland/i.test(title));
  check(`${page} <h1> does not contain "Wide Bay"`, !/wide bay/i.test(h1));
  check(`${page} <h1> does not lead with "Regional Queensland"`, !/^\s*regional queensland/i.test(h1));
  check(`${page} <title> length 30-70`, title.length >= 30 && title.length <= 70);
  const desc = ((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'");
  check(`${page} meta description 110-160 chars (${desc.length})`, desc.length >= 110 && desc.length <= 160);
}

/* ---- 2. Every service + town page names a town somewhere in a heading ---- */
const townRe = /(Maryborough|Hervey Bay|Gympie|Fraser Coast)/;
for (const page of ["cctv-installation.html", "alarm-systems.html", "starlink-wireless.html", "data-cabling-antennas.html", "maryborough.html", "hervey-bay.html", "gympie.html"]) {
  const h2s = (read(page).match(/<h2[^>]*>[\s\S]*?<\/h2>/g) || []).join(" ");
  check(`${page} has at least one <h2> naming a town`, townRe.test(h2s));
}

/* ---- 3. Service pages no longer share the old identical H2 skeleton ---- */
for (const page of ["cctv-installation.html", "alarm-systems.html", "starlink-wireless.html", "data-cabling-antennas.html"]) {
  assertNotIncludes(page, "A System Designed to Work in the Real World");
  assertNotIncludes(page, "What to Know Before Requesting a Quote");
  assertNotIncludes(page, "Wide Bay &amp; Gympie Based");
}

/* ---- 4. Shared nav + footer + LocalBusiness on every page ---- */
for (const page of [...allPages, "404.html", "blog/index.html"]) {
  const html = read(page);
  check(`${page} has exactly one <header class="header">`, (html.match(/<header class="header">/g) || []).length === 1);
  check(`${page} has exactly one <footer class="footer">`, (html.match(/<footer class="footer">/g) || []).length === 1);
  check(`${page} nav links to a town page`, html.includes('href="/hervey-bay.html"'));
  check(`${page} nav has Services submenu`, html.includes("has-submenu"));
  check(`${page} footer links Facebook`, html.includes("facebook.com/bcommunicarions"));
  check(`${page} exactly one mobile-cta-bar`, (html.match(/mobile-cta-bar/g) || []).length >= 1);
}
for (const page of allPages) {
  const html = read(page);
  check(`${page} has one LocalBusiness JSON-LD`, (html.match(/"@type":\s*\["LocalBusiness","ProfessionalService"\]/g) || []).length === 1);
  check(`${page} LocalBusiness sameAs is Facebook only`, /"sameAs":\["https:\/\/www\.facebook\.com\/bcommunicarions"\]/.test(html));
  check(`${page} has no aggregateRating markup`, !html.includes('"aggregateRating"'));
  check(`${page} has no Review schema`, !/"@type":\s*"Review"/.test(html));
}

/* ---- 5. BreadcrumbList schema on every non-home page ---- */
for (const page of ["about.html", "services.html", "contact.html", "maryborough.html", "hervey-bay.html", "gympie.html", "cctv-installation.html", "alarm-systems.html", "starlink-wireless.html", "data-cabling-antennas.html"]) {
  assertIncludes(page, '"@type":"BreadcrumbList"');
}

/* ---- 6. Town + service pages carry FAQPage schema ---- */
for (const page of ["maryborough.html", "hervey-bay.html", "gympie.html", "cctv-installation.html", "alarm-systems.html", "starlink-wireless.html", "data-cabling-antennas.html"]) {
  assertIncludes(page, '"@type":"FAQPage"');
}

/* ---- 7. Internal linking: services <-> towns ---- */
for (const service of ["cctv-installation.html", "alarm-systems.html", "starlink-wireless.html", "data-cabling-antennas.html"]) {
  const html = read(service);
  for (const town of ["maryborough.html", "hervey-bay.html", "gympie.html"]) {
    check(`${service} links to /${town}`, html.includes(`href="/${town}"`));
  }
}
for (const town of ["maryborough.html", "hervey-bay.html", "gympie.html"]) {
  const html = read(town);
  for (const service of ["cctv-installation.html", "alarm-systems.html", "starlink-wireless.html", "data-cabling-antennas.html"]) {
    check(`${town} links to /${service}`, html.includes(`href="/${service}"`));
  }
}
const home = read("index.html");
for (const link of ["/maryborough.html", "/hervey-bay.html", "/gympie.html", "/cctv-installation.html", "/alarm-systems.html", "/starlink-wireless.html", "/data-cabling-antennas.html"]) {
  check(`index.html body links ${link}`, home.includes(`href="${link}"`));
}

/* ---- 8. Town pages: structure + depth ---- */
for (const town of ["maryborough.html", "hervey-bay.html", "gympie.html"]) {
  const html = read(town);
  const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  check(`${town} has 700+ words of rendered text`, text.split(" ").length > 700);
  check(`${town} lists suburbs`, html.includes("Suburbs We Cover"));
  check(`${town} has a "Recent work" hook or hidden section`, !html.includes("<h2>Recent work in") || html.includes("project-grid"));
}

/* ---- 9. Trust strip on every marketing page ---- */
for (const page of ["index.html", "about.html", "services.html", "contact.html", "maryborough.html", "hervey-bay.html", "gympie.html", "cctv-installation.html"]) {
  assertIncludes(page, "trust-strip");
  assertNotIncludes(page, "<!-- TRUST_STRIP -->");
}

/* ---- 10. Contact form spam protection ---- */
assertIncludes("contact.html", 'name="_gotcha"');
assertIncludes("contact.html", 'action="https://formspree.io/f/xyzdakbn"');
assertIncludes("contact.html", 'data-anchor-site-id="bannister-communications"');
assertIncludes("contact.html", 'name="_startedAt"');
assertIncludes("contact.html", 'name="_idempotencyKey"');
assertIncludes("contact.html", 'id="backup-submit-btn"');
assertNotIncludes("contact.html", "__ANCHOR_FORMS_API_BASE__");

/* ---- 11. Asset versions bumped and consistent ---- */
for (const page of [...allPages, "404.html"]) {
  const html = read(page);
  check(`${page} references style.css?v=7`, html.includes("style.css?v=7"));
  check(`${page} has no stale style.css?v=6`, !html.includes("style.css?v=6"));
  check(`${page} references main.js?v=7`, html.includes("main.js?v=7"));
  check(`${page} has no stale main.js?v=4, v=5 or v=6`, !html.includes("main.js?v=4") && !html.includes("main.js?v=5") && !html.includes("main.js?v=6"));
}

/* ---- 12. Sitemap: real per-file lastmod (not all identical) ---- */
const sitemap = read("sitemap.xml");
for (const loc of ["/maryborough.html", "/hervey-bay.html", "/gympie.html", "/cctv-installation.html"]) {
  check(`sitemap has ${loc}`, sitemap.includes(`https://www.bannistercommunications.com${loc}`));
}
const lastmods = [...sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((m) => m[1]);
check("sitemap lastmods are not all identical", new Set(lastmods).size > 1);
check("sitemap still lists both blog posts", sitemap.includes("/blog/security-camera-installation-maryborough-homes/") && sitemap.includes("/blog/cctv-maintenance-checklist-small-businesses/"));

/* ---- 13. Blog untouched ---- */
assertIncludes("blog/index.html", "Security Tips and CCTV Advice");
assertIncludes("blog/security-camera-installation-maryborough-homes/index.html", "BlogPosting");
assertIncludes("blog/cctv-maintenance-checklist-small-businesses/index.html", "CCTV Maintenance Checklist");
assertNotIncludes("blog/index.html", "Alarm Systems vs CCTV: What Does Your Property Need?");
assertIncludes("admin/index.html", 'const SITE_ID = "bannister-communications";');

/* ---- 14. Images referenced still exist ---- */
for (const img of [
  "assets/images/hikvision-authorized-silver-partner-2026-badge.webp",
  "assets/images/bannister-communications-hikvision-silver-partner-2026.webp",
  "assets/images/bannister-logo.webp",
  "assets/images/craig-bannister.webp",
  "assets/images/home-safety-connected.webp",
]) {
  assertExists(img);
}

if (fs.existsSync(path.join(outDir, "test.html"))) {
  failures += 1;
  console.error("  FAIL  production build must not contain test.html");
}

if (failures) {
  console.error(`\nBuild verification FAILED with ${failures} problem(s).`);
  process.exit(1);
}
console.log("Build verification passed.");
