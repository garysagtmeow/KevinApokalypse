const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const HEADS_DIR = path.join(__dirname, '../assets/game/characters/heads');
const BODIES_DIR = path.join(__dirname, '../assets/game/characters/bodies');

function createBuffer(width, height) {
  return {
    width,
    height,
    data: new Uint8Array(width * height * 4),
  };
}

function setPixel(buffer, x, y, color) {
  if (x < 0 || y < 0 || x >= buffer.width || y >= buffer.height) {
    return;
  }

  const index = (y * buffer.width + x) * 4;
  const alpha = color[3] / 255;
  const inverseAlpha = 1 - alpha;
  buffer.data[index] = Math.round(color[0] * alpha + buffer.data[index] * inverseAlpha);
  buffer.data[index + 1] = Math.round(color[1] * alpha + buffer.data[index + 1] * inverseAlpha);
  buffer.data[index + 2] = Math.round(color[2] * alpha + buffer.data[index + 2] * inverseAlpha);
  buffer.data[index + 3] = Math.round(255 * (alpha + buffer.data[index + 3] / 255 * inverseAlpha));
}

function fillRect(buffer, x, y, width, height, color) {
  for (let row = y; row < y + height; row += 1) {
    for (let column = x; column < x + width; column += 1) {
      setPixel(buffer, column, row, color);
    }
  }
}

function fillCircle(buffer, centerX, centerY, radius, color) {
  for (let y = centerY - radius; y <= centerY + radius; y += 1) {
    for (let x = centerX - radius; x <= centerX + radius; x += 1) {
      const distance = Math.hypot(x - centerX, y - centerY);
      if (distance <= radius) {
        setPixel(buffer, x, y, color);
      }
    }
  }
}

function fillEllipse(buffer, centerX, centerY, radiusX, radiusY, color) {
  for (let y = centerY - radiusY; y <= centerY + radiusY; y += 1) {
    for (let x = centerX - radiusX; x <= centerX + radiusX; x += 1) {
      const normalized =
        ((x - centerX) * (x - centerX)) / (radiusX * radiusX) +
        ((y - centerY) * (y - centerY)) / (radiusY * radiusY);
      if (normalized <= 1) {
        setPixel(buffer, x, y, color);
      }
    }
  }
}

function fillTrapezoid(buffer, centerX, topY, bottomY, topWidth, bottomWidth, color) {
  const height = bottomY - topY;
  if (height <= 0) {
    return;
  }

  for (let row = 0; row <= height; row += 1) {
    const progress = row / height;
    const rowWidth = topWidth + (bottomWidth - topWidth) * progress;
    const left = Math.round(centerX - rowWidth / 2);
    fillRect(buffer, left, topY + row, Math.round(rowWidth), 1, color);
  }
}

function drawLine(buffer, x1, y1, x2, y2, thickness, color) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1);
  for (let step = 0; step <= steps; step += 1) {
    const t = step / steps;
    const x = Math.round(x1 + (x2 - x1) * t);
    const y = Math.round(y1 + (y2 - y1) * t);
    fillCircle(buffer, x, y, Math.ceil(thickness / 2), color);
  }
}

function addNoise(buffer, amount = 8) {
  for (let index = 0; index < buffer.data.length; index += 4) {
    if (buffer.data[index + 3] === 0) {
      continue;
    }

    const noise = Math.floor(Math.random() * amount) - amount / 2;
    buffer.data[index] = Math.max(0, Math.min(255, buffer.data[index] + noise));
    buffer.data[index + 1] = Math.max(0, Math.min(255, buffer.data[index + 1] + noise));
    buffer.data[index + 2] = Math.max(0, Math.min(255, buffer.data[index + 2] + noise));
  }
}

function writePng(filePath, buffer) {
  const { width, height, data } = buffer;
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * stride;
    raw[rowStart] = 0;
    Buffer.from(data.slice(y * width * 4, (y + 1) * width * 4)).copy(raw, rowStart + 1);
  }

  const compressed = zlib.deflateSync(raw);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const chunks = [
    createChunk('IHDR', ihdr),
    createChunk('IDAT', compressed),
    createChunk('IEND', Buffer.alloc(0)),
  ];

  fs.writeFileSync(filePath, Buffer.concat([signature, ...chunks]));
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type);
  const crc = crc32(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (let index = 0; index < buffer.length; index += 1) {
    crc ^= buffer[index];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createPhotoHead({
  skin,
  hair,
  hairTop,
  eyeY,
  smile,
  extra,
}) {
  const buffer = createBuffer(128, 128);
  fillRect(buffer, 0, 0, 128, 128, [0, 0, 0, 0]);
  fillRect(buffer, 18, hairTop, 92, 34, [...hair, 255]);
  fillCircle(buffer, 64, 68, 46, [...skin, 255]);
  fillCircle(buffer, 48, eyeY, 5, [35, 25, 18, 255]);
  fillCircle(buffer, 80, eyeY, 5, [35, 25, 18, 255]);
  fillCircle(buffer, 49, eyeY - 1, 2, [255, 255, 255, 220]);
  fillCircle(buffer, 81, eyeY - 1, 2, [255, 255, 255, 220]);

  for (let x = 46; x <= 82; x += 1) {
    const progress = (x - 46) / 36;
    const y = smile.baseY + Math.sin(progress * Math.PI) * smile.depth;
    setPixel(buffer, x, Math.round(y), [120, 70, 55, 255]);
    setPixel(buffer, x, Math.round(y) + 1, [120, 70, 55, 255]);
  }

  if (extra) {
    extra(buffer);
  }

  addNoise(buffer, 10);
  fillCircle(buffer, 64, 68, 46, [0, 0, 0, 0]);
  fillRect(buffer, 18, hairTop, 92, 34, [...hair, 255]);
  fillCircle(buffer, 64, 68, 46, [...skin, 255]);
  fillCircle(buffer, 48, eyeY, 5, [35, 25, 18, 255]);
  fillCircle(buffer, 80, eyeY, 5, [35, 25, 18, 255]);
  fillCircle(buffer, 49, eyeY - 1, 2, [255, 255, 255, 220]);
  fillCircle(buffer, 81, eyeY - 1, 2, [255, 255, 255, 220]);
  for (let x = 46; x <= 82; x += 1) {
    const progress = (x - 46) / 36;
    const y = smile.baseY + Math.sin(progress * Math.PI) * smile.depth;
    setPixel(buffer, x, Math.round(y), [120, 70, 55, 255]);
    setPixel(buffer, x, Math.round(y) + 1, [120, 70, 55, 255]);
  }
  if (extra) {
    extra(buffer);
  }

  return buffer;
}

function createEmiHead() {
  return createPhotoHead({
    skin: [255, 182, 163],
    hair: [74, 55, 40],
    hairTop: 16,
    eyeY: 62,
    smile: { baseY: 82, depth: 5 },
    extra: (buffer) => {
      fillEllipse(buffer, 64, 74, 8, 5, [235, 150, 140, 120]);
    },
  });
}

function createTimmyHead() {
  return createPhotoHead({
    skin: [232, 184, 138],
    hair: [120, 120, 120],
    hairTop: 20,
    eyeY: 64,
    smile: { baseY: 84, depth: 3 },
    extra: (buffer) => {
      drawLine(buffer, 38, 66, 52, 66, 3, [40, 40, 40, 255]);
      drawLine(buffer, 76, 66, 90, 66, 3, [40, 40, 40, 255]);
      drawLine(buffer, 52, 66, 76, 66, 3, [40, 40, 40, 255]);
      for (let x = 52; x <= 78; x += 4) {
        setPixel(buffer, x, 92, [150, 120, 95, 180]);
      }
    },
  });
}

function createKevinHead() {
  const buffer = createBuffer(128, 128);
  fillRect(buffer, 0, 0, 128, 128, [0, 0, 0, 0]);
  fillEllipse(buffer, 64, 72, 52, 44, [123, 74, 30, 255]);
  fillEllipse(buffer, 34, 42, 18, 34, [98, 58, 22, 255]);
  fillEllipse(buffer, 94, 42, 18, 34, [98, 58, 22, 255]);
  fillEllipse(buffer, 64, 82, 20, 16, [222, 190, 150, 255]);
  fillCircle(buffer, 64, 78, 7, [45, 28, 12, 255]);
  fillCircle(buffer, 50, 62, 5, [25, 18, 10, 255]);
  fillCircle(buffer, 78, 62, 5, [25, 18, 10, 255]);
  fillCircle(buffer, 51, 61, 2, [255, 255, 255, 200]);
  fillCircle(buffer, 79, 61, 2, [255, 255, 255, 200]);
  fillEllipse(buffer, 72, 88, 10, 7, [220, 90, 90, 255]);
  addNoise(buffer, 12);
  return buffer;
}

function createStandingBody() {
  const buffer = createBuffer(96, 120);
  const shirt = [252, 252, 252, 255];
  const shirtShade = [228, 228, 228, 255];
  const pants = [58, 72, 108, 255];
  const pantsShade = [40, 50, 86, 255];
  const shoe = [50, 40, 36, 255];
  const skin = [255, 182, 163, 255];
  const cx = 48;
  const armSpread = 18;
  const legSpread = 10;

  drawLine(buffer, cx, 58, cx - legSpread, 98, 11, pants);
  drawLine(buffer, cx, 58, cx + legSpread, 98, 11, pants);
  drawLine(buffer, cx - legSpread, 98, cx - legSpread - 4, 108, 9, pantsShade);
  drawLine(buffer, cx + legSpread, 98, cx + legSpread + 3, 108, 9, pantsShade);
  fillEllipse(buffer, cx - legSpread - 4, 109, 6, 4, shoe);
  fillEllipse(buffer, cx + legSpread + 3, 109, 6, 4, shoe);
  fillRect(buffer, cx - 14, 56, 28, 5, pants);

  fillTrapezoid(buffer, cx, 26, 58, 36, 26, shirt);
  drawLine(buffer, cx, 30, cx - armSpread, 52, 10, shirt);
  drawLine(buffer, cx, 30, cx + armSpread, 52, 10, shirt);
  fillRect(buffer, cx - 10, 22, 20, 6, shirtShade);
  fillCircle(buffer, cx - armSpread, 55, 5, skin);
  fillCircle(buffer, cx + armSpread, 55, 5, skin);

  return buffer;
}

function createSittingBody() {
  const buffer = createBuffer(120, 148);
  const pullover = [28, 130, 255, 255];
  const pulloverLight = [110, 185, 255, 180];
  const pulloverShade = [14, 92, 215, 255];
  const pants = [58, 72, 108, 255];
  const shoe = [50, 40, 36, 255];
  const skin = [232, 184, 138, 255];
  const cx = 60;

  drawLine(buffer, cx, 72, 38, 102, 12, pants);
  drawLine(buffer, cx, 72, 82, 102, 12, pants);
  drawLine(buffer, 38, 102, 24, 110, 12, pants);
  drawLine(buffer, 82, 102, 96, 110, 12, pants);
  fillEllipse(buffer, 24, 112, 9, 5, shoe);
  fillEllipse(buffer, 96, 112, 9, 5, shoe);
  fillRect(buffer, 36, 82, 48, 6, pants);

  fillEllipse(buffer, cx, 50, 24, 27, pullover);
  drawLine(buffer, cx, 38, 14, 62, 11, pullover);
  drawLine(buffer, cx, 38, 106, 62, 11, pullover);
  fillEllipse(buffer, cx, 29, 15, 8, pulloverShade);
  fillEllipse(buffer, cx, 46, 9, 16, pulloverLight);
  fillCircle(buffer, 14, 64, 5, skin);
  fillCircle(buffer, 106, 64, 5, skin);

  return buffer;
}

function createDogBody() {
  const buffer = createBuffer(96, 88);
  const ink = [44, 24, 16, 255];
  const black = [28, 28, 28, 255];

  fillEllipse(buffer, 48, 30, 26, 16, black);
  fillEllipse(buffer, 48, 12, 5, 6, black);

  drawLine(buffer, 30, 44, 26, 68, 7, black);
  drawLine(buffer, 40, 44, 38, 70, 7, black);
  drawLine(buffer, 56, 44, 58, 68, 7, black);
  drawLine(buffer, 66, 44, 72, 66, 7, black);

  fillCircle(buffer, 22, 73, 4, black);
  fillCircle(buffer, 36, 75, 4, black);
  fillCircle(buffer, 60, 73, 4, black);
  fillCircle(buffer, 76, 71, 4, black);

  drawLine(buffer, 74, 28, 82, 20, 5, black);
  drawLine(buffer, 82, 20, 88, 24, 5, black);
  drawLine(buffer, 88, 24, 86, 32, 5, black);

  drawLine(buffer, 48, 4, 48, 14, 4, ink);
  drawLine(buffer, 24, 24, 36, 18, 4, ink);
  drawLine(buffer, 36, 18, 60, 18, 4, ink);
  drawLine(buffer, 60, 18, 72, 24, 4, ink);
  drawLine(buffer, 72, 24, 74, 40, 4, ink);
  drawLine(buffer, 24, 24, 26, 42, 4, ink);
  drawLine(buffer, 26, 42, 72, 42, 4, ink);
  drawLine(buffer, 30, 42, 28, 48, 3, ink);
  drawLine(buffer, 66, 42, 68, 48, 3, ink);

  drawLine(buffer, 30, 44, 26, 68, 4, ink);
  drawLine(buffer, 26, 68, 20, 72, 3, ink);
  drawLine(buffer, 20, 72, 24, 74, 3, ink);

  drawLine(buffer, 40, 44, 38, 70, 4, ink);
  drawLine(buffer, 38, 70, 34, 74, 3, ink);
  drawLine(buffer, 34, 74, 38, 75, 3, ink);

  drawLine(buffer, 56, 44, 58, 68, 4, ink);
  drawLine(buffer, 58, 68, 62, 72, 3, ink);
  drawLine(buffer, 62, 72, 58, 74, 3, ink);

  drawLine(buffer, 66, 44, 72, 66, 4, ink);
  drawLine(buffer, 72, 66, 78, 70, 3, ink);
  drawLine(buffer, 78, 70, 74, 73, 3, ink);

  drawLine(buffer, 74, 28, 82, 20, 3, ink);
  drawLine(buffer, 82, 20, 88, 24, 3, ink);
  drawLine(buffer, 88, 24, 86, 32, 3, ink);
  drawLine(buffer, 86, 32, 80, 34, 3, ink);

  return buffer;
}

fs.mkdirSync(HEADS_DIR, { recursive: true });
fs.mkdirSync(BODIES_DIR, { recursive: true });

const kevinBodyOnly = process.argv.includes('--kevin-body-only');
const timmyBodyOnly = process.argv.includes('--timmy-body-only');
const emiBodyOnly = process.argv.includes('--emi-body-only');
const singleBodyOnly = kevinBodyOnly || timmyBodyOnly || emiBodyOnly;

if (!singleBodyOnly) {
  writePng(path.join(HEADS_DIR, 'emi.png'), createEmiHead());
  writePng(path.join(HEADS_DIR, 'timmy.png'), createTimmyHead());
  writePng(path.join(HEADS_DIR, 'kevin.png'), createKevinHead());
  writePng(path.join(BODIES_DIR, 'emi-standing.png'), createStandingBody());
  writePng(path.join(BODIES_DIR, 'timmy-sitting.png'), createSittingBody());
}

if (emiBodyOnly) {
  writePng(path.join(BODIES_DIR, 'emi-standing.png'), createStandingBody());
}

if (timmyBodyOnly) {
  writePng(path.join(BODIES_DIR, 'timmy-sitting.png'), createSittingBody());
}

if (kevinBodyOnly || !singleBodyOnly) {
  writePng(path.join(BODIES_DIR, 'kevin-dog.png'), createDogBody());
}

console.log(
  kevinBodyOnly
    ? 'Regenerated kevin-dog.png'
    : timmyBodyOnly
      ? 'Regenerated timmy-sitting.png'
      : emiBodyOnly
        ? 'Regenerated emi-standing.png'
        : 'Generated character heads and bodies in assets/game/characters/',
);
