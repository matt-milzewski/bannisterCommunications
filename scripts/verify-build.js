const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "_site");

function read(relativePath) {
  const filePath = path.join(outDir, relativePath);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing build file: ${relativePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function assertIncludes(relativePath, expected) {
  const contents = read(relativePath);
  if (!contents.includes(expected)) {
    throw new Error(`Expected ${relativePath} to include: ${expected}`);
  }
}

function assertNotIncludes(relativePath, unexpected) {
  const contents = read(relativePath);
  if (contents.includes(unexpected)) {
    throw new Error(`Expected ${relativePath} not to include: ${unexpected}`);
  }
}

function assertExists(relativePath) {
  const filePath = path.join(outDir, relativePath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
    throw new Error(`Missing or empty build file: ${relativePath}`);
  }
}

const oldLogoPath = ["Bannister", "Logo.jpg"].join("_");

assertIncludes("blog/index.html", "Security Tips and CCTV Advice");
assertIncludes("blog/index.html", "How Security Camera Installation Works for Maryborough Homes");
assertIncludes("blog/security-camera-installation-maryborough-homes/index.html", "BlogPosting");
assertIncludes("blog/cctv-maintenance-checklist-small-businesses/index.html", "CCTV Maintenance Checklist");
assertIncludes("admin/index.html", 'const SITE_ID = "bannister-communications";');
assertIncludes("admin/index.html", "Bannister Blog Console");
assertIncludes("sitemap.xml", "https://www.bannistercommunications.com/blog/");
assertIncludes("sitemap.xml", "https://www.bannistercommunications.com/blog/security-camera-installation-maryborough-homes/");
assertNotIncludes("blog/index.html", "Alarm Systems vs CCTV: What Does Your Property Need?");
assertIncludes("index.html", "Wide Bay &amp; Gympie based");
assertIncludes("index.html", "Based in Wide Bay. Travelling Further for the Right Project.");
assertIncludes("index.html", "Point-to-Point Wireless Links");
assertIncludes("contact.html", "Wide Bay &amp; Gympie Based, with Wider Queensland Coverage");
assertIncludes("contact.html", "Rockhampton");
assertIncludes("services.html", "Starlink Installation &amp; Setup");
assertIncludes("services.html", "Hikvision Authorized Silver Partner for 2026");
assertIncludes("blog/index.html", "/assets/images/bannister-logo.webp");
assertIncludes("blog/security-camera-installation-maryborough-homes/index.html", "/assets/images/bannister-logo.webp");
assertNotIncludes("blog/index.html", oldLogoPath);
assertNotIncludes("blog/security-camera-installation-maryborough-homes/index.html", oldLogoPath);
assertNotIncludes("admin/index.html", oldLogoPath);
assertIncludes("index.html", "Hikvision Authorized Silver Partner for 2026");
assertIncludes("index.html", "Hikvision Silver Partner");
assertIncludes("index.html", "from 4 Google reviews");
assertIncludes("index.html", "Kellie-Ann Groth");
assertExists("assets/images/hikvision-authorized-silver-partner-2026-badge.webp");
assertExists("assets/images/bannister-communications-hikvision-silver-partner-2026.webp");
assertExists("assets/images/bannister-logo.webp");
assertExists("assets/images/craig-bannister.webp");
assertExists("assets/images/active-deterrence-system.webp");
assertExists("assets/images/gate-keeper-intercom.webp");
assertExists("assets/images/home-safety-connected.webp");
assertIncludes("maryborough.html", "CCTV, Security &amp; Communications in Maryborough");
assertIncludes("cctv-installation.html", "CCTV Installation Across Wide Bay &amp; Gympie");
assertIncludes("alarm-systems.html", "Alarm Systems for Wide Bay Homes &amp; Businesses");
assertIncludes("starlink-wireless.html", "Starlink &amp; Wireless Links for Regional Properties");
assertIncludes("data-cabling-antennas.html", "Data Cabling &amp; TV Antenna Installation");
assertIncludes("sitemap.xml", "https://www.bannistercommunications.com/maryborough.html");
assertIncludes("sitemap.xml", "https://www.bannistercommunications.com/hervey-bay.html");
assertIncludes("sitemap.xml", "https://www.bannistercommunications.com/gympie.html");
assertIncludes("sitemap.xml", "https://www.bannistercommunications.com/cctv-installation.html");
assertNotIncludes("index.html", "assets/images/new_logo.PNG");
assertNotIncludes("about.html", "assets/images/Craig.png");
if (fs.existsSync(path.join(outDir, "test.html"))) {
  throw new Error("Production build must not contain test.html");
}

console.log("Build verification passed.");
