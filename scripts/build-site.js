const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const {
  site,
  towns,
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
} = require("./partials");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "_site");
const dataPath = path.join(root, "data", "cmsBlogPosts.json");

const copyExcludes = new Set([
  ".git",
  ".github",
  "_site",
  "content",
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
  "CHANGED_URLS.md",
  "TRAFFIC_BASELINE.md",
  "README.md",
]);

/* ============================================================ services */

const servicePages = [
  {
    slug: "cctv-installation.html",
    title: "CCTV Installation Maryborough, Hervey Bay & Gympie",
    description:
      "CCTV installation for Maryborough, Hervey Bay and Gympie homes, businesses and rural properties. Smart detection, phone viewing and local support. Call 0416 945 872.",
    name: "CCTV and Security Camera Installation",
    short: "CCTV Installation",
    keywords: ["cctv", "camera", "nvr", "cameras"],
    eyebrow: "CCTV designed around your property",
    heading: "CCTV Installation Across Maryborough, Hervey Bay & Gympie",
    intro:
      "Bannister Communications designs and installs CCTV systems for homes, shops, offices, sheds, farms and worksites across Maryborough, Hervey Bay and Gympie. Every system is planned around the property, the areas that matter and how you want to review footage.",
    image: "/assets/images/HLIK-4286TH2-AI-KITPIC-SQ-500x500.webp",
    imageAlt: "HiLook CCTV camera and recorder system installed by Bannister Communications",
    h2Benefits: "What a Well-Planned CCTV System Gives You",
    h2Scope: "Planning, Cabling and Handover for Your CCTV Install",
    h2Local: "CCTV Installers for Maryborough, Hervey Bay and Gympie",
    h2Related: "Pair CCTV With Alarms, Access Control and Connectivity",
    h2Cta: "Get a CCTV Quote for Your Property",
    benefits: [
      ["Clear evidence", "High-resolution cameras, night vision and correctly planned viewing angles help capture usable footage rather than simply adding more cameras."],
      ["Smarter alerts", "Human and vehicle detection can reduce unnecessary notifications while keeping you informed about activity around the property."],
      ["Simple remote viewing", "We configure phone access, recording and playback, then show you how to use the system before the job is complete."],
    ],
    included: [
      "On-site assessment of entry points, access routes and camera positions",
      "HiLook, Hikvision and PSA Centrii camera options selected for the site",
      "NVR recording, app access and notification setup",
      "Night-view, playback and network testing",
      "Tidy installation and practical system handover",
      "Maintenance, upgrades and fault diagnosis for existing systems",
    ],
    hikvision: true,
    questions: [
      ["How many security cameras does my property need?", "It depends on entrances, blind spots, lighting and the evidence you need to capture. We assess the property first and recommend coverage rather than selling a fixed camera count."],
      ["Can I view my CCTV from my phone in Maryborough, Hervey Bay or Gympie?", "Yes. Compatible systems provide live viewing, playback and alerts through a phone app on your own device, over wifi or mobile data. We set it up and explain the controls during handover."],
      ["Do you install CCTV on rural properties around Gympie and the Fraser Coast?", "Yes. We assess sheds, gates, driveways and remote areas, including solar or point-to-point wireless options where conventional cabling is impractical."],
      ["Can you upgrade an existing camera system?", "Often, yes. We inspect the recorder, cameras, cabling and network before recommending repair, expansion or replacement, and usually reuse cabling that is still sound."],
    ],
  },
  {
    slug: "alarm-systems.html",
    title: "Alarm Systems Maryborough & Hervey Bay | Bannister",
    description:
      "Alarm system installation for Maryborough, Hervey Bay and Gympie homes and businesses. Wireless sensors, smartphone control and CCTV integration. Call 0416 945 872.",
    name: "Alarm System Installation",
    short: "Alarm Installation",
    keywords: ["alarm", "sensor", "siren", "pir", "keypad"],
    eyebrow: "Detection that fits the way you use the property",
    heading: "Alarm System Installation for Fraser Coast Homes & Businesses",
    intro:
      "Bannister Communications installs practical alarm systems across Maryborough, Hervey Bay and Gympie. We match sensors, sirens and controls to the building so the system is straightforward to arm, manage and live with every day.",
    image: "/assets/images/dual_communication.jpg",
    imageAlt: "PSA Centrii wireless alarm system with dual communication",
    h2Benefits: "What a Properly Fitted Alarm System Does",
    h2Scope: "How a Fraser Coast Alarm Install Works",
    h2Local: "Alarm Installers for Maryborough, Hervey Bay and Gympie",
    h2Related: "Layer Your Alarm With CCTV and Access Control",
    h2Cta: "Get an Alarm System Quote",
    benefits: [
      ["Flexible protection", "Door, window and motion sensors can be positioned around the real access points and risk areas of your home or business."],
      ["Useful notifications", "Compatible systems can provide smartphone control and alerts without turning the alarm into another complicated piece of technology."],
      ["Layered security", "Alarms can work alongside CCTV, active deterrence cameras, intercoms and access control for a more complete system."],
    ],
    included: [
      "Property assessment and sensor planning",
      "Wireless alarm options for difficult-to-cable Queenslanders and older buildings",
      "Door, window and movement detection",
      "Sirens, keypads and compatible phone controls",
      "Integration options with cameras and active deterrence",
      "Testing, user setup and clear handover",
    ],
    questions: [
      ["Are wireless alarm systems reliable in older Maryborough homes?", "A professionally planned wireless system is a strong option for existing homes and heritage buildings where new cabling would be disruptive. We assess signal conditions and sensor placement before installation."],
      ["Can an alarm send alerts to my phone?", "Compatible systems send notifications and allow remote arming and disarming through a smartphone app. Available features depend on the equipment and communication setup selected."],
      ["Can an alarm work with my CCTV cameras?", "Yes. Cameras, alarms and active deterrence can be designed as complementary layers so you can detect activity and then review what happened."],
      ["Do you install alarms for commercial properties on the Fraser Coast?", "Yes. We work with homes, shops, offices, sheds and other commercial or rural sites throughout Maryborough, Hervey Bay and Gympie."],
    ],
  },
  {
    slug: "starlink-wireless.html",
    title: "Starlink Installer Maryborough & Fraser Coast | Bannister",
    description:
      "Starlink setup and point-to-point wireless links for Maryborough, Hervey Bay and Gympie homes, farms and businesses that need dependable connectivity. Call 0416 945 872.",
    name: "Starlink and Point-to-Point Wireless Installation",
    short: "Starlink & Wireless Setup",
    keywords: ["starlink", "wireless", "point-to-point", "link", "dish", "internet"],
    eyebrow: "Connectivity beyond the main building",
    heading: "Starlink & Point-to-Point Wireless for Rural Fraser Coast Properties",
    intro:
      "Bannister Communications helps rural homes, farms and businesses around Maryborough, Hervey Bay and Gympie position and connect Starlink equipment and extend networks between buildings. We assess obstructions, mounting, cable routes, power and line of sight before recommending a practical setup.",
    image: "/assets/images/Cabling.jpeg",
    imageAlt: "Neatly installed communications and network cabling",
    h2Benefits: "Why Placement and Cabling Decide Whether Starlink Works",
    h2Scope: "Setting Up Starlink and Wireless Links on a Rural Block",
    h2Local: "Starlink and Wireless Installers Serving Gympie, Maryborough and Hervey Bay",
    h2Related: "Connect Cameras and Networks to Your New Link",
    h2Cta: "Get a Starlink or Wireless Link Quote",
    benefits: [
      ["Better placement", "A clear view of the sky, secure mounting and a sensible cable route are worked out before Starlink equipment goes up."],
      ["Building-to-building links", "Point-to-point wireless links can connect a house, shed, office, gate or workshop without trenching a data cable across the whole property."],
      ["One connected system", "We plan the link alongside wifi, data cabling, cameras and other networked equipment so each part works together."],
    ],
    included: [
      "Site and obstruction assessment",
      "Starlink dish position and mounting",
      "Weatherproof cable routing and equipment connection",
      "Point-to-point wireless link planning between buildings",
      "Line-of-sight, network and performance testing",
      "Connection of sheds, offices, gates and remote camera locations",
    ],
    questions: [
      ["Where should a Starlink dish be installed?", "It needs a clear view of the sky and a secure position with a workable cable path. We assess the property rather than assuming the roof is automatically the best location."],
      ["Can you connect internet from my Gympie house to a shed or second dwelling?", "Often, yes. A point-to-point wireless link can bridge two buildings when there is suitable line of sight, power and mounting at both ends."],
      ["Does a wireless link replace the wifi inside the building?", "The link carries the network between locations. Each building may still need an access point or wired network to give useful coverage inside and around it."],
      ["Do you supply Starlink internet plans?", "No. Starlink service and account arrangements stay with Starlink. We handle the physical setup, positioning, cabling and local network connection."],
    ],
  },
  {
    slug: "data-cabling-antennas.html",
    title: "Data Cabling & TV Antennas Maryborough | Bannister",
    description:
      "Data cabling, network points and TV antenna installation across Maryborough, Hervey Bay and Gympie. Tidy cable routes and tested connections. Call 0416 945 872.",
    name: "Data Cabling and TV Antenna Installation",
    short: "Cabling & Antenna Work",
    keywords: ["cabling", "cat6", "cat 6", "antenna", "network point", "data point", "tv"],
    eyebrow: "Reliable connections, neatly installed",
    heading: "Data Cabling & TV Antenna Installation in Maryborough",
    intro:
      "Bannister Communications installs and troubleshoots data cabling, network points and TV antenna systems across Maryborough, Hervey Bay and Gympie. We diagnose the connection first, plan a tidy route and test the result before handover.",
    image: "/assets/images/Cat6StockImage.jpeg",
    imageAlt: "Cat 6 data cabling used for home and business networks",
    h2Benefits: "What Tidy, Tested Cabling and Antennas Give You",
    h2Scope: "Planning Cable Routes and Antenna Work in Older Homes",
    h2Local: "Cabling and Antenna Installers for Maryborough, Hervey Bay and Gympie",
    h2Related: "Cabling That Supports Your Cameras and Network",
    h2Cta: "Get a Cabling or Antenna Quote",
    benefits: [
      ["Dependable wired networks", "Cat 6 cabling and correctly positioned network points give offices, cameras, access points and connected equipment a stable foundation."],
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
      ["Is wired data cabling better than wifi?", "They solve different problems. Wired connections give fixed equipment a stable backbone, while wifi gives mobility. Most good networks use both."],
      ["Can you add a network point for a camera or access point?", "Yes. We assess the cable route and connection requirements for cameras, wireless access points and other network equipment."],
      ["Why is my TV picture pixelating in Maryborough or Hervey Bay?", "Possible causes include antenna alignment, damaged cabling, weak or excessive signal levels, poor connections or local interference. Testing identifies the actual fault."],
      ["Do you work on rural properties around Gympie?", "Yes. We service rural and semi-rural properties and can combine cabling with wireless links where buildings are spread across the site."],
    ],
  },
];

/* =============================================================== towns */

const townPages = [
  {
    slug: "maryborough.html",
    name: "Maryborough",
    region: "the Fraser Coast",
    distance: "",
    title: "Security Systems & CCTV Maryborough | Local Installer",
    metaDescription:
      "Maryborough CCTV, alarm, Starlink and cabling installation from a local, licensed installer with 25+ years' experience. Free quotes — call 0416 945 872.",
    h1: "CCTV, Alarms & Security Systems in Maryborough",
    image: "/assets/images/home-safety-connected.webp",
    lead:
      "Maryborough is home for Bannister Communications. Craig Bannister has lived and worked here for more than 25 years, and most weeks the van never leaves the Fraser Coast. We install and maintain CCTV, alarm systems, Starlink and point-to-point wireless, data cabling and TV antennas for Maryborough homes, businesses, sheds and rural blocks — with the short response times and after-install support that only a local installer can give.",
    suburbs: [
      "Maryborough CBD", "Granville", "Tinana", "Maryborough West", "Aldershot", "Oakhurst",
      "Bidwill", "St Helens", "Tiaro", "Howard", "Torbanlea", "Bauple",
    ],
    suburbNote:
      "That covers the city and the surrounding Fraser Coast towns we work in most weeks. If your address is not listed, call — we almost certainly still get there.",
    considerationsHeading: "What to Think About for a Maryborough Installation",
    considerations: [
      ["Heritage homes and older wiring",
        "Maryborough has one of the best-preserved 19th-century streetscapes in Queensland, and a lot of our residential work is in genuine Queenslanders and post-war homes around the CBD, Granville and Tinana. Older homes mean tight roof spaces, brittle wiring, VJ walls you do not want to cut into, and switchboards that predate modern safety switches. We route cameras and sensors with as little disruption to the building fabric as possible, use existing cavities and eaves lines, and flag anything electrical that a licensed electrician should look at before we go further."],
      ["Rural blocks, sheds and second dwellings",
        "Plenty of Maryborough addresses come with acreage, a machinery shed, a granny flat or a pump a long way from the house. Those jobs are about distance and power — getting a reliable connection, and where needed footage, back to the house without trenching hundreds of metres of cable. Point-to-point wireless links, solar cameras and a properly planned network make it work."],
      ["Industrial estate and highway businesses",
        "We look after businesses in the Maryborough industrial area and along the Bruce Highway — yards, workshops, transport depots and retail. Commercial jobs need coverage of gates, loading areas and till points, footage that holds up if it is ever needed for an insurance claim or police, and often access control so you know who opened up."],
    ],
    servicesHeading: "Security & Communications Services in Maryborough",
    wiredWirelessQ: "Wired or wireless cameras for a heritage Maryborough home?",
    wiredWirelessA:
      "In an older Maryborough home we usually run wired cameras where a cable can go through an existing cavity or along the eaves — it is the most reliable option and there is no battery to replace up a ladder. Where the building fabric makes cabling invasive, such as solid VJ walls or no roof access over an extension, a well-placed wireless or solar camera avoids cutting into the house. We will walk the property and tell you which parts suit which.",
    projectKeyword: null,
    faqExtra: [],
  },
  {
    slug: "hervey-bay.html",
    name: "Hervey Bay",
    region: "the Fraser Coast",
    distance: "about 35 minutes from our Maryborough base",
    title: "Security Cameras Hervey Bay | CCTV & Alarm Installation",
    metaDescription:
      "Security camera and CCTV installation in Hervey Bay — homes, businesses, holiday lets and body corporates. Alarms, Starlink and cabling too. Call 0416 945 872.",
    h1: "Security Camera & CCTV Installation in Hervey Bay",
    image: "/assets/images/home-safety-connected.webp",
    lead:
      "Bannister Communications installs and services CCTV, alarm systems, and Starlink and wireless connectivity for homes and businesses right across Hervey Bay. Craig Bannister is based in Maryborough, about 35 minutes from the Esplanade, and has worked on Fraser Coast properties for more than 25 years. Every job is quoted and designed around your property — the entry points that matter, the way you want to review footage, and the conditions the equipment has to survive close to the water.",
    suburbs: [
      "Pialba", "Scarness", "Torquay", "Urangan", "Point Vernon", "Urraween", "Kawungan",
      "Wondunna", "Eli Waters", "Craignish", "Dundowran Beach", "Booral", "River Heads",
      "Burrum Heads", "Toogoom",
    ],
    suburbNote:
      "We cover the whole of Hervey Bay and the nearby Burrum and Booral coast. Call to confirm timing for your street.",
    considerationsHeading: "What to Think About for a Hervey Bay Installation",
    considerations: [
      ["Salt air and coastal corrosion",
        "Hervey Bay's sea air is hard on hardware. Camera housings, screws, brackets and cable glands that would last a decade inland can pit and seize within a couple of years a few streets back from the water in Torquay, Scarness, Point Vernon and Urangan. We specify marine-grade or powder-coated housings, stainless fixings and properly sealed cable entries for coastal installs, and we run through a simple wipe-down routine at handover so the cameras keep a clear picture."],
      ["Holiday lets and body corporate properties",
        "A large share of Hervey Bay housing is holiday rental, unit blocks and body-corporate managed. Those jobs have their own requirements — common-property coverage that respects unit privacy, footage access for a manager who is not on site, and systems a cleaner or caretaker can arm without a training session. We have set up shared and multi-tenant systems around Urangan and Torquay and can work with your body corporate or letting agent."],
      ["A phone-first, retiree-friendly setup",
        "Many of our Hervey Bay customers are retired and want one thing above all: open an app, see the front door, the caravan or the garage, wherever they are. We set the app up on your device, not just ours, show you how live view, playback and alerts work, and leave written notes. If someone changes it later, you can still call us."],
    ],
    servicesHeading: "Security & Communications Services in Hervey Bay",
    wiredWirelessQ: "Wired or wireless cameras for a coastal Hervey Bay property?",
    wiredWirelessA:
      "Close to the water we lean wired wherever the cable run is practical — a wired camera has no battery to fail, and a sealed cable entry keeps salt air out of the electronics. Wireless and solar cameras still have their place for a back fence, a jetty or a spot with no power, and we will tell you honestly which parts of your property suit which.",
    projectKeyword: null,
    faqExtra: [],
  },
  {
    slug: "gympie.html",
    name: "Gympie",
    region: "the Gympie region and Mary Valley",
    distance: "about an hour south of our Maryborough base",
    title: "Security Systems Gympie | CCTV & Camera Installation",
    metaDescription:
      "CCTV, alarm, Starlink and camera installation for Gympie homes, farms and acreage — from the CBD to the Mary Valley and Cooloola coast. Call 0416 945 872.",
    h1: "CCTV & Security Camera Installation in Gympie",
    image: "/assets/images/home-safety-connected.webp",
    lead:
      "Gympie is regular territory for Bannister Communications — about an hour south of our Maryborough base. We install CCTV, alarm systems, Starlink and point-to-point wireless, and data and antenna cabling for Gympie homes, businesses, farms and acreage properties, from the CBD and Southside out to the Mary Valley and the Cooloola coast.",
    suburbs: [
      "Gympie CBD", "Southside", "Jones Hill", "Monkland", "Victory Heights", "The Palms",
      "Pie Creek", "Widgee", "Kandanga", "Imbil", "Tin Can Bay", "Rainbow Beach",
      "Cooloola Cove", "Goomeri", "Kilkivan",
    ],
    suburbNote:
      "This is the area we aim to cover around Gympie. Some of the outer Mary Valley and North Burnett towns depend on the week's schedule — call and we will tell you straight away whether we can get to your address. (Craig to confirm the full travel list.)",
    considerationsHeading: "What to Think About for a Gympie Installation",
    considerations: [
      ["Acreage and distance from town",
        "A lot of Gympie properties are on acreage where the front gate is a few hundred metres from the house and the nearest neighbour is further still. That changes the job — the priority is usually the driveway entrance, the shed and the house approach, and the challenge is getting power and a signal to a camera that far out. We use solar cameras, point-to-point wireless links and long-range planning so you can see the gate from the kitchen."],
      ["Flood-prone low areas",
        "Parts of Gympie — the CBD, around Kidd Bridge, the low spots along the Mary River — flood, and they flood fast. We mount recorders and power supplies well above known flood heights, keep cabling out of the areas that go under first, and can set a system up so footage is held off-site rather than only on a box that might not survive."],
      ["Farm sheds, fuel and equipment theft",
        "Rural theft — diesel, tools, quad bikes, stock — is why a lot of Gympie farmers call us. Those jobs are about the shed, the fuel tank and the tracks onto the property, usually with no mains power nearby. Active-deterrence cameras that trigger a light and a spoken warning, combined with solar power and a wireless link back to the house, do more than a camera that only records."],
      ["Starlink where NBN does not reach",
        "Beyond the Gympie town edge, fixed internet gets patchy or disappears. If your property cannot get a usable NBN or fixed-line connection, Starlink is often the practical answer — we position and mount the dish for a clear view of the sky, run weatherproof cabling and set up the network so it also carries your cameras and phones."],
    ],
    servicesHeading: "Security & Communications Services in Gympie",
    wiredWirelessQ: "Wired, wireless or solar cameras for a rural Gympie property?",
    wiredWirelessA:
      "On acreage it is usually a mix. We run wired cameras around the house and shed where there is power and a workable cable path, and use solar cameras with a point-to-point wireless link for the front gate, a back paddock or a second shed with no mains power. The right combination depends on distance, tree cover and where you actually need to see.",
    projectKeyword: null,
    faqExtra: [],
  },
];

/* ============================================================= helpers */

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
  return Number.isNaN(date.getTime())
    ? new Date().toISOString().slice(0, 10)
    : date.toISOString().slice(0, 10);
}

function readableDate(value) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoDate(value)));
}

/** Most recent git commit date (YYYY-MM-DD) across the given files, else newest mtime. */
function lastmodFor(relPaths) {
  let best = "";
  for (const rel of relPaths) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) continue;
    let stamp = "";
    try {
      stamp = execFileSync("git", ["log", "-1", "--format=%cs", "--", rel], {
        cwd: root,
        encoding: "utf8",
      }).trim();
    } catch {
      stamp = "";
    }
    if (!stamp) stamp = fs.statSync(abs).toISOString?.() ?? "";
    if (!stamp) stamp = new Date(fs.statSync(abs).mtime).toISOString().slice(0, 10);
    if (stamp > best) best = stamp;
  }
  return best || new Date().toISOString().slice(0, 10);
}

function jsonLd(objects) {
  return objects
    .filter(Boolean)
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join("\n  ");
}

function layout({ title, description, canonical, image, type = "website", current = "", body, schema = "" }) {
  // Titles are authored to length. Only append the brand to short standalone
  // titles (e.g. blog post headlines) that have room for it.
  const pageTitle =
    title.includes("|") || title.includes(site.name) || title.length >= 44
      ? title
      : `${title} | ${site.name}`;
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
  <link rel="stylesheet" href="${site.css}">
  ${localBusinessLd()}
  ${schema}
</head>
<body>
  ${navHtml(current)}
  <main>${body}</main>
  ${footerHtml()}
  <script src="${site.js}" defer></script>
</body>
</html>
`;
}

/* ===================================================== service page */

function serviceSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}/${page.slug}#service`,
    name: page.name,
    url: `${site.url}/${page.slug}`,
    description: page.description,
    serviceType: page.name,
    areaServed: [
      { "@type": "City", name: "Maryborough, Queensland" },
      { "@type": "City", name: "Hervey Bay, Queensland" },
      { "@type": "City", name: "Gympie, Queensland" },
      { "@type": "AdministrativeArea", name: "Fraser Coast, Queensland" },
    ],
    provider: { "@id": `${site.url}/#business` },
  };
}

function townLinksBlock(heading) {
  const cards = towns
    .map(
      (t) => `
        <a class="related-service-card" href="/${t.slug}">
          <span>${escapeHtml(t.name)}</span>
          <small>View ${escapeHtml(t.name)} services</small>
        </a>`,
    )
    .join("");
  return `
      <section class="detail-scope">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Service areas</p>
            <h2>${escapeHtml(heading)}</h2>
            <p>Bannister Communications is based in Maryborough and installs this service across the Fraser Coast and Gympie. Pick your area for local detail, suburbs and FAQs.</p>
          </div>
          <div class="related-service-grid">${cards}</div>
        </div>
      </section>`;
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

  const hikvisionSection = page.hikvision
    ? `
      <section class="detail-scope">
        <div class="container detail-scope__grid">
          <div>
            <p class="eyebrow">Genuine equipment</p>
            <h2>An Authorised Hikvision Silver Partner in the Wide Bay</h2>
            <p>Bannister Communications is an Authorised Hikvision Australia Silver Value Added Solution Partner. For you that means the cameras and recorders we supply are genuine Australian stock with a valid manufacturer warranty, current firmware and security updates, and support that does not evaporate because the gear came through a grey-import channel. We also install HiLook and PSA Centrii where they are the better fit for the site and budget.</p>
          </div>
          <aside class="local-proof-card">
            <p class="local-proof-card__label">What partner status covers</p>
            <h2>Genuine Stock &amp; Real Warranty</h2>
            <ul>
              <li>Authorised Australian Hikvision supply</li>
              <li>Valid manufacturer warranty and firmware support</li>
              <li>Correct system design, not a box off a shelf</li>
              <li>Local support after the install</li>
            </ul>
          </aside>
        </div>
      </section>`
    : "";

  const projects = projectsForService(loadProjects(), page.keywords);
  const projectSection = renderProjectSection({
    projects,
    heading: `Recent ${page.name.toLowerCase()} work`,
    intro: "",
  });

  const schema = jsonLd([
    serviceSchema(page),
    {
      "@context": "https://schema.org",
      ...breadcrumbLd([
        ["Home", "/"],
        ["Services", "/services.html"],
        [page.name, `/${page.slug}`],
      ]),
    },
    faqLd(page.questions),
  ]);

  return layout({
    title: page.title,
    description: page.description,
    canonical: `${site.url}/${page.slug}`,
    image: page.image,
    current: page.slug,
    schema,
    body: `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <div class="container"><a href="/">Home</a> / <a href="/services.html">Services</a> / <span>${escapeHtml(page.name)}</span></div>
      </nav>
      <section class="page-hero service-detail-hero">
        <div class="container">
          <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
          <h1>${escapeHtml(page.heading)}</h1>
          <p class="hero-subtitle">Based in Maryborough and serving Hervey Bay, Gympie and the wider Fraser Coast.</p>
          <div class="cta-buttons">
            <a href="/contact.html" class="btn btn-primary">Request a Quote</a>
            <a href="${site.phoneHref}" class="btn btn-secondary">Call ${site.phone}</a>
          </div>
        </div>
      </section>
      ${trustStripHtml()}
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
            <h2>${escapeHtml(page.h2Benefits)}</h2>
          </div>
          <div class="detail-card-grid">${benefitCards}</div>
        </div>
      </section>
      <section class="detail-scope">
        <div class="container detail-scope__grid">
          <div>
            <p class="eyebrow">What we can help with</p>
            <h2>${escapeHtml(page.h2Scope)}</h2>
            <ul class="detail-checklist">${included}</ul>
          </div>
          <aside class="local-proof-card">
            <p class="local-proof-card__label">Local confidence</p>
            <h2>${escapeHtml(page.short)} From a Local, Licensed Installer</h2>
            <p>Bannister Communications is based in Maryborough and regularly works across Hervey Bay, Gympie and the surrounding Wide Bay.</p>
            <ul>
              <li>Security Licence #${site.licence}</li>
              <li>Hikvision Australia Silver Partner 2026</li>
              <li>Residential, commercial and rural work</li>
            </ul>
            <a href="/maryborough.html">View our Maryborough service area</a>
          </aside>
        </div>
      </section>
      ${hikvisionSection}
      ${projectSection}
      ${townLinksBlock(page.h2Local)}
      <section class="faq-section detail-faq">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Common questions</p>
            <h2>${escapeHtml(page.name)}: Common Questions</h2>
          </div>
          <div class="faq-grid">${questions}</div>
        </div>
      </section>
      <section class="related-services">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Related services</p>
            <h2>${escapeHtml(page.h2Related)}</h2>
          </div>
          <div class="related-service-grid">${relatedServiceLinks(page.slug)}</div>
        </div>
      </section>
      <section class="cta-section">
        <div class="container">
          <h2>${escapeHtml(page.h2Cta)}</h2>
          <p>Tell us about the property, location and result you need. We’ll help you work out the practical next step.</p>
          <div class="cta-buttons">
            <a href="/contact.html" class="btn btn-primary">Request a Quote</a>
            <a href="${site.phoneHref}" class="btn btn-secondary">Call ${site.phone}</a>
          </div>
        </div>
      </section>`,
  });
}

/* ======================================================== town page */

const TOWN_SERVICE_BLOCKS = [
  {
    slug: "cctv-installation.html",
    h3: "CCTV & security cameras",
    copy: (t) =>
      `HiLook, Hikvision and PSA Centrii cameras with NVR recording, smart human and vehicle detection and phone viewing, planned around the entry points and blind spots on your ${t} property. We assess lighting and camera angles on site rather than selling a fixed camera count, and we set up recording, playback and alerts before we leave.`,
    anchor: "CCTV installation",
  },
  {
    slug: "alarm-systems.html",
    h3: "Alarm systems",
    copy: () =>
      `PSA Centrii wireless alarms with door, window and motion sensors, sirens and smartphone arming — matched to how you actually use the building so it is easy to live with. Wireless sensors suit existing and older homes where new cabling would mean cutting into walls and ceilings.`,
    anchor: "alarm systems",
  },
  {
    slug: "starlink-wireless.html",
    h3: "Starlink & point-to-point wireless",
    copy: () =>
      `Starlink dish positioning and setup, and point-to-point wireless links between the house, sheds, gates and second dwellings where trenching cable is not practical. We check line of sight, mounting and power at both ends before quoting, and set the network up so it also carries cameras and phones.`,
    anchor: "Starlink and wireless links",
  },
  {
    slug: "data-cabling-antennas.html",
    h3: "Data cabling & TV antennas",
    copy: () =>
      `Cat 6 data points, cabling for cameras and access points, and TV antenna installation, alignment and fault-finding — all tidily run, labelled where it helps, and tested before handover. We diagnose the actual cause of a reception or network fault rather than replacing parts on a guess.`,
    anchor: "data cabling and TV antennas",
  },
];

const TOWN_PROCESS = [
  ["Free on-site assessment", "We walk the property with you, look at entry points, lighting, cable paths, power and internet, and talk through what you actually want the system to do."],
  ["An itemised written quote", "You get a quote that lists each part and what it costs, so you can add or drop things and see the effect. No pressure, no obligation."],
  ["Tidy installation", "Cameras, sensors and cabling are mounted and routed to last, with as little disruption to the building as possible. Most homes are a one-day job."],
  ["Testing and handover", "We test night vision, recording, playback, alerts and remote access, set the app up on your own phone, and leave written notes."],
  ["Local support afterwards", "If something needs adjusting, expanding or servicing later, you are calling a local installer, not a call centre."],
];

function townFaq(town) {
  const other = towns.filter((t) => t.slug !== town.slug).map((t) => t.name);
  return [
    [
      `How much does CCTV installation cost in ${town.name}?`,
      `It depends on how many cameras you need, whether existing cabling can be reused, and how far the recorder sits from the cameras. A straightforward four-camera system for a single-storey home sits at the lower end; add a second storey, a detached shed, coastal-grade housings or solar and wireless for an outbuilding and it climbs. TODO: Craig to confirm a typical range. Every quote is free and itemised, so you can see what each part costs — call ${site.phone}.`,
    ],
    [
      `Can I watch my ${town.name} cameras from my phone?`,
      `Yes. We set the app up on your own phone or tablet, not just ours, and show you live view, playback and motion alerts before we leave. It works over home wifi and mobile data, so you can check the property from anywhere.`,
    ],
    [town.wiredWirelessQ, town.wiredWirelessA],
    [
      `Can my neighbour point a camera at my house?`,
      `A home CCTV camera that incidentally captures part of a neighbouring property or the footpath is generally allowed, but deliberately targeting the inside of someone's home or yard, or recording audio of private conversations, can cross a line. We aim cameras at your own property and mask areas we do not need to see. For a dispute or a specific legal question, the Queensland Office of the Information Commissioner (oic.qld.gov.au) is the place to start — we install to good practice, but we do not give legal advice.`,
    ],
    [
      `Do you upgrade existing systems or only new installs?`,
      `Both. We regularly inspect an existing recorder, cameras, cabling and network, keep the parts that are still sound — often the cabling — and replace or add only what needs it. If a system just needs a service, a re-aim or a firmware update, we will tell you that.`,
    ],
    [
      `Alarm or CCTV — which do I need?`,
      `They do different jobs. An alarm is about getting people out and getting a response when someone is somewhere they should not be. CCTV is about seeing what happened and identifying who. Most security-conscious ${town.name} homes end up with both, layered together — see our <a href="/alarm-systems.html">alarm systems</a> and <a href="/cctv-installation.html">CCTV installation</a> pages — and we can phase it if budget is tight.`,
    ],
    [
      `Do you do access control and key fob systems for ${town.name} schools and businesses?`,
      `Yes. We install Gate Keeper intercom and access control alongside CCTV and alarms — key-fob and keypad entry, door strikes and electric gates, and multi-user access with time restrictions — for schools, childcare, clubs and commercial sites.`,
    ],
    ...town.faqExtra,
  ];
}

function townSchema(town, faq) {
  return jsonLd([
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${site.url}/${town.slug}#service`,
      name: `Security and Communications Installation in ${town.name}`,
      url: `${site.url}/${town.slug}`,
      description: town.metaDescription,
      serviceType: "CCTV, alarm, Starlink and data cabling installation",
      areaServed: { "@type": "City", name: `${town.name}, Queensland` },
      provider: { "@id": `${site.url}/#business` },
    },
    {
      "@context": "https://schema.org",
      ...breadcrumbLd([
        ["Home", "/"],
        [`${town.name} services`, `/${town.slug}`],
      ]),
    },
    faqLd(faq.map(([q, a]) => [q, stripHtml(a)])),
  ]);
}

function renderTownPage(town) {
  const projects = projectsForTown(loadProjects(), town.name);
  const reviews = loadReviews();
  const faq = townFaq(town);
  const otherTowns = towns.filter((t) => t.slug !== town.slug);

  const suburbList = town.suburbs.map((s) => `<li>${escapeHtml(s)}</li>`).join("\n            ");

  const serviceBlocks = TOWN_SERVICE_BLOCKS.map(
    (b) => `
        <article class="detail-card">
          <h3>${escapeHtml(b.h3)}</h3>
          <p>${escapeHtml(b.copy(town.name))}</p>
          <a href="/${b.slug}">${escapeHtml(b.anchor)} in ${escapeHtml(town.name)}</a>
        </article>`,
  ).join("");

  const considerations = town.considerations
    .map(
      ([h3, p]) => `
          <article class="detail-card">
            <h3>${escapeHtml(h3)}</h3>
            <p>${escapeHtml(p)}</p>
          </article>`,
    )
    .join("");

  const faqItems = faq
    .map(
      ([q, a]) => `
        <article class="faq-item">
          <h3>${escapeHtml(q)}</h3>
          <p>${a}</p>
        </article>`,
    )
    .join("");

  const distanceClause = town.distance ? ` (${town.distance})` : "";

  return layout({
    title: town.title,
    description: town.metaDescription,
    canonical: `${site.url}/${town.slug}`,
    image: town.image,
    current: town.slug,
    schema: townSchema(town, faq),
    body: `
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <div class="container"><a href="/">Home</a> / <span>${escapeHtml(town.name)} services</span></div>
      </nav>
      <section class="page-hero service-detail-hero">
        <div class="container">
          <p class="eyebrow">${escapeHtml(town.name)} security &amp; communications</p>
          <h1>${escapeHtml(town.h1)}</h1>
          <p class="hero-subtitle">CCTV, alarms, Starlink and cabling for ${escapeHtml(town.name)} homes and businesses${escapeHtml(distanceClause)}.</p>
          <div class="cta-buttons">
            <a href="/contact.html" class="btn btn-primary">Request a ${escapeHtml(town.name)} Quote</a>
            <a href="${site.phoneHref}" class="btn btn-secondary">Call ${site.phone}</a>
          </div>
        </div>
      </section>
      ${trustStripHtml()}
      <section class="detail-intro">
        <div class="container detail-intro__grid">
          <div>
            <p class="detail-lead">${escapeHtml(town.lead)}</p>
          </div>
          <figure class="detail-figure">
            <img src="${town.image}" alt="Home security equipment installed by Bannister Communications for ${escapeHtml(town.name)} properties" width="600" height="400" loading="eager" fetchpriority="high">
          </figure>
        </div>
      </section>
      <section class="detail-benefits">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${escapeHtml(town.name)} coverage</p>
            <h2>Suburbs We Cover Around ${escapeHtml(town.name)}</h2>
          </div>
          <ul class="location-list">
            ${suburbList}
          </ul>
          <p class="location-note">${escapeHtml(town.suburbNote)}</p>
        </div>
      </section>
      <section class="detail-scope">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Services</p>
            <h2>${escapeHtml(town.servicesHeading)}</h2>
          </div>
          <div class="detail-card-grid detail-card-grid--services">${serviceBlocks}</div>
        </div>
      </section>
      <section class="detail-benefits">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Local knowledge</p>
            <h2>${escapeHtml(town.considerationsHeading)}</h2>
          </div>
          <div class="detail-card-grid">${considerations}</div>
        </div>
      </section>
      <section class="detail-scope">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">What to expect</p>
            <h2>How a ${escapeHtml(town.name)} Installation Runs</h2>
          </div>
          <ul class="detail-checklist detail-checklist--wide">
            ${TOWN_PROCESS.map(
              ([h, p]) => `<li><strong>${escapeHtml(h)}.</strong> ${escapeHtml(p)}</li>`,
            ).join("\n            ")}
          </ul>
        </div>
      </section>
      ${renderProjectSection({
        projects,
        heading: `Recent work in ${town.name}`,
        intro: "",
      })}
      ${renderReviewSection({ reviews, heading: "What customers say" })}
      <section class="faq-section detail-faq">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">${escapeHtml(town.name)} questions</p>
            <h2>${escapeHtml(town.name)} Security: Common Questions</h2>
          </div>
          <div class="faq-grid">${faqItems}</div>
        </div>
      </section>
      <section class="related-services">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Nearby</p>
            <h2>Other Areas We Cover</h2>
          </div>
          <div class="related-service-grid">
            ${otherTowns
              .map(
                (t) => `
            <a class="related-service-card" href="/${t.slug}">
              <span>${escapeHtml(t.name)}</span>
              <small>View ${escapeHtml(t.name)} services</small>
            </a>`,
              )
              .join("")}
          </div>
        </div>
      </section>
      <section class="cta-section">
        <div class="container">
          <h2>Request a ${escapeHtml(town.name)} Quote</h2>
          <p>Tell us what you want to protect or connect and we’ll recommend a practical next step. Free, itemised quotes.</p>
          <div class="cta-buttons">
            <a href="/contact.html" class="btn btn-primary">Request a Quote</a>
            <a href="${site.phoneHref}" class="btn btn-secondary">Call ${site.phone}</a>
          </div>
        </div>
      </section>`,
  });
}

/* ============================================================== write */

function writeSeoPages() {
  for (const town of townPages) {
    fs.writeFileSync(path.join(outDir, town.slug), renderTownPage(town));
  }
  for (const page of servicePages) {
    fs.writeFileSync(path.join(outDir, page.slug), renderServicePage(page));
  }
}

function injectStaticPartials() {
  for (const filename of Object.keys(STATIC_CURRENT)) {
    const file = path.join(outDir, filename);
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, "utf8");
    fs.writeFileSync(file, injectIntoStatic(html, filename));
  }
}

/* =============================================================== blog */

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
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/assets/images/bannister-logo.webp` },
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

/* ============================================================ sitemap */

function writeSitemap(posts) {
  const generatorInputs = ["scripts/build-site.js", "scripts/partials.js", "content/projects.yml", "content/reviews.yml"];
  const generatedLastmod = lastmodFor(generatorInputs);

  const basePages = [
    { url: "/", priority: "1.0", src: ["index.html"] },
    { url: "/services.html", priority: "0.9", src: ["services.html"] },
    { url: "/contact.html", priority: "0.9", src: ["contact.html"] },
    { url: "/about.html", priority: "0.7", src: ["about.html"] },
    { url: "/maryborough.html", priority: "0.9", src: generatorInputs },
    { url: "/hervey-bay.html", priority: "0.9", src: generatorInputs },
    { url: "/gympie.html", priority: "0.9", src: generatorInputs },
    { url: "/cctv-installation.html", priority: "0.9", src: generatorInputs },
    { url: "/alarm-systems.html", priority: "0.8", src: generatorInputs },
    { url: "/starlink-wireless.html", priority: "0.8", src: generatorInputs },
    { url: "/data-cabling-antennas.html", priority: "0.8", src: generatorInputs },
    { url: "/blog/", priority: "0.7", src: ["scripts/build-site.js", "data/cmsBlogPosts.json"] },
  ];

  const urls = [
    ...basePages.map((page) => ({
      loc: `${site.url}${page.url}`,
      lastmod: page.src === generatorInputs ? generatedLastmod : lastmodFor(page.src),
      changefreq: "monthly",
      priority: page.priority,
    })),
    ...posts.map((post) => ({
      loc: `${site.url}/blog/${post.slug}/`,
      lastmod: isoDate(post.updatedAt || post.date),
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
  injectStaticPartials();
  const posts = readPosts();
  writeBlog(posts);
  writeSitemap(posts);
  writeFeed(posts);
  configureAdmin();
  console.log(`Built Bannister site with ${posts.length} published CMS posts.`);
}

main();
