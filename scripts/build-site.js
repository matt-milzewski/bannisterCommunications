const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "_site");
const dataPath = path.join(root, "data", "cmsBlogPosts.json");
const site = {
  name: "Bannister Communications",
  url: "https://www.bannistercommunications.com",
  description:
    "Security camera installation, alarm systems, CCTV maintenance, and communications services for Maryborough homes and businesses.",
  defaultImage: "/assets/images/new_logo.PNG",
  phone: "0416 945 872",
  phoneHref: "tel:+61416945872",
  email: "support@bannistercommunications.com",
};

const copyExcludes = new Set([
  ".git",
  ".github",
  "_site",
  "data",
  "node_modules",
  "scripts",
]);

const fileExcludes = new Set([
  "package.json",
  "package-lock.json",
  "server.log",
  "test.html",
]);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyStatic(src, dest) {
  const name = path.basename(src);
  if (copyExcludes.has(name)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const entry of fs.readdirSync(src)) {
      copyStatic(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  if (fileExcludes.has(name)) return;
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(value = "") {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function isoDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
}

function readableDate(value) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate(value)));
}

function nav(current = "") {
  const items = [
    ["/", "Home", "home"],
    ["/about.html", "About", "about"],
    ["/services.html", "Services", "services"],
    ["/blog/", "Blog", "blog"],
    ["/contact.html", "Contact", "contact"],
  ];
  return `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <a href="/"><img src="/assets/images/new_logo.PNG" alt="Bannister Communications logo"></a>
        </div>
        <nav class="nav" id="nav">
          <ul>
            ${items
              .map(([href, label, key]) => `<li><a href="${href}"${current === key ? ' class="current"' : ""}>${label}</a></li>`)
              .join("\n")}
          </ul>
        </nav>
        <button class="menu-toggle" id="menu-toggle" aria-label="Toggle navigation">Menu</button>
      </div>
    </header>`;
}

function footer() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <img src="/assets/images/new_logo.PNG" alt="Bannister Communications">
            <p>Proudly installing PSA Centrii & HiLook systems</p>
          </div>
          <div class="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about.html">About</a></li>
              <li><a href="/services.html">Services</a></li>
              <li><a href="/blog/">Blog</a></li>
              <li><a href="/contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="footer-contact">
            <h3>Contact Info</h3>
            <p>Maryborough QLD</p>
            <p>Phone: <a href="${site.phoneHref}">${site.phone}</a></p>
            <p>Email: <a href="mailto:${site.email}">${site.email}</a></p>
            <p>Facebook: <a href="https://www.facebook.com/bcommunicarions" target="_blank" rel="noopener">@bcommunicarions</a></p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 Bannister Communications. Security Licence #4429602 | ABN: 32861916822</p>
          <p>Website built by <a href="https://anchorwebco.com.au" target="_blank" rel="noopener">Anchor Web Co.</a></p>
        </div>
      </div>
    </footer>
    <div class="mobile-cta-bar">
      <a href="${site.phoneHref}" class="mobile-cta-call">Call Now</a>
      <a href="/contact.html" class="mobile-cta-quote">Get Quote</a>
    </div>`;
}

function layout({ title, description, canonical, image, type = "website", current = "blog", body, schema = "" }) {
  const pageTitle = `${title} | ${site.name}`;
  const resolvedImage = image?.startsWith("http") ? image : `${site.url}${image || site.defaultImage}`;
  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description || site.description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/png" href="/assets/images/new_logo.PNG">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(description || site.description)}">
  <meta property="og:image" content="${escapeHtml(resolvedImage)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:type" content="${type}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description || site.description)}">
  <meta name="twitter:image" content="${escapeHtml(resolvedImage)}">
  <link rel="alternate" type="application/atom+xml" title="${site.name} Blog Feed" href="${site.url}/blog/feed.xml">
  <link rel="stylesheet" href="/assets/css/style.css?v=5">
  ${schema}
</head>
<body>
  ${nav(current)}
  <main>${body}</main>
  ${footer()}
  <script src="/assets/js/main.js?v=4" defer></script>
</body>
</html>
`;
}

function readPosts() {
  if (!fs.existsSync(dataPath)) return [];
  return JSON.parse(fs.readFileSync(dataPath, "utf8"))
    .filter((post) => post.status === "published")
    .sort((left, right) => new Date(right.date) - new Date(left.date));
}

function renderBlogIndex(posts) {
  const cards = posts.length
    ? posts
        .map(
          (post) => `
          <article class="blog-card">
            ${post.featuredImage ? `<a href="/blog/${post.slug}/" class="blog-card__image-link"><img src="${post.featuredImage}" alt="${escapeHtml(post.title)}" class="blog-card__image" loading="lazy"></a>` : ""}
            <div class="blog-card__content">
              <p class="blog-meta"><time datetime="${isoDate(post.date)}">${readableDate(post.date)}</time></p>
              <h2><a href="/blog/${post.slug}/">${escapeHtml(post.title)}</a></h2>
              <p>${escapeHtml(post.description || "")}</p>
              <a class="learn-more" href="/blog/${post.slug}/">Read article</a>
            </div>
          </article>`,
        )
        .join("\n")
    : `<div class="blog-empty"><p>No posts yet. Check back soon for security and CCTV advice.</p></div>`;

  return layout({
    title: "Security Tips and CCTV Advice",
    description: "Security camera, CCTV maintenance, alarm system, and communications advice from Bannister Communications in Maryborough.",
    canonical: `${site.url}/blog/`,
    current: "blog",
    body: `
      <section class="page-hero blog-hero">
        <div class="container">
          <h1>Security Tips and CCTV Advice</h1>
          <p class="hero-subtitle">Practical articles for Maryborough homes and businesses planning CCTV, alarms, and communications upgrades.</p>
        </div>
      </section>
      <section class="blog-section">
        <div class="container">
          <div class="blog-grid">${cards}</div>
        </div>
      </section>`,
  });
}

function renderPost(post) {
  const canonical = `${site.url}/blog/${post.slug}/`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.description,
    datePublished: isoDate(post.date),
    dateModified: post.updatedAt || isoDate(post.date),
    author: {
      "@type": "Organization",
      name: site.name,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/assets/images/new_logo.PNG`,
      },
    },
    image: post.featuredImage ? `${site.url}${post.featuredImage}` : `${site.url}${site.defaultImage}`,
    mainEntityOfPage: canonical,
    articleBody: stripHtml(post.body).slice(0, 5000),
  };

  return layout({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.description,
    canonical,
    image: post.featuredImage,
    type: "article",
    current: "blog",
    schema: `<script type="application/ld+json">${JSON.stringify(articleSchema)}</script>`,
    body: `
      <section class="page-hero blog-hero">
        <div class="container">
          <p class="blog-meta"><time datetime="${isoDate(post.date)}">${readableDate(post.date)}</time></p>
          <h1>${escapeHtml(post.title)}</h1>
          ${post.description ? `<p class="hero-subtitle">${escapeHtml(post.description)}</p>` : ""}
        </div>
      </section>
      <article class="blog-post">
        <div class="container blog-post__container">
          ${post.featuredImage ? `<img src="${post.featuredImage}" alt="${escapeHtml(post.title)}" class="blog-post__image" loading="eager">` : ""}
          <div class="blog-content">${post.body || ""}</div>
          <div class="blog-cta">
            <h2>Need help with security cameras or alarms?</h2>
            <p>Talk to Bannister Communications about a practical setup for your Maryborough home or business.</p>
            <div class="cta-buttons">
              <a href="/contact.html" class="btn btn-primary">Request a Quote</a>
              <a href="${site.phoneHref}" class="btn btn-secondary">Call ${site.phone}</a>
            </div>
          </div>
        </div>
      </article>`,
  });
}

function writeBlog(posts) {
  ensureDir(path.join(outDir, "blog"));
  const indexHtml = renderBlogIndex(posts);
  fs.writeFileSync(path.join(outDir, "blog", "index.html"), indexHtml);
  fs.writeFileSync(path.join(outDir, "blog.html"), indexHtml);

  for (const post of posts) {
    const html = renderPost(post);
    const postDir = path.join(outDir, "blog", post.slug);
    ensureDir(postDir);
    fs.writeFileSync(path.join(postDir, "index.html"), html);
    fs.writeFileSync(path.join(outDir, "blog", `${post.slug}.html`), html);
  }
}

function writeSitemap(posts) {
  const now = new Date().toISOString().slice(0, 10);
  const basePages = [
    ["/", "1.0"],
    ["/services.html", "0.9"],
    ["/contact.html", "0.9"],
    ["/about.html", "0.7"],
    ["/blog/", "0.7"],
  ];
  const urls = [
    ...basePages.map(([url, priority]) => ({ loc: `${site.url}${url}`, lastmod: now, changefreq: "monthly", priority })),
    ...posts.map((post) => ({
      loc: `${site.url}/blog/${post.slug}/`,
      lastmod: isoDate(post.date),
      changefreq: "monthly",
      priority: "0.6",
    })),
  ];

  fs.writeFileSync(
    path.join(outDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map(
        (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`,
      )
      .join("\n")}\n</urlset>\n`,
  );
}

function writeFeed(posts) {
  const updated = posts[0]?.date ? new Date(posts[0].date).toISOString() : new Date().toISOString();
  const entries = posts
    .map(
      (post) => `  <entry>
    <title>${escapeHtml(post.title)}</title>
    <link href="${site.url}/blog/${post.slug}/"/>
    <id>${site.url}/blog/${post.slug}/</id>
    <updated>${new Date(isoDate(post.date)).toISOString()}</updated>
    <summary>${escapeHtml(post.description || "")}</summary>
  </entry>`,
    )
    .join("\n");

  fs.writeFileSync(
    path.join(outDir, "blog", "feed.xml"),
    `<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">\n  <title>${site.name} Blog</title>\n  <link href="${site.url}/blog/"/>\n  <updated>${updated}</updated>\n  <id>${site.url}/blog/</id>\n${entries}\n</feed>\n`,
  );
}

function configureAdmin() {
  const adminPath = path.join(outDir, "admin", "index.html");
  if (!fs.existsSync(adminPath)) return;
  const apiBase = process.env.ANCHOR_CMS_API_BASE || "";
  let html = fs.readFileSync(adminPath, "utf8");
  html = html
    .replace(/Anchor Blog Console/g, "Bannister Blog Console")
    .replace(/Anchor Web Co content manager/g, "Bannister Communications content manager")
    .replace(/const STORAGE_KEY = "anchor-blog-console-posts";/, 'const STORAGE_KEY = "bannister-blog-console-posts";')
    .replace(/const SESSION_KEY = "anchor-blog-console-session";/, 'const SESSION_KEY = "bannister-blog-console-session";')
    .replace(/const SITE_ID = "anchor-web-co";/, 'const SITE_ID = "bannister-communications";')
    .replace(/anchorwebco\.com\.au\/blog\//g, "bannistercommunications.com/blog/")
    .replace(/\/img\/og-image\.webp/g, "/assets/images/new_logo.PNG")
    .replace(
      'window.ANCHOR_CMS_API_BASE = window.ANCHOR_CMS_API_BASE || "";',
      `window.ANCHOR_CMS_API_BASE = ${JSON.stringify(apiBase)};`,
    )
    .replace(/--accent: #007a7a;/g, "--accent: #C1272D;")
    .replace(/--accent-strong: #005f5f;/g, "--accent-strong: #a01f24;")
    .replace(/--accent-soft: #e1f5f3;/g, "--accent-soft: #fde8ea;");
  fs.writeFileSync(adminPath, html);
  fs.writeFileSync(
    path.join(outDir, "admin.html"),
    `<!DOCTYPE html><html lang="en-AU"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=/admin/"><title>Blog Console</title></head><body><p><a href="/admin/">Open Blog Console</a></p></body></html>\n`,
  );
}

function main() {
  fs.rmSync(outDir, { recursive: true, force: true });
  ensureDir(outDir);

  for (const entry of fs.readdirSync(root)) {
    copyStatic(path.join(root, entry), path.join(outDir, entry));
  }

  const posts = readPosts();
  writeBlog(posts);
  writeSitemap(posts);
  writeFeed(posts);
  configureAdmin();
  console.log(`Built Bannister site with ${posts.length} published CMS posts.`);
}

main();
