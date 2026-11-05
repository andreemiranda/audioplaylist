const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Vector SVG Icon
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#032541"/>
    </linearGradient>
    <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="50%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  
  <!-- Subtle Outer Neon Border -->
  <rect x="12" y="12" width="488" height="488" rx="100" fill="none" stroke="url(#glowGrad)" stroke-width="6" opacity="0.7"/>

  <!-- Glowing Aura -->
  <circle cx="256" cy="256" r="140" fill="#06b6d4" opacity="0.15" filter="url(#glow)"/>

  <!-- Headphones Arc -->
  <path d="M 128 256 A 128 128 0 0 1 384 256" fill="none" stroke="url(#glowGrad)" stroke-width="24" stroke-linecap="round"/>

  <!-- Left Headphone Earpad -->
  <rect x="108" y="240" width="40" height="74" rx="18" fill="url(#goldGrad)"/>
  <rect x="120" y="254" width="16" height="46" rx="8" fill="#ffffff" opacity="0.8"/>

  <!-- Right Headphone Earpad -->
  <rect x="364" y="240" width="40" height="74" rx="18" fill="url(#goldGrad)"/>
  <rect x="376" y="254" width="16" height="46" rx="8" fill="#ffffff" opacity="0.8"/>

  <!-- Open Book in Center -->
  <g transform="translate(166, 230) scale(0.9)">
    <!-- Book Left Page -->
    <path d="M 100 130 C 65 110, 25 110, 0 120 L 0 30 C 25 20, 65 20, 100 40 Z" fill="#ffffff" fill-opacity="0.95"/>
    <!-- Book Right Page -->
    <path d="M 100 130 C 135 110, 175 110, 200 120 L 200 30 C 175 20, 135 20, 100 40 Z" fill="#38bdf8" fill-opacity="0.95"/>
    <!-- Spine Line -->
    <line x1="100" y1="40" x2="100" y2="135" stroke="#0284c7" stroke-width="4" stroke-linecap="round"/>
  </g>

  <!-- Dynamic Sound Wave Bars Beneath Book -->
  <g transform="translate(196, 385)">
    <rect x="0" y="10" width="8" height="25" rx="4" fill="#06b6d4"/>
    <rect x="16" y="0" width="8" height="45" rx="4" fill="#38bdf8"/>
    <rect x="32" y="8" width="8" height="30" rx="4" fill="#60a5fa"/>
    <rect x="48" y="14" width="8" height="18" rx="4" fill="#06b6d4"/>
    <rect x="64" y="4" width="8" height="38" rx="4" fill="#38bdf8"/>
    <rect x="80" y="12" width="8" height="22" rx="4" fill="#60a5fa"/>
    <rect x="96" y="18" width="8" height="12" rx="4" fill="#06b6d4"/>
    <rect x="112" y="6" width="8" height="34" rx="4" fill="#38bdf8"/>
  </g>
</svg>`;

// 2. Maskable Icon with 15% safe padding
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#032541"/>
    </linearGradient>
    <linearGradient id="mglow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <linearGradient id="mgold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>

  <!-- Full-bleed background for maskable cropping -->
  <rect width="512" height="512" fill="url(#mbg)"/>

  <!-- Content scaled to safe zone (80% inside) -->
  <g transform="translate(51, 51) scale(0.8)">
    <circle cx="256" cy="256" r="140" fill="#06b6d4" opacity="0.2"/>

    <!-- Headphones Arc -->
    <path d="M 128 256 A 128 128 0 0 1 384 256" fill="none" stroke="url(#mglow)" stroke-width="26" stroke-linecap="round"/>

    <!-- Earpads -->
    <rect x="106" y="238" width="44" height="78" rx="20" fill="url(#mgold)"/>
    <rect x="362" y="238" width="44" height="78" rx="20" fill="url(#mgold)"/>

    <!-- Open Book in Center -->
    <g transform="translate(166, 230) scale(0.9)">
      <path d="M 100 130 C 65 110, 25 110, 0 120 L 0 30 C 25 20, 65 20, 100 40 Z" fill="#ffffff"/>
      <path d="M 100 130 C 135 110, 175 110, 200 120 L 200 30 C 175 20, 135 20, 100 40 Z" fill="#38bdf8"/>
      <line x1="100" y1="40" x2="100" y2="135" stroke="#0284c7" stroke-width="4"/>
    </g>

    <!-- Sound Wave Bars -->
    <g transform="translate(196, 385)">
      <rect x="0" y="10" width="8" height="25" rx="4" fill="#06b6d4"/>
      <rect x="16" y="0" width="8" height="45" rx="4" fill="#38bdf8"/>
      <rect x="32" y="8" width="8" height="30" rx="4" fill="#60a5fa"/>
      <rect x="48" y="14" width="8" height="18" rx="4" fill="#06b6d4"/>
      <rect x="64" y="4" width="8" height="38" rx="4" fill="#38bdf8"/>
      <rect x="80" y="12" width="8" height="22" rx="4" fill="#60a5fa"/>
      <rect x="96" y="18" width="8" height="12" rx="4" fill="#06b6d4"/>
      <rect x="112" y="6" width="8" height="34" rx="4" fill="#38bdf8"/>
    </g>
  </g>
</svg>`;

// 3. OpenGraph 1200x630 Card SVG
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="ogbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080e1a"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#022c43"/>
    </linearGradient>
    <linearGradient id="ogtext" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#ogbg)"/>
  
  <!-- Subtle Grid/Accent Lines -->
  <circle cx="1050" cy="150" r="300" fill="#06b6d4" opacity="0.08"/>
  <circle cx="150" cy="500" r="250" fill="#3b82f6" opacity="0.08"/>

  <!-- Left: Cover Badge / Logo Box -->
  <g transform="translate(100, 115)">
    <rect width="400" height="400" rx="48" fill="#1e293b" stroke="#334155" stroke-width="4"/>
    
    <!-- Headphones & Book -->
    <path d="M 100 210 A 100 100 0 0 1 300 210" fill="none" stroke="#38bdf8" stroke-width="20" stroke-linecap="round"/>
    <rect x="80" y="195" width="34" height="64" rx="14" fill="#06b6d4"/>
    <rect x="286" y="195" width="34" height="64" rx="14" fill="#06b6d4"/>
    
    <!-- Center Book -->
    <g transform="translate(130, 185) scale(0.7)">
      <path d="M 100 130 C 65 110, 25 110, 0 120 L 0 30 C 25 20, 65 20, 100 40 Z" fill="#ffffff"/>
      <path d="M 100 130 C 135 110, 175 110, 200 120 L 200 30 C 175 20, 135 20, 100 40 Z" fill="#38bdf8"/>
    </g>

    <!-- Soundwave -->
    <g transform="translate(150, 310)">
      <rect x="0" y="8" width="6" height="20" rx="3" fill="#06b6d4"/>
      <rect x="12" y="0" width="6" height="35" rx="3" fill="#38bdf8"/>
      <rect x="24" y="6" width="6" height="24" rx="3" fill="#60a5fa"/>
      <rect x="36" y="12" width="6" height="14" rx="3" fill="#06b6d4"/>
      <rect x="48" y="2" width="6" height="30" rx="3" fill="#38bdf8"/>
      <rect x="60" y="10" width="6" height="18" rx="3" fill="#60a5fa"/>
      <rect x="72" y="14" width="6" height="10" rx="3" fill="#06b6d4"/>
      <rect x="84" y="4" width="6" height="28" rx="3" fill="#38bdf8"/>
    </g>
  </g>

  <!-- Right: Typography & Meta -->
  <g transform="translate(560, 150)">
    <!-- Category Pill -->
    <rect x="0" y="0" width="220" height="38" rx="19" fill="#083344" stroke="#0e7490" stroke-width="2"/>
    <text x="24" y="24" fill="#22d3ee" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" letter-spacing="2">AUDIOBOOK OFICIAL</text>

    <!-- Main Title -->
    <text x="0" y="110" fill="#ffffff" font-family="system-ui, sans-serif" font-size="56" font-weight="900" letter-spacing="-1">O Mapa do Sucesso</text>
    
    <!-- Author byline -->
    <text x="0" y="175" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="28" font-weight="500">Por <tspan fill="#38bdf8" font-weight="bold">Lourivan Catsro</tspan></text>

    <!-- Description -->
    <text x="0" y="240" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="20" font-weight="400">39 Capítulos narrados com reprodução contínua,</text>
    <text x="0" y="270" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="20" font-weight="400">controle de velocidade, busca e marcadores.</text>

    <!-- Features / Highlights -->
    <g transform="translate(0, 315)">
      <rect x="0" y="0" width="130" height="36" rx="10" fill="#1e293b"/>
      <text x="18" y="23" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">39 FAIXAS</text>

      <rect x="145" y="0" width="165" height="36" rx="10" fill="#1e293b"/>
      <text x="18" y="23" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">AUTOPLAY CONTÍNUO</text>

      <rect x="325" y="0" width="130" height="36" rx="10" fill="#1e293b"/>
      <text x="24" y="23" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="14" font-weight="bold">PWA APP</text>
    </g>
  </g>
</svg>`;

// 4. Square Cover 800x800 Artwork (JPEG/PNG)
const coverSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="cbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="45%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#032541"/>
    </linearGradient>
    <linearGradient id="cglow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>

  <rect width="800" height="800" fill="url(#cbg)"/>
  <circle cx="400" cy="330" r="220" fill="#06b6d4" opacity="0.12"/>

  <!-- Headphones & Book -->
  <g transform="translate(180, 110)">
    <path d="M 120 220 A 120 120 0 0 1 320 220" fill="none" stroke="url(#cglow)" stroke-width="26" stroke-linecap="round"/>
    <rect x="98" y="200" width="40" height="78" rx="18" fill="#38bdf8"/>
    <rect x="302" y="200" width="40" height="78" rx="18" fill="#38bdf8"/>

    <g transform="translate(145, 195) scale(0.75)">
      <path d="M 100 130 C 65 110, 25 110, 0 120 L 0 30 C 25 20, 65 20, 100 40 Z" fill="#ffffff"/>
      <path d="M 100 130 C 135 110, 175 110, 200 120 L 200 30 C 175 20, 135 20, 100 40 Z" fill="#38bdf8"/>
      <line x1="100" y1="40" x2="100" y2="135" stroke="#0284c7" stroke-width="4"/>
    </g>
  </g>

  <!-- Typography -->
  <text x="400" y="520" text-anchor="middle" fill="#22d3ee" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" letter-spacing="6">AUDIOBOOK OFICIAL</text>
  <text x="400" y="590" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="52" font-weight="900" letter-spacing="-1">O Mapa do Sucesso</text>
  <text x="400" y="650" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="26" font-weight="500">Por <tspan fill="#38bdf8" font-weight="bold">Lourivan Catsro</tspan></text>
  <text x="400" y="710" text-anchor="middle" fill="#64748b" font-family="system-ui, sans-serif" font-size="18" font-weight="600">39 CAPÍTULOS • NARRADO EM PORTUGUÊS</text>
</svg>`;

async function buildAssets() {
  console.log('Generating image assets...');

  // 1. Write SVG icons
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSvg);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), iconSvg);

  // 2. Generate PNG PWA icons
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  await sharp(Buffer.from(iconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));

  // 3. Apple touch icon & favicons
  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(Buffer.from(iconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));

  await sharp(Buffer.from(iconSvg))
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));

  // 4. Generate favicon.ico (using 32x32 PNG container)
  await sharp(Buffer.from(iconSvg))
    .resize(32, 32)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));

  // 5. OpenGraph 1200x630 PNG card
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png({ quality: 90 })
    .toFile(path.join(publicDir, 'og-cover.png'));

  // 6. Cover Artwork JPEG and PNG (800x800)
  await sharp(Buffer.from(coverSvg))
    .resize(800, 800)
    .jpeg({ quality: 92 })
    .toFile(path.join(publicDir, 'cover.jpg'));

  await sharp(Buffer.from(coverSvg))
    .resize(800, 800)
    .png()
    .toFile(path.join(publicDir, 'cover.png'));

  console.log('All icons, covers, favicons and SVG/PNG/JPEG assets generated successfully!');
}

buildAssets().catch((err) => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});
