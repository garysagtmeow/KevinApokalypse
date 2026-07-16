const fs = require('fs');
const path = require('path');

const sharp = require('sharp');

const BRAND_BG = { r: 242, g: 228, b: 200, alpha: 1 };
const SOURCE_LOGO = path.join(__dirname, '../assets/game/ui/app-logo.png');
const OUTPUT_DIR = path.join(__dirname, '../assets/images');

async function createLogoOnBackground(size, logoScale = 0.88, background = BRAND_BG) {
  const logoSize = Math.round(size * logoScale);
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
      background,
    },
  })
    .composite([{ input: resizedLogo, left, top }])
    .png()
    .toBuffer();
}

async function writeFile(filePath, buffer) {
  await fs.promises.writeFile(filePath, buffer);
}

async function main() {
  if (!fs.existsSync(SOURCE_LOGO)) {
    throw new Error(`Logo not found: ${SOURCE_LOGO}`);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const icon = await sharp(SOURCE_LOGO).resize(1024, 1024, { fit: 'contain', background: '#FFFFFF' }).png().toBuffer();
  const splash = await createLogoOnBackground(512, 0.86);
  const favicon = await sharp(icon).resize(48, 48).png().toBuffer();
  const androidForeground = await sharp(SOURCE_LOGO)
    .resize(820, 820, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top: 102,
      bottom: 102,
      left: 102,
      right: 102,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
  const androidBackground = await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: BRAND_BG,
    },
  })
    .png()
    .toBuffer();
  const androidMonochrome = await sharp(icon).grayscale().png().toBuffer();

  await writeFile(path.join(OUTPUT_DIR, 'icon.png'), icon);
  await writeFile(path.join(OUTPUT_DIR, 'splash-icon.png'), splash);
  await writeFile(path.join(OUTPUT_DIR, 'favicon.png'), favicon);
  await writeFile(path.join(OUTPUT_DIR, 'android-icon-foreground.png'), androidForeground);
  await writeFile(path.join(OUTPUT_DIR, 'android-icon-background.png'), androidBackground);
  await writeFile(path.join(OUTPUT_DIR, 'android-icon-monochrome.png'), androidMonochrome);

  console.log('Generated branding assets from assets/game/ui/app-logo.png');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
