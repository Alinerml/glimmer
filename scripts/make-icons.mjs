import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const outputDir = fileURLToPath(new URL('../public/icons/', import.meta.url));
await mkdir(outputDir, { recursive: true });

function iconSvg({ maskable = false } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0d1730"/>
        <stop offset="0.55" stop-color="#070c18"/>
        <stop offset="1" stop-color="#03050b"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="42%" r="58%">
        <stop offset="0" stop-color="#7fe7d8" stop-opacity="0.3"/>
        <stop offset="0.55" stop-color="#537dd8" stop-opacity="0.11"/>
        <stop offset="1" stop-color="#7fe7d8" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="star" x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0" stop-color="#fffbe8"/>
        <stop offset="0.42" stop-color="#b9fff2"/>
        <stop offset="1" stop-color="#8fb6ff"/>
      </linearGradient>
      <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="16"/>
      </filter>
    </defs>
    <rect width="512" height="512" ${maskable ? '' : 'rx="114"'} fill="url(#bg)"/>
    <circle cx="256" cy="238" r="214" fill="url(#glow)"/>
    <g ${maskable ? 'transform="translate(256 256) scale(0.76) translate(-256 -256)"' : ''}>
      <circle cx="256" cy="256" r="156" fill="none" stroke="#cfe8ff" stroke-opacity="0.12"/>
      <circle cx="256" cy="256" r="202" fill="none" stroke="#cfe8ff" stroke-opacity="0.05"/>
      <path d="M256 112c10 88 29 107 117 117-88 10-107 29-117 117-10-88-29-107-117-117 88-10 107-29 117-117Z"
        fill="#8ff0df" opacity="0.38" filter="url(#soft)"/>
      <path d="M256 112c10 88 29 107 117 117-88 10-107 29-117 117-10-88-29-107-117-117 88-10 107-29 117-117Z"
        fill="url(#star)"/>
      <circle cx="382" cy="148" r="5" fill="#ffd88a"/>
      <circle cx="142" cy="364" r="3.4" fill="#a9c7ff"/>
      <circle cx="386" cy="352" r="3" fill="#b9fff2" opacity="0.8"/>
    </g>
  </svg>`;
}

const rounded = Buffer.from(iconSvg());
const maskable = Buffer.from(iconSvg({ maskable: true }));

await Promise.all([
  sharp(rounded).resize(192, 192).png().toFile(path.join(outputDir, 'icon-192.png')),
  sharp(rounded).resize(512, 512).png().toFile(path.join(outputDir, 'icon-512.png')),
  sharp(maskable).resize(512, 512).png().toFile(path.join(outputDir, 'icon-maskable-512.png')),
  sharp(maskable).resize(180, 180).png().toFile(path.join(outputDir, 'apple-touch-icon.png')),
  sharp(maskable).resize(1024, 1024).png().toFile(path.join(outputDir, 'icon-1024.png')),
]);

console.log('Generated Glimmer app icons in public/icons');
