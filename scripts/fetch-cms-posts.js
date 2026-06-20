const fs = require("node:fs");
const path = require("node:path");

const siteId = process.env.ANCHOR_CMS_SITE_ID || "bannister-communications";
const apiBase = process.env.ANCHOR_CMS_API_BASE;
const outputPath = path.resolve(__dirname, "..", "data", "cmsBlogPosts.json");

async function main() {
  if (!apiBase) {
    console.log("ANCHOR_CMS_API_BASE not set; using checked-in data/cmsBlogPosts.json.");
    return;
  }

  const url = `${apiBase.replace(/\/$/, "")}/api/cms/sites/${encodeURIComponent(siteId)}/published-posts`;
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "bannister-communications-build",
    },
  });

  if (!response.ok) {
    throw new Error(`CMS fetch failed: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload.posts)) {
    throw new Error("CMS response did not include a posts array.");
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(payload.posts, null, 2)}\n`);
  console.log(`Fetched ${payload.posts.length} CMS posts for ${siteId}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
