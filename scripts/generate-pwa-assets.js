const fs = require('fs');
const path = require('path');

const sharp = require('sharp');

const BRAND_BG = { r: 242, g: 228, b: 200, alpha: 1 };
const SOURCE_LOGO = path.join(__dirname, '../assets/game/ui/app-logo.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

/** Home-screen icons: logo should fill the tile. */
const LOGO_SCALE_STANDARD = 0.97;

/** Maskable Android icons keep extra padding inside the safe zone. */
const LOGO_SCALE_MASKABLE = 0.82;

async function loadTrimmedLogo() {
  return sharp(SOURCE_LOGO).trim({ threshold: 12 }).png().toBuffer();
}

async function createIcon(size, logoScale) {
  const trimmedLogo = await loadTrimmedLogo();
  const logoSize = Math.round(size * logoScale);
  const resizedLogo = await sharp(trimmedLogo)
    .resize(logoSize, logoSize, { fit: 'inside' })
    .toBuffer();
  const meta = await sharp(resizedLogo).metadata();
  const left = Math.round((size - meta.width) / 2);
  const top = Math.round((size - meta.height) / 2);

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BRAND_BG,
    },
  })
    .composite([{ input: resizedLogo, left, top }])
    .png()
    .toBuffer();
}

async function main() {
  if (!fs.existsSync(SOURCE_LOGO)) {
    throw new Error(`Logo not found: ${SOURCE_LOGO}`);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const outputs = [
    ['icon-192.png', 192, LOGO_SCALE_STANDARD],
    ['icon-512.png', 512, LOGO_SCALE_STANDARD],
    ['icon-maskable-512.png', 512, LOGO_SCALE_MASKABLE],
    ['apple-touch-icon.png', 180, LOGO_SCALE_STANDARD],
    ['apple-touch-icon-512.png', 512, LOGO_SCALE_STANDARD],
  ];

  for (const [filename, size, scale] of outputs) {
    const icon = await createIcon(size, scale);
    await fs.promises.writeFile(path.join(OUTPUT_DIR, filename), icon);
  }

  console.log('Generated PWA icons in public/');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
