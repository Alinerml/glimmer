import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const androidRes = path.join(root, 'android/app/src/main/res');
const iosAssets = path.join(root, 'ios/App/App/Assets.xcassets');

const STAR =
  'M256 112c10 88 29 107 117 117-88 10-107 29-117 117-10-88-29-107-117-117 88-10 107-29 117-117Z';

const palettes = {
  bg: ['#0d1730', '#070c18', '#03050b'],
  star: ['#fffbe8', '#b9fff2', '#8fb6ff'],
};

function defs() {
  return `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${palettes.bg[0]}"/>
        <stop offset="0.55" stop-color="${palettes.bg[1]}"/>
        <stop offset="1" stop-color="${palettes.bg[2]}"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="42%" r="58%">
        <stop offset="0" stop-color="#7fe7d8" stop-opacity="0.3"/>
        <stop offset="0.55" stop-color="#537dd8" stop-opacity="0.11"/>
        <stop offset="1" stop-color="#7fe7d8" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="star" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stop-color="${palettes.star[0]}"/>
        <stop offset="0.42" stop-color="${palettes.star[1]}"/>
        <stop offset="1" stop-color="${palettes.star[2]}"/>
      </linearGradient>
      <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="16"/>
      </filter>
    </defs>`;
}

function mark({ rings = true } = {}) {
  return `
    <circle cx="256" cy="238" r="214" fill="url(#glow)"/>
    ${
      rings
        ? `<circle cx="256" cy="256" r="156" fill="none" stroke="#cfe8ff" stroke-opacity="0.12"/>
           <circle cx="256" cy="256" r="202" fill="none" stroke="#cfe8ff" stroke-opacity="0.05"/>`
        : ''
    }
    <path d="${STAR}" fill="#8ff0df" opacity="0.38" filter="url(#soft)"/>
    <path d="${STAR}" fill="url(#star)"/>
    <circle cx="382" cy="148" r="5" fill="#ffd88a"/>
    <circle cx="142" cy="364" r="3.4" fill="#a9c7ff"/>
    <circle cx="386" cy="352" r="3" fill="#b9fff2" opacity="0.8"/>`;
}

function appIcon({ square = false, circle = false } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    ${defs()}
    ${
      circle
        ? `<defs><clipPath id="round"><circle cx="256" cy="256" r="256"/></clipPath></defs>
           <g clip-path="url(#round)"><rect width="512" height="512" fill="url(#bg)"/>${mark()}</g>`
        : `<rect width="512" height="512" ${square ? '' : 'rx="114"'} fill="url(#bg)"/>${mark()}`
    }
  </svg>`;
}

function adaptiveForeground() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    ${defs()}
    ${mark()}
  </svg>`;
}

function splash(width, height, { showTagline = true } = {}) {
  const min = Math.min(width, height);
  const markSize = min * 0.34;
  const cx = width / 2;
  const cy = height / 2 - min * 0.035;
  const titleY = cy + markSize * 0.78;
  const titleSize = min * 0.088;
  const latinY = titleY + titleSize * 0.72;
  const latinSize = min * 0.026;
  const taglineY = latinY + latinSize * 2.7;
  const taglineSize = min * 0.027;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <radialGradient id="aurora" cx="50%" cy="38%" r="62%">
        <stop offset="0" stop-color="#173b56" stop-opacity="0.55"/>
        <stop offset="0.5" stop-color="#0a1a33" stop-opacity="0.32"/>
        <stop offset="1" stop-color="#04060d" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glow" cx="50%" cy="42%" r="58%">
        <stop offset="0" stop-color="#7fe7d8" stop-opacity="0.3"/>
        <stop offset="0.55" stop-color="#537dd8" stop-opacity="0.11"/>
        <stop offset="1" stop-color="#7fe7d8" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="star" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stop-color="${palettes.star[0]}"/>
        <stop offset="0.42" stop-color="${palettes.star[1]}"/>
        <stop offset="1" stop-color="${palettes.star[2]}"/>
      </linearGradient>
      <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="16"/>
      </filter>
    </defs>
    <rect width="${width}" height="${height}" fill="#04060d"/>
    <rect width="${width}" height="${height}" fill="url(#aurora)"/>
    <g transform="translate(${cx} ${cy}) scale(${markSize / 512}) translate(-256 -256)">
      <circle cx="256" cy="238" r="214" fill="url(#glow)"/>
      <circle cx="256" cy="256" r="156" fill="none" stroke="#cfe8ff" stroke-opacity="0.12"/>
      <circle cx="256" cy="256" r="202" fill="none" stroke="#cfe8ff" stroke-opacity="0.05"/>
      <path d="${STAR}" fill="#8ff0df" opacity="0.38" filter="url(#soft)"/>
      <path d="${STAR}" fill="url(#star)"/>
    </g>
    <text x="${cx}" y="${titleY}" text-anchor="middle"
      font-family="Georgia, 'Noto Serif SC', 'Songti SC', SimSun, serif"
      font-size="${titleSize}" letter-spacing="${titleSize * 0.18}" fill="#f4f8ff">微光</text>
    <text x="${cx}" y="${latinY}" text-anchor="middle"
      font-family="Georgia, 'Times New Roman', serif"
      font-size="${latinSize}" letter-spacing="${latinSize * 0.52}" fill="#9db6cf">GLIMMER</text>
    ${
      showTagline
        ? `<text x="${cx}" y="${taglineY}" text-anchor="middle"
             font-family="'Noto Serif SC', 'Songti SC', SimSun, serif"
             font-size="${taglineSize}" letter-spacing="${taglineSize * 0.16}" fill="#5f7894">把日子，过成星河</text>`
        : ''
    }
  </svg>`;
}

async function writePng(svg, file, width, height) {
  await mkdir(path.dirname(file), { recursive: true });
  await sharp(Buffer.from(svg))
    .resize(width, height, { fit: 'fill' })
    .png()
    .toFile(file);
}

async function writeOpaquePng(svg, file, width, height) {
  await mkdir(path.dirname(file), { recursive: true });
  await sharp(Buffer.from(svg))
    .resize(width, height, { fit: 'fill' })
    .flatten({ background: '#04060d' })
    .removeAlpha()
    .png()
    .toFile(file);
}

const androidIcons = [
  ['mdpi', 48, 108],
  ['hdpi', 72, 162],
  ['xhdpi', 96, 216],
  ['xxhdpi', 144, 324],
  ['xxxhdpi', 192, 432],
];

const legacy = Buffer.from(appIcon({ square: true }));
const round = Buffer.from(appIcon({ circle: true }));
const foreground = Buffer.from(adaptiveForeground());

await Promise.all(
  androidIcons.flatMap(([density, iconSize, foregroundSize]) => {
    const dir = path.join(androidRes, `mipmap-${density}`);
    return [
      sharp(legacy).resize(iconSize, iconSize).png().toFile(path.join(dir, 'ic_launcher.png')),
      sharp(round).resize(iconSize, iconSize).png().toFile(path.join(dir, 'ic_launcher_round.png')),
      sharp(foreground)
        .resize(foregroundSize, foregroundSize)
        .png()
        .toFile(path.join(dir, 'ic_launcher_foreground.png')),
    ];
  }),
);

const androidSplashes = [
  ['drawable/splash.png', 480, 320, false],
  ['drawable-port-mdpi/splash.png', 320, 480, false],
  ['drawable-port-hdpi/splash.png', 480, 800, false],
  ['drawable-port-xhdpi/splash.png', 720, 1280, true],
  ['drawable-port-xxhdpi/splash.png', 960, 1600, true],
  ['drawable-port-xxxhdpi/splash.png', 1280, 1920, true],
  ['drawable-land-mdpi/splash.png', 480, 320, false],
  ['drawable-land-hdpi/splash.png', 800, 480, false],
  ['drawable-land-xhdpi/splash.png', 1280, 720, true],
  ['drawable-land-xxhdpi/splash.png', 1600, 960, true],
  ['drawable-land-xxxhdpi/splash.png', 1920, 1280, true],
];

await Promise.all(
  androidSplashes.map(([file, width, height, showTagline]) =>
    writePng(splash(width, height, { showTagline }), path.join(androidRes, file), width, height),
  ),
);

await writePng(
  adaptiveForeground(),
  path.join(androidRes, 'drawable-nodpi/splash_icon.png'),
  512,
  512,
);

await writeOpaquePng(
  appIcon({ square: true }),
  path.join(iosAssets, 'AppIcon.appiconset/AppIcon-512@2x.png'),
  1024,
  1024,
);

const iosSplash = path.join(iosAssets, 'Splash.imageset');
await writePng(splash(2732, 2732), path.join(iosSplash, 'splash-2732x2732.png'), 2732, 2732);
await copyFile(path.join(iosSplash, 'splash-2732x2732.png'), path.join(iosSplash, 'splash-2732x2732-1.png'));
await copyFile(path.join(iosSplash, 'splash-2732x2732.png'), path.join(iosSplash, 'splash-2732x2732-2.png'));

console.log('Generated Android launcher icons, splash screens and iOS app assets.');
