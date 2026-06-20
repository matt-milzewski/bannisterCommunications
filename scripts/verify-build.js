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

assertIncludes("blog/index.html", "Security Tips and CCTV Advice");
assertIncludes("blog/index.html", "How Security Camera Installation Works for Maryborough Homes");
assertIncludes("blog/security-camera-installation-maryborough-homes/index.html", "BlogPosting");
assertIncludes("blog/cctv-maintenance-checklist-small-businesses/index.html", "CCTV Maintenance Checklist");
assertIncludes("admin/index.html", 'const SITE_ID = "bannister-communications";');
assertIncludes("admin/index.html", "Bannister Blog Console");
assertIncludes("sitemap.xml", "https://www.bannistercommunications.com/blog/");
assertIncludes("sitemap.xml", "https://www.bannistercommunications.com/blog/security-camera-installation-maryborough-homes/");
assertNotIncludes("blog/index.html", "Alarm Systems vs CCTV: What Does Your Property Need?");

console.log("Build verification passed.");
