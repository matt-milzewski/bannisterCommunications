const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const imageDir = path.join(root, "assets", "images");

const srcDir = path.join(root, "assets", "src");

// Single fixed-width conversions (originals live in assets/images/).
const jobs = [
  ["new_logo.PNG", "bannister-logo.webp", 320, 86],
  ["Craig.png", "craig-bannister.webp", 900, 82],
  ["active_deterrence_system.jpg", "active-deterrence-system.webp", 900, 82],
  ["gate_keeper.jpg", "gate-keeper-intercom.webp", 900, 82],
  ["Home_Safety_connected.jpg", "home-safety-connected.webp", 900, 82],
];

// Responsive sets for stock photos. Put the original in assets/src/, add a row
// here { src, name, hero }, then run `npm run images:optimize`. Writes
// <name>-480/960/1440.webp (+ <name>-1440.jpg for a hero) into assets/images/.
// Record every one in assets/IMAGE_CREDITS.md.
const responsiveJobs = [
  // { src: "pexels-123-urangan-pier.jpg", name: "hervey-bay-urangan-pier", hero: true },
];

const WIDTHS = [480, 960, 1440];

async function main() {
  for (const [source, target, width, quality] of jobs) {
    await sharp(path.join(imageDir, source))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(path.join(imageDir, target));
    console.log(`Optimised ${source} -> ${target}`);
  }

  for (const { src, name, hero } of responsiveJobs) {
    const input = path.join(srcDir, src);
    for (const width of WIDTHS) {
      await sharp(input)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: hero ? 74 : 78 })
        .toFile(path.join(imageDir, `${name}-${width}.webp`));
    }
    if (hero) {
      await sharp(input)
        .rotate()
        .resize({ width: 1440, withoutEnlargement: true })
        .jpeg({ quality: 72, mozjpeg: true })
        .toFile(path.join(imageDir, `${name}-1440.jpg`));
    }
    console.log(`Optimised ${src} -> ${name}-{${WIDTHS.join(",")}}.webp${hero ? " (+ .jpg)" : ""}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
