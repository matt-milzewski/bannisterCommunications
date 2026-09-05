const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "_site");
const dataPath = path.join(root, "data", "cmsBlogPosts.json");
const site = {
  name: "Bannister Communications",
  url: "https://www.bannistercommunications.com",
  description:
    "Maryborough-based security and communications installation for Wide Bay and Gympie, with project coverage across regional Queensland.",
  defaultImage: "/assets/images/bannister-logo.webp",
  phone: "0416 945 872",
  phoneHref: "tel:+61416945872",
  email: "support@bannistercommunications.com",
};

const copyExcludes = new Set([
  ".git",
  ".github",
  "_site",
  "data",
  "docs",
  "node_modules",
  "scripts",
]);

const fileExcludes = new Set([
  "package.json",
  "package-lock.json",
  "server.log",
  "test.html",
  "new_logo.PNG",
  "Craig.png",
  "active_deterrence_system.jpg",
  "gate_keeper.jpg",
  "Home_Safety_connected.jpg",
]);

const servicePages = [
  {
    slug: "cctv-installation.html",
    title: "CCTV Installation Wide Bay",
    description:
      "Professional CCTV installation for Wide Bay and Gympie homes, businesses and rural properties, with smart detection, remote viewing and local support.",
    name: "CCTV and Security Camera Installation",
    eyebrow: "CCTV designed around your property",
    heading: "CCTV Installation Across Wide Bay & Gympie",
    intro:
      "Bannister Communications designs and installs CCTV systems for homes, shops, offices, sheds, farms and worksites across Maryborough, Hervey Bay, Bundaberg and Gympie. Every system is planned around the property, the areas that matter and how you want to review footage.",
    image: "/assets/images/HLIK-4286TH2-AI-KITPIC-SQ-500x500.webp",
    imageAlt: "HiLook CCTV camera and recorder system installed by Bannister Communications",
    benefits: [
      ["Clear evidence", "High-resolution cameras, night vision and correctly planned viewing angles help capture usable footage rather than simply adding more cameras."],
      ["Smarter alerts", "Human and vehicle detection can reduce unnecessary notifications while keeping you informed about activity around the property."],
      ["Simple remote viewing", "We configure phone access, recording and playback, then show you how to use the system before the job is complete."],
    ],
    included: [
      "On-site assessment of entry points, access routes and camera positions",
      "HiLook and Hikvision-compatible CCTV options selected for the site",
      "NVR recording, app access and notification setup",
      "Night-view, playback and network testing",
      "Tidy installation and practical system handover",
      "Maintenance, upgrades and fault diagnosis for existing systems",
    ],
    questions: [
      ["How many security cameras does my property need?", "It depends on entrances, blind spots, lighting and the evidence you need to capture. We assess the property first and recommend coverage rather than a fixed camera count."],
      ["Can I view my CCTV from my phone?", "Yes. Compatible systems can provide live viewing, playback and alerts through a phone app. We configure access and explain the controls during handover."],
      ["Do you install CCTV on rural properties?", "Yes. We can assess sheds, gates, driveways and remote areas, including solar or wireless options where conventional cabling is impractical."],
      ["Can you upgrade an existing camera system?", "Often, yes. We can inspect the recorder, cameras, cabling and network before recommending repair, expansion or replacement."],
    ],
  },
  {
    slug: "alarm-systems.html",
    title: "Alarm Installation Wide Bay",
    description:
      "Alarm system installation for Wide Bay and Gympie homes and businesses, including wireless sensors, smartphone control and CCTV integration.",
    name: "Alarm System Installation",
    eyebrow: "Detection that fits the way you use the property",
    heading: "Alarm Systems for Wide Bay Homes & Businesses",
    intro:
      "Bannister Communications installs practical alarm systems across Maryborough, Hervey Bay, Bundaberg and Gympie. We match sensors, sirens and controls to the building so the system is straightforward to arm, manage and live with every day.",
    image: "/assets/images/dual_communication.jpg",
    imageAlt: "PSA Centrii wireless alarm system with dual communication",
    benefits: [
      ["Flexible protection", "Door, window and motion sensors can be positioned around the real access points and risk areas of your home or business."],
      ["Useful notifications", "Compatible systems can provide smartphone control and alerts without turning the alarm into another complicated piece of technology."],
      ["Layered security", "Alarms can work alongside CCTV, active deterrence cameras, intercoms and access control for a more complete system."],
    ],
    included: [
      "Property assessment and sensor planning",
      "Wireless alarm options for difficult-to-cable buildings",
      "Door, window and movement detection",
      "Sirens, keypads and compatible phone controls",
      "Integration options with cameras and active deterrence",
      "Testing, user setup and clear handover",
    ],
    questions: [
      ["Are wireless alarm systems reliable?", "A professionally planned wireless system can be a strong option for existing homes and buildings where new cabling would be disruptive. We assess signal conditions and sensor placement before installation."],
      ["Can an alarm send alerts to my phone?", "Compatible systems can send notifications and allow remote control through a smartphone. Available features depend on the equipment and communication setup selected."],
      ["Can an alarm work with CCTV?", "Yes. Cameras, alarms and active deterrence can be designed as complementary layers so you can detect activity and then review what happened."],
      ["Do you install alarms for commercial properties?", "Yes. We work with homes, shops, offices, sheds and other commercial or rural sites throughout our service area."],
    ],
  },
  {
    slug: "starlink-wireless.html",
    title: "Starlink Installer Wide Bay",
    description:
      "Starlink setup and point-to-point wireless links across Wide Bay and Gympie for homes, farms, sheds and businesses needing dependable connectivity.",
    name: "Starlink and Point-to-Point Wireless Installation",
    eyebrow: "Connectivity beyond the main building",
    heading: "Starlink & Wireless Links for Regional Properties",
    intro:
      "Bannister Communications helps regional homes, farms and businesses position and connect Starlink equipment and extend networks between buildings. We assess obstructions, mounting, cable routes, power and line of sight before recommending a practical setup.",
    image: "/assets/images/Cabling.jpeg",
    imageAlt: "Neatly installed communications and network cabling",
    benefits: [
      ["Better placement", "A clear view of the sky, secure mounting and a sensible cable route are considered before Starlink equipment is installed."],
      ["Building-to-building links", "Point-to-point wireless links can connect a house, shed, office, gate or workshop without trenching a data cable across the whole property."],
      ["One connected system", "We can plan the link alongside Wi-Fi, data cabling, cameras and other networked equipment so each part works together."],
    ],
    included: [
      "Site and obstruction assessment",
      "Starlink dish position and mounting advice",
      "Cable routing and equipment connection",
      "Point-to-point wireless link planning",
      "Line-of-sight, network and performance testing",
      "Connection of sheds, offices, gates and remote camera locations",
    ],
    questions: [
      ["Where should a Starlink dish be installed?", "It needs a clear view of the sky and a secure position with a workable cable path. We assess the property rather than assuming the roof is automatically the best location."],
      ["Can you connect internet from my house to a shed?", "Often, yes. A point-to-point wireless link can bridge two buildings when there is suitable line of sight, power and mounting at both ends."],
      ["Does a wireless link replace Wi-Fi inside the building?", "The link carries the network between locations. Each building may still need an access point or wired network to provide useful coverage inside and around it."],
      ["Do you supply Starlink internet plans?", "No. Starlink service and account arrangements remain with Starlink. Bannister Communications assists with the physical setup, positioning, cabling and local network connection."],
    ],
  },
  {
    slug: "data-cabling-antennas.html",
    title: "Data Cabling & TV Antennas",
    description:
      "Data cabling, network points and TV antenna installation across Maryborough, Wide Bay and Gympie with tidy cable routes and tested connections.",
    name: "Data Cabling and TV Antenna Installation",
    eyebrow: "Reliable connections, neatly installed",
    heading: "Data Cabling & TV Antenna Installation",
    intro:
      "Bannister Communications installs and troubleshoots data cabling, network points and TV antenna systems across Maryborough, Hervey Bay, Bundaberg and Gympie. We diagnose the connection first, plan a tidy route and test the result before handover.",
    image: "/assets/images/Cat6StockImage.jpeg",
    imageAlt: "Cat 6 data cabling used for home and business networks",
    benefits: [
      ["Dependable wired networks", "Cat 6 cabling and correctly positioned network points provide a stable foundation for offices, cameras, access points and connected equipment."],
      ["Clearer TV reception", "Antenna alignment, outlets, cabling and signal conditions are assessed so the real cause of reception problems can be addressed."],
      ["Tidy practical work", "Cable routes and equipment positions are planned around how the building is used, with connections tested before completion."],
    ],
    included: [
      "Cat 6 data cabling and network points",
      "Cabling for cameras, access points and communications equipment",
      "TV antenna installation, alignment and fault finding",
      "Additional TV outlets and cable replacement",
      "Home, commercial and rural network improvements",
      "Testing and clear labelling where appropriate",
    ],
    questions: [
      ["Is wired data cabling better than Wi-Fi?", "They solve different problems. Wired connections provide a stable backbone for fixed equipment, while Wi-Fi provides mobility. Many good networks use both."],
      ["Can you add a network point for a camera or access point?", "Yes. We can assess the cable route and connection requirements for cameras, wireless access points and other network equipment."],
      ["Why is my TV picture pixelating?", "Possible causes include antenna alignment, damaged cabling, weak or excessive signal levels, poor connections or local interference. Testing helps identify the actual fault."],
      ["Do you work on rural properties?", "Yes. We service rural and semi-rural properties and can combine cabling with wireless links where buildings are spread across the site."],
    ],
  },
];

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
          <a href="/"><img src="/assets/images/bannister-logo.webp" alt="Bannister Communications logo"></a>
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
            <img src="/assets/images/bannister-logo.webp" alt="Bannister Communications">
            <p>Proudly installing PSA Centrii & HiLook systems</p>
          </div>
          <div class="footer-links">
            <h3>Popular Services</h3>
            <ul>
              <li><a href="/cctv-installation.html">CCTV Installation</a></li>
              <li><a href="/alarm-systems.html">Alarm Systems</a></li>
              <li><a href="/starlink-wireless.html">Starlink &amp; Wireless</a></li>
              <li><a href="/data-cabling-antennas.html">Data &amp; Antennas</a></li>
              <li><a href="/maryborough.html">Maryborough</a></li>
            </ul>
          </div>
          <div class="footer-contact">
            <h3>Contact Info</h3>
            <p>Based in Maryborough • servicing Wide Bay, Gympie &amp; regional QLD</p>
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
  <link rel="icon" type="image/webp" href="/assets/images/bannister-logo.webp">
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
  <link rel="stylesheet" href="/assets/css/style.css?v=6">
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

function breadcrumbSchema(items) {
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

function serviceSchema(page) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${site.url}/${page.slug}#service`,
        name: page.name,
        url: `${site.url}/${page.slug}`,
        description: page.description,
        serviceType: page.name,
        areaServed: [
          { "@type": "AdministrativeArea", name: "Wide Bay-Burnett, Queensland" },
          { "@type": "City", name: "Maryborough, Queensland" },
          { "@type": "City", name: "Hervey Bay, Queensland" },
          { "@type": "City", name: "Bundaberg, Queensland" },
          { "@type": "City", name: "Gympie, Queensland" },
        ],
        provider: {
          "@type": "ProfessionalService",
          "@id": `${site.url}/#business`,
          name: site.name,
          telephone: "+61416945872",
          url: site.url,
        },
      },
      breadcrumbSchema([
        ["Home", "/"],
        ["Services", "/services.html"],
        [page.name, `/${page.slug}`],
      ]),
    ],
  };
}

function relatedServiceLinks(currentSlug) {
  return servicePages
    .filter((page) => page.slug !== currentSlug)
    .map(
      (page) => `
        <a class="related-service-card" href="/${page.slug}">
          <span>${escapeHtml(page.name)}</span>
          <small>Explore service</small>
        </a>`,
    )
    .join("");
}

function renderServicePage(page) {
  const benefitCards = page.benefits
    .map(
      ([title, copy]) => `
        <article class="detail-card">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(copy)}</p>
        </article>`,
    )
    .join("");
  const included = page.included.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const questions = page.questions
    .map(
      ([question, answer]) => `
        <article class="faq-item">
          <h3>${escapeHtml(question)}</h3>
          <p>${escapeHtml(answer)}</p>
        </article>`,
    )
    .join("");
  const schema = serviceSchema(page);

  return layout({
    title: page.title,
    description: page.description,
    canonical: `${site.url}/${page.slug}`,
    image: page.image,
    current: "services",
    schema: `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
    body: `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <div class="container"><a href="/">Home</a> / <a href="/services.html">Services</a> / <span>${escapeHtml(page.name)}</span></div>
      </nav>
      <section class="page-hero service-detail-hero">
        <div class="container">
          <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
          <h1>${escapeHtml(page.heading)}</h1>
          <p class="hero-subtitle">Based in Maryborough and serving Wide Bay and Gympie, with larger regional projects available by arrangement.</p>
          <div class="cta-buttons">
            <a href="/contact.html" class="btn btn-primary">Request a Quote</a>
            <a href="${site.phoneHref}" class="btn btn-secondary">Call ${site.phone}</a>
          </div>
        </div>
      </section>
      <section class="detail-intro">
        <div class="container detail-intro__grid">
          <div>
            <p class="detail-lead">${escapeHtml(page.intro)}</p>
            <p>With more than 25 years of telecommunications and security experience, Bannister Communications focuses on suitable equipment, tidy workmanship and a handover you can understand.</p>
          </div>
          <figure class="detail-figure">
            <img src="${page.image}" alt="${escapeHtml(page.imageAlt)}" width="640" height="420" loading="eager" fetchpriority="high">
          </figure>
        </div>
      </section>
      <section class="detail-benefits">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Practical outcomes</p>
            <h2>A System Designed to Work in the Real World</h2>
          </div>
          <div class="detail-card-grid">${benefitCards}</div>
        </div>
      </section>
      <section class="detail-scope">
        <div class="container detail-scope__grid">
          <div>
            <p class="eyebrow">What we can help with</p>
            <h2>Planning, Installation & Handover</h2>
            <ul class="detail-checklist">${included}</ul>
          </div>
          <aside class="local-proof-card">
            <p class="local-proof-card__label">Local confidence</p>
            <h2>Wide Bay & Gympie Based</h2>
            <p>Bannister Communications is based in Maryborough and regularly services the Fraser Coast, Bundaberg and Gympie regions.</p>
            <ul>
              <li>Security Licence #4429602</li>
              <li>Hikvision Authorized Silver Partner 2026</li>
              <li>Residential, commercial and rural work</li>
              <li>Central and North Queensland projects by arrangement</li>
            </ul>
            <a href="/maryborough.html">View our Maryborough service area</a>
          </aside>
        </div>
      </section>
      <section class="faq-section detail-faq">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Common questions</p>
            <h2>What to Know Before Requesting a Quote</h2>
          </div>
          <div class="faq-grid">${questions}</div>
        </div>
      </section>
      <section class="related-services">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Related services</p>
            <h2>Build the Right Combination for Your Property</h2>
          </div>
          <div class="related-service-grid">${relatedServiceLinks(page.slug)}</div>
        </div>
      </section>
      <section class="cta-section">
        <div class="container">
          <h2>Talk to a Local Installer</h2>
          <p>Tell us about the property, location and result you need. We’ll help you work out the practical next step.</p>
          <div class="cta-buttons">
            <a href="/contact.html" class="btn btn-primary">Request a Quote</a>
            <a href="${site.phoneHref}" class="btn btn-secondary">Call ${site.phone}</a>
          </div>
        </div>
      </section>`,
  });
}

function renderMaryboroughPage() {
  const pageUrl = `${site.url}/maryborough.html`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: "Security and Communications Installation in Maryborough",
        url: pageUrl,
        description:
          "Maryborough-based CCTV, alarm, Starlink, wireless link, antenna and data cabling installation for local homes, businesses and rural properties.",
        areaServed: { "@type": "City", name: "Maryborough, Queensland" },
        provider: {
          "@type": "ProfessionalService",
          "@id": `${site.url}/#business`,
          name: site.name,
          telephone: "+61416945872",
          url: site.url,
        },
      },
      breadcrumbSchema([
        ["Home", "/"],
        ["Maryborough services", "/maryborough.html"],
      ]),
    ],
  };

  return layout({
    title: "CCTV & Security Maryborough",
    description:
      "Maryborough-based CCTV, alarm, Starlink, wireless, antenna and data cabling installation for local homes, businesses and rural properties.",
    canonical: pageUrl,
    image: "/assets/images/home-safety-connected.webp",
    current: "services",
    schema: `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
    body: `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <div class="container"><a href="/">Home</a> / <span>Maryborough services</span></div>
      </nav>
      <section class="page-hero service-detail-hero">
        <div class="container">
          <p class="eyebrow">Our home service area</p>
          <h1>CCTV, Security &amp; Communications in Maryborough</h1>
          <p class="hero-subtitle">A Maryborough-based installer for local homes, businesses, sheds, farms and worksites.</p>
          <div class="cta-buttons">
            <a href="/contact.html" class="btn btn-primary">Request a Maryborough Quote</a>
            <a href="${site.phoneHref}" class="btn btn-secondary">Call ${site.phone}</a>
          </div>
        </div>
      </section>
      <section class="detail-intro">
        <div class="container detail-intro__grid">
          <div>
            <p class="detail-lead">Bannister Communications is based in Maryborough and provides local installation and support throughout the city and surrounding Fraser Coast communities.</p>
            <p>We design practical CCTV, alarm and communications systems around the property rather than forcing every customer into the same package. That includes clear advice, tidy installation, system testing and a straightforward handover.</p>
          </div>
          <figure class="detail-figure">
            <img src="/assets/images/home-safety-connected.webp" alt="PSA Centrii home security equipment available from Bannister Communications in Maryborough" width="600" height="400" loading="eager" fetchpriority="high">
          </figure>
        </div>
      </section>
      <section class="detail-benefits">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Maryborough services</p>
            <h2>Security, Connectivity & Cabling from One Local Team</h2>
          </div>
          <div class="detail-card-grid detail-card-grid--services">
            ${servicePages
              .map(
                (page) => `
                  <article class="detail-card">
                    <h3>${escapeHtml(page.name)}</h3>
                    <p>${escapeHtml(page.description)}</p>
                    <a href="/${page.slug}">Explore ${escapeHtml(page.name.toLowerCase())}</a>
                  </article>`,
              )
              .join("")}
          </div>
        </div>
      </section>
      <section class="detail-scope">
        <div class="container detail-scope__grid">
          <div>
            <p class="eyebrow">Local coverage</p>
            <h2>Maryborough & Nearby Communities</h2>
            <p>Contact us to confirm availability for your address. Our regular local coverage includes:</p>
            <ul class="location-list">
              <li>Maryborough</li><li>Maryborough West</li><li>Granville</li><li>Tinana</li>
              <li>Oakhurst</li><li>St Helens</li><li>Walkers Point</li><li>Fraser Coast rural properties</li>
            </ul>
          </div>
          <aside class="local-proof-card">
            <p class="local-proof-card__label">Why local matters</p>
            <h2>Support After Installation</h2>
            <p>You get a nearby business that understands regional properties and remains available for questions, maintenance and future additions.</p>
            <ul>
              <li>More than 25 years of industry experience</li>
              <li>Security Licence #4429602</li>
              <li>Hikvision Authorized Silver Partner 2026</li>
              <li>Residential, commercial and rural installations</li>
            </ul>
          </aside>
        </div>
      </section>
      <section class="faq-section detail-faq">
        <div class="container">
          <div class="section-heading"><p class="eyebrow">Local questions</p><h2>Planning a Maryborough Installation</h2></div>
          <div class="faq-grid">
            <article class="faq-item"><h3>What properties do you service in Maryborough?</h3><p>We work with homes, shops, offices, workshops, sheds, farms and other residential, commercial and rural properties.</p></article>
            <article class="faq-item"><h3>Can you inspect an existing security system?</h3><p>Yes. We can assess existing cameras, alarms, cabling and network equipment before recommending maintenance, expansion or replacement.</p></article>
            <article class="faq-item"><h3>Do you service areas outside Maryborough?</h3><p>Yes. Wide Bay and Gympie are our core service region, with suitable Central and North Queensland projects available by arrangement.</p></article>
            <article class="faq-item"><h3>How do I request a quote?</h3><p>Send the property location, service required and a short description through our quote form, or call 0416 945 872 to discuss the job.</p></article>
          </div>
        </div>
      </section>
      <section class="cta-section">
        <div class="container">
          <h2>Request a Maryborough Quote</h2>
          <p>Tell us what you want to protect or connect and we’ll recommend a practical next step.</p>
          <div class="cta-buttons">
            <a href="/contact.html" class="btn btn-primary">Request a Quote</a>
            <a href="${site.phoneHref}" class="btn btn-secondary">Call ${site.phone}</a>
          </div>
        </div>
      </section>`,
  });
}

function writeSeoPages() {
  fs.writeFileSync(path.join(outDir, "maryborough.html"), renderMaryboroughPage());
  for (const page of servicePages) {
    fs.writeFileSync(path.join(outDir, page.slug), renderServicePage(page));
  }
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
        url: `${site.url}/assets/images/bannister-logo.webp`,
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
    ["/maryborough.html", "0.9"],
    ["/hervey-bay.html", "0.8"],
    ["/gympie.html", "0.8"],
    ["/cctv-installation.html", "0.9"],
    ["/alarm-systems.html", "0.8"],
    ["/starlink-wireless.html", "0.8"],
    ["/data-cabling-antennas.html", "0.8"],
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
    .replace(/\/img\/og-image\.webp/g, "/assets/images/bannister-logo.webp")
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

  writeSeoPages();
  const posts = readPosts();
  writeBlog(posts);
  writeSitemap(posts);
  writeFeed(posts);
  configureAdmin();
  console.log(`Built Bannister site with ${posts.length} published CMS posts.`);
}

main();
