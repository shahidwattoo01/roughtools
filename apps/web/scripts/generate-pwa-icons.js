// One-off script: generates all PWA icons + screenshots from scratch using canvas
// Run from apps/web/: node scripts/generate-pwa-icons.js

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT, 'public', 'icons');
const SCREENSHOTS_DIR = path.join(ROOT, 'public', 'screenshots');

fs.mkdirSync(ICONS_DIR, { recursive: true });
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

function savePng(canvas, filePath) {
  fs.writeFileSync(filePath, canvas.toBuffer('image/png'));
  console.log('  OK', path.relative(ROOT, filePath));
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Draws the RoughTools brand icon: indigo square with "RT" monogram
function drawBrandIcon(ctx, size, maskable = false) {
  const pad = maskable ? Math.round(size * 0.12) : 0;
  const innerSize = size - pad * 2;
  const radius = Math.round(innerSize * 0.22);

  // Background square
  roundedRect(ctx, pad, pad, innerSize, innerSize, radius);
  const grad = ctx.createLinearGradient(pad, pad, pad + innerSize, pad + innerSize);
  grad.addColorStop(0, '#6366f1');
  grad.addColorStop(1, '#4f46e5');
  ctx.fillStyle = grad;
  ctx.fill();

  // "RT" monogram
  ctx.fillStyle = '#ffffff';
  const fontSize = Math.round(innerSize * 0.44);
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RT', pad + innerSize / 2, pad + innerSize / 2 + Math.round(innerSize * 0.02));
}

function makeAppIcon(size, filePath, maskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  if (maskable) {
    // Maskable: fill entire canvas with brand color first (safe zone compliance)
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(0, 0, size, size);
  }

  drawBrandIcon(ctx, size, maskable);
  savePng(canvas, filePath);
}

function makeShortcutIcon(size, bgColor, label, filePath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  roundedRect(ctx, 0, 0, size, size, Math.round(size * 0.22));
  ctx.fillStyle = bgColor;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  const fontSize = Math.round(size * (label.length <= 2 ? 0.38 : 0.28));
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, size / 2, size / 2 + 1);

  savePng(canvas, filePath);
}

function makeScreenshot(w, h, filePath) {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  const isMobile = w < 500;

  // Page background
  ctx.fillStyle = '#f5f5ff';
  ctx.fillRect(0, 0, w, h);

  // Nav bar
  const navH = Math.round(h * 0.07);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, navH);
  ctx.fillStyle = '#e5e7eb';
  ctx.fillRect(0, navH, w, 1);

  // Logo text in nav
  ctx.fillStyle = '#6366f1';
  ctx.font = `bold ${Math.round(navH * 0.45)}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('RoughTools', w * 0.04, navH / 2);

  // Hero section
  const heroY = navH + h * 0.1;
  const titleFont = Math.round(h * (isMobile ? 0.045 : 0.06));
  ctx.fillStyle = '#1e1b4b';
  ctx.font = `bold ${titleFont}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('600+ Free Online Tools', w / 2, heroY + titleFont);

  const subFont = Math.round(h * (isMobile ? 0.028 : 0.03));
  ctx.fillStyle = '#6b7280';
  ctx.font = `${subFont}px sans-serif`;
  ctx.fillText('PDF  ·  Calculator  ·  Developer  ·  Converter', w / 2, heroY + titleFont + subFont * 2.2);

  // CTA button
  const btnH = Math.round(h * 0.055);
  const btnW = Math.round(w * (isMobile ? 0.6 : 0.28));
  const btnX = (w - btnW) / 2;
  const btnY = heroY + titleFont + subFont * 4;
  roundedRect(ctx, btnX, btnY, btnW, btnH, btnH / 2);
  ctx.fillStyle = '#6366f1';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.round(btnH * 0.42)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Explore Tools', w / 2, btnY + btnH / 2);

  // Tool category cards
  const cols = isMobile ? 2 : 4;
  const cardMargin = w * 0.04;
  const cardW = (w - cardMargin * (cols + 1)) / cols;
  const cardH = cardW * 0.65;
  const cardStartY = btnY + btnH + h * 0.06;
  const cards = [
    { color: '#ede9fe', label: 'PDF Tools' },
    { color: '#dbeafe', label: 'Calculators' },
    { color: '#d1fae5', label: 'Developer' },
    { color: '#fef3c7', label: 'Converters' },
  ];

  for (let i = 0; i < cols; i++) {
    const cx = cardMargin + i * (cardW + cardMargin);
    roundedRect(ctx, cx, cardStartY, cardW, cardH, cardW * 0.1);
    ctx.fillStyle = cards[i].color;
    ctx.fill();
    ctx.fillStyle = '#374151';
    ctx.font = `bold ${Math.round(cardH * 0.2)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cards[i].label, cx + cardW / 2, cardStartY + cardH / 2);
  }

  savePng(canvas, filePath);
}

function run() {
  console.log('Generating app icons (all sizes):');
  for (const size of [72, 96, 128, 144, 152, 192, 384, 512]) {
    makeAppIcon(size, path.join(ICONS_DIR, `icon-${size}x${size}.png`));
  }
  makeAppIcon(192, path.join(ICONS_DIR, 'icon-192x192-maskable.png'), true);
  makeAppIcon(512, path.join(ICONS_DIR, 'icon-512x512-maskable.png'), true);

  // Also regenerate the two legacy-named files so they're real PNGs
  makeAppIcon(192, path.join(ICONS_DIR, 'icon-192.png'));
  makeAppIcon(512, path.join(ICONS_DIR, 'icon-512.png'));

  console.log('\nGenerating shortcut icons:');
  makeShortcutIcon(96, '#ef4444', 'PDF', path.join(ICONS_DIR, 'shortcut-pdf.png'));
  makeShortcutIcon(96, '#3b82f6', 'Calc', path.join(ICONS_DIR, 'shortcut-calc.png'));
  makeShortcutIcon(96, '#10b981', 'Dev', path.join(ICONS_DIR, 'shortcut-dev.png'));
  makeShortcutIcon(96, '#f59e0b', 'JSON', path.join(ICONS_DIR, 'shortcut-json.png'));

  console.log('\nGenerating screenshots:');
  makeScreenshot(1280, 800, path.join(SCREENSHOTS_DIR, 'desktop-home.png'));
  makeScreenshot(390, 844, path.join(SCREENSHOTS_DIR, 'mobile-home.png'));

  console.log('\nAll done!');
}

run();
