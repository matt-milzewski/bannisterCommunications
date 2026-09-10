/**
 * Shared site chrome: nav, footer, LocalBusiness schema, trust strip, and the
 * project / review card components. Used by scripts/build-site.js for the
 * generated pages and injected into the hand-written static pages during the
 * build so there is one definition of each on every page.
 */
const fs = require("node:fs");
const path = require("node:path");
const yaml = require("js-yaml");

const root = path.resolve(__dirname, "..");
const contentDir = path.join(root, "content");

const site = {
  name: "Bannister Communications",
  url: "https://www.bannistercommunications.com",
  description:
    "Maryborough-based security and communications installation for the Fraser Coast, Wide Bay and Gympie.",
  defaultImage: "/assets/images/bannister-logo.webp",
  phone: "0416 945 872",
  phoneHref: "tel:+61416945872",
  phoneE164: "+61416945872",
  email: "support@bannistercommunications.com",
  facebook: "https://www.facebook.com/bcommunicarions",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Bannister+Communications+Maryborough+QLD",
  licence: "4429602",
  abn: "32861916822",
  cssVersion: "7",
  jsVersion: "6",
};

// Every asset served can be busted together off these two numbers.
site.css = `/assets/css/style.css?v=${site.cssVersion}`;
site.js = `/assets/js/main.js?v=${site.jsVersion}`;

const towns = [
  { slug: "maryborough.html", name: "Maryborough" },
  { slug: "hervey-bay.html", name: "Hervey Bay" },
  { slug: "gympie.html", name: "Gympie" },
];

const serviceNav = [
  { slug: "cctv-installation.html", label: "CCTV Installation" },
  { slug: "alarm-systems.html", label: "Alarm Systems" },
  { slug: "starlink-wireless.html", label: "Starlink & Wireless" },
  { slug: "data-cabling-antennas.html", label: "Data Cabling & Antennas" },
];

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ------------------------------------------------------------------ nav */

function navHtml(current = "") {
  const isCurrent = (key) => (current === key ? ' aria-current="page" class="current"' : "");
  const serviceLinks = serviceNav
    .map((s) => `<li><a href="/${s.slug}"${isCurrent(s.slug)}>${s.label}</a></li>`)
    .join("");
  const townLinks = towns
    .map((t) => `<li><a href="/${t.slug}"${isCurrent(t.slug)}>${t.name}</a></li>`)
    .join("");

  return `
    <header class="header">
      <div class="header-content">
        <a class="logo" href="/" aria-label="Bannister Communications home">
          <img src="/assets/images/bannister-logo.webp" alt="Bannister Communications CCTV and security" width="200" height="100">
        </a>
        <nav class="nav" id="nav" aria-label="Primary">
          <ul>
            <li><a href="/"${isCurrent("home")}>Home</a></li>
            <li><a href="/about.html"${isCurrent("about")}>About</a></li>
            <li class="has-submenu">
              <a href="/services.html"${isCurrent("services")}>Services</a>
              <ul class="submenu">
                <li><a href="/services.html">All services</a></li>
                ${serviceLinks}
              </ul>
            </li>
            <li class="has-submenu">
              <a href="/services.html#locations">Locations</a>
              <ul class="submenu">
                ${townLinks}
              </ul>
            </li>
            <li><a href="/blog/"${isCurrent("blog")}>Blog</a></li>
            <li><a href="/contact.html"${isCurrent("contact")}>Contact</a></li>
          </ul>
        </nav>
        <button class="menu-toggle" id="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button>
      </div>
    </header>`;
}

/* --------------------------------------------------------------- footer */

function footerHtml() {
  const year = new Date().getFullYear();
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <img src="/assets/images/bannister-logo.webp" alt="Bannister Communications" width="220" height="112">
            <p>Authorised Hikvision Australia Silver Value Added Solution Partner. Installing PSA Centrii &amp; HiLook.</p>
          </div>
          <div class="footer-links">
            <h3>Services</h3>
            <ul>
              ${serviceNav.map((s) => `<li><a href="/${s.slug}">${s.label}</a></li>`).join("\n              ")}
              <li><a href="/services.html">All services</a></li>
            </ul>
          </div>
          <div class="footer-links">
            <h3>Service areas</h3>
            <ul>
              ${towns.map((t) => `<li><a href="/${t.slug}">${t.name} security</a></li>`).join("\n              ")}
              <li><a href="/about.html">About Bannister Communications</a></li>
            </ul>
          </div>
          <div class="footer-contact">
            <h3>Contact</h3>
            <p>Based in Maryborough, serving the Fraser Coast, Wide Bay &amp; Gympie</p>
            <p>Phone: <a href="${site.phoneHref}">${site.phone}</a></p>
            <p>Email: <a href="mailto:${site.email}">${site.email}</a></p>
            <p class="footer-social">
              <a href="${site.facebook}" target="_blank" rel="noopener">Facebook</a>
              <a href="${site.mapsUrl}" target="_blank" rel="noopener">Find us on Google</a>
            </p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${year} Bannister Communications. Security Licence #${site.licence} | ABN: ${site.abn}</p>
          <p>Website built by <a href="https://anchorwebco.com.au" target="_blank" rel="noopener">Anchor Web Co.</a></p>
        </div>
      </div>
    </footer>
    <div class="mobile-cta-bar">
      <a href="${site.phoneHref}" class="mobile-cta-call">Call Now</a>
      <a href="/contact.html" class="mobile-cta-quote">Get Quote</a>
    </div>`;
}

/* ---------------------------------------------------------- trust strip */

function trustStripHtml() {
  return `
    <div class="trust-strip" aria-label="Credentials">
      <div class="container trust-strip__inner">
        <img src="/assets/images/hikvision-authorized-silver-partner-2026-badge.webp"
             alt="Hikvision Australia Silver Value Added Solution Partner 2026"
             width="72" height="62" loading="lazy" decoding="async">
        <ul>
          <li><strong>Hikvision Silver Partner</strong><span>Authorised Australia VAS partner</span></li>
          <li><strong>PSA Centrii installer</strong><span>Plus HiLook &amp; Hikvision</span></li>
          <li><strong>25+ years experience</strong><span>Telecommunications &amp; security</span></li>
          <li><strong>Licensed &amp; insured</strong><span>Security Licence #${site.licence}</span></li>
        </ul>
      </div>
    </div>`;
}

/* -------------------------------------------------------------- schema */

function localBusinessLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${site.url}/#business`,
    name: site.name,
    image: [
      `${site.url}/assets/images/bannister-logo.webp`,
      `${site.url}/assets/images/bannister-communications-hikvision-silver-partner-2026.webp`,
    ],
    logo: `${site.url}/assets/images/bannister-logo.webp`,
    url: `${site.url}/`,
    telephone: site.phoneE164,
    email: site.email,
    priceRange: "$$",
    founder: { "@type": "Person", name: "Craig Bannister" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Maryborough",
      addressRegion: "QLD",
      postalCode: "4650",
      addressCountry: "AU",
    },
    areaServed: [
      { "@type": "City", name: "Maryborough, Queensland" },
      { "@type": "City", name: "Hervey Bay, Queensland" },
      { "@type": "City", name: "Gympie, Queensland" },
      { "@type": "AdministrativeArea", name: "Fraser Coast, Queensland" },
      { "@type": "AdministrativeArea", name: "Wide Bay–Burnett, Queensland" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [site.facebook],
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function breadcrumbLd(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, url], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: `${site.url}${url}`,
    })),
  };
}

function faqLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

/* ------------------------------------------------- content data files */

function loadYaml(name) {
  const file = path.join(contentDir, name);
  if (!fs.existsSync(file)) return [];
  const parsed = yaml.load(fs.readFileSync(file, "utf8"));
  return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
}

function loadProjects() {
  return loadYaml("projects.yml");
}

function loadReviews() {
  return loadYaml("reviews.yml");
}

function projectsForTown(projects, townName) {
  return projects.filter((p) => (p.town || "").toLowerCase() === townName.toLowerCase());
}

function projectsForService(projects, keywords) {
  const list = Array.isArray(keywords) ? keywords : [keywords];
  return projects.filter((p) => {
    const haystack = `${p.installed || ""} ${p.problem || ""} ${p.outcome || ""}`.toLowerCase();
    return list.some((k) => haystack.includes(k.toLowerCase()));
  });
}

/**
 * Project cards. Renders nothing (empty string) when there are no entries so a
 * bare heading never ships. Every field is optional.
 */
function renderProjectSection({ projects, heading, intro }) {
  if (!projects || !projects.length) return "";
  const cards = projects
    .map((p) => {
      const photo = Array.isArray(p.photos) && p.photos.length ? p.photos[0] : "";
      const figure = photo
        ? `<img src="${escapeHtml(photo)}" alt="${escapeHtml(
            `${p.installed || "Security installation"} in ${p.suburb || p.town || "the local area"}`,
          )}" loading="lazy" width="480" height="320">`
        : "";
      const quote =
        p.customer_words && String(p.customer_words).trim()
          ? `<blockquote>&ldquo;${escapeHtml(p.customer_words)}&rdquo;${
              p.customer_first_name ? ` <cite>&mdash; ${escapeHtml(p.customer_first_name)}</cite>` : ""
            }</blockquote>`
          : "";
      const meta = [p.suburb, p.property_type].filter(Boolean).map(escapeHtml).join(" &middot; ");
      return `
        <article class="project-card">
          ${figure}
          <div class="project-card__body">
            ${meta ? `<p class="project-card__meta">${meta}</p>` : ""}
            ${p.problem ? `<p><strong>The problem:</strong> ${escapeHtml(p.problem)}</p>` : ""}
            ${p.installed ? `<p><strong>Installed:</strong> ${escapeHtml(p.installed)}</p>` : ""}
            ${p.outcome ? `<p><strong>Outcome:</strong> ${escapeHtml(p.outcome)}</p>` : ""}
            ${quote}
          </div>
        </article>`;
    })
    .join("");
  return `
      <section class="project-section">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Recent work</p>
            <h2>${escapeHtml(heading)}</h2>
            ${intro ? `<p>${escapeHtml(intro)}</p>` : ""}
          </div>
          <div class="project-grid">${cards}</div>
        </div>
      </section>`;
}

/**
 * Review cards. Google's guidelines forbid marking up reviews sourced from
 * Google, so these are visible content only — no Review / aggregateRating JSON-LD.
 * Renders nothing with zero entries.
 */
function renderReviewSection({ reviews, heading = "What customers say" }) {
  if (!reviews || !reviews.length) return "";
  const cards = reviews
    .map((r) => {
      const rating = Number(r.rating) || 5;
      const stars = "★".repeat(Math.max(1, Math.min(5, rating)));
      const source = r.source || "Google";
      const link = r.url || site.mapsUrl;
      const when = r.date ? ` <span class="review-source">${escapeHtml(r.date)}</span>` : "";
      return `
        <article class="review-card">
          <div class="review-stars" aria-label="${rating} out of 5 stars">${stars}</div>
          <blockquote>&ldquo;${escapeHtml(r.text || "")}&rdquo;</blockquote>
          <p class="review-author">${escapeHtml(r.name || "Verified customer")}</p>
          <p class="review-source">
            <a href="${escapeHtml(link)}" target="_blank" rel="noopener">Read on ${escapeHtml(source)}</a>${when}
          </p>
        </article>`;
    })
    .join("");
  return `
      <section class="reviews-section">
        <div class="container reviews-wrap">
          <div class="section-heading">
            <p class="eyebrow">Customer feedback</p>
            <h2>${escapeHtml(heading)}</h2>
          </div>
          <div class="reviews-grid">${cards}</div>
        </div>
      </section>`;
}

/* ---------------------------------------------- static page injection */

const STATIC_CURRENT = {
  "index.html": "home",
  "about.html": "about",
  "services.html": "services",
  "contact.html": "contact",
  "404.html": "",
};

const STATIC_BREADCRUMB = {
  "about.html": ["About", "/about.html"],
  "services.html": ["Services", "/services.html"],
  "contact.html": ["Contact", "/contact.html"],
};

/**
 * Swap the hand-written header / footer / business schema in a static page for
 * the shared versions, and bump the asset cache-busting query strings. The page
 * body (titles, meta, copy) is left exactly as authored.
 */
function injectIntoStatic(html, filename) {
  const current = STATIC_CURRENT[filename] ?? "";

  html = html.replace(/\n?[ \t]*<header class="header">[\s\S]*?<\/header>/, navHtml(current));
  html = html.replace(/[ \t]*<!-- TRUST_STRIP -->/, trustStripHtml());
  html = html.replace(
    /\n?[ \t]*<footer class="footer">[\s\S]*?<\/footer>\s*(<!--[^>]*-->\s*)?<div class="mobile-cta-bar">[\s\S]*?<\/div>/,
    footerHtml(),
  );

  // One canonical LocalBusiness block on indexable pages: replace the first
  // ld+json in <head>, or insert one if the page has none. The 404 page is
  // noindex, so it gets the shared chrome but no business schema.
  if (filename !== "404.html") {
    if (/<script type="application\/ld\+json">/.test(html)) {
      html = html.replace(
        /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
        localBusinessLd(),
      );
    } else {
      html = html.replace(/<\/head>/, `  ${localBusinessLd()}\n</head>`);
    }
  }

  const crumb = STATIC_BREADCRUMB[filename];
  if (crumb) {
    const bc = {
      "@context": "https://schema.org",
      ...breadcrumbLd([["Home", "/"], crumb]),
    };
    html = html.replace(
      /<\/head>/,
      `  <script type="application/ld+json">${JSON.stringify(bc)}</script>\n</head>`,
    );
  }

  html = html
    .replace(/assets\/css\/style\.css\?v=\d+/g, `assets/css/style.css?v=${site.cssVersion}`)
    .replace(/assets\/js\/main\.js\?v=\d+/g, `assets/js/main.js?v=${site.jsVersion}`);

  return html;
}

module.exports = {
  site,
  towns,
  serviceNav,
  escapeHtml,
  navHtml,
  footerHtml,
  trustStripHtml,
  localBusinessLd,
  breadcrumbLd,
  faqLd,
  loadProjects,
  loadReviews,
  projectsForTown,
  projectsForService,
  renderProjectSection,
  renderReviewSection,
  injectIntoStatic,
  STATIC_CURRENT,
};
