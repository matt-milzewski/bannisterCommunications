const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const imageDir = path.join(root, "assets", "images");

const jobs = [
  ["new_logo.PNG", "bannister-logo.webp", 320, 86],
  ["Craig.png", "craig-bannister.webp", 900, 82],
  ["active_deterrence_system.jpg", "active-deterrence-system.webp", 900, 82],
  ["gate_keeper.jpg", "gate-keeper-intercom.webp", 900, 82],
  ["Home_Safety_connected.jpg", "home-safety-connected.webp", 900, 82],
];

async function main() {
  for (const [source, target, width, quality] of jobs) {
    await sharp(path.join(imageDir, source))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(path.join(imageDir, target));
    console.log(`Optimised ${source} -> ${target}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
