const fs = require('fs');
const path = require('path');

const sharp = require('sharp');

const BRAND_BG = { r: 242, g: 228, b: 200, alpha: 1 };
const SOURCE_LOGO = path.join(__dirname, '../assets/game/ui/app-logo.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

async function createIcon(size) {
  const logoSize = Math.round(size * 0.82);
  const resizedLogo = await sharp(SOURCE_LOGO)
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

  const icon192 = await createIcon(192);
  const icon512 = await createIcon(512);
  const appleTouchIcon = await createIcon(180);

  await fs.promises.writeFile(path.join(OUTPUT_DIR, 'icon-192.png'), icon192);
  await fs.promises.writeFile(path.join(OUTPUT_DIR, 'icon-512.png'), icon512);
  await fs.promises.writeFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'), appleTouchIcon);

  console.log('Generated PWA icons in public/');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
