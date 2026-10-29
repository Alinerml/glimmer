import type { Glimmer } from '../types';
import { hashString } from './data';

export interface StarPosition {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export interface PlacedStar {
  entry: Glimmer;
  position: StarPosition;
}

export interface StarLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface SkyLayout {
  stars: PlacedStar[];
  lines: StarLine[];
}

function mulberry32(seed: number): () => number {
  let value = seed;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let result = Math.imul(value ^ (value >>> 15), 1 | value);
    result = (result + Math.imul(result ^ (result >>> 7), 61 | result)) ^ result;
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function nearestDistance(x: number, y: number, placed: StarPosition[]): number {
  let nearest = Number.POSITIVE_INFINITY;
  for (const star of placed) {
    const dx = (star.x - x) * 1.55;
    const dy = star.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < nearest) nearest = distance;
  }
  return nearest;
}

/**
 * 星点的位置由内容 id 决定，并用拒绝采样保持间距。
 * 新微光只会追加，所以旧星星不会因为新增记录而移动。
 */
export function buildSkyLayout(entries: Glimmer[]): SkyLayout {
  const placed: StarPosition[] = [];
  const stars: PlacedStar[] = [];
  const minDistance = entries.length > 140 ? 2.9 : entries.length > 70 ? 3.5 : 4.5;

  for (const entry of entries) {
    const random = mulberry32(hashString(entry.id));
    let chosen = { x: 50, y: 41 };
    let bestDistance = -1;

    for (let attempt = 0; attempt < 70; attempt += 1) {
      const angle = random() * Math.PI * 2;
      const radius = Math.sqrt(random()) * 0.94;
      const x = clamp(50 + Math.cos(angle) * radius * 43, 5, 95);
      const y = clamp(41 + Math.sin(angle) * radius * 27, 16, 66);
      const distance = nearestDistance(x, y, placed);
      if (distance > bestDistance) {
        bestDistance = distance;
        chosen = { x, y };
      }
      if (distance >= minDistance) break;
    }

    const size = 4.4 + random() * 3.2;
    const position: StarPosition = {
      x: chosen.x,
      y: chosen.y,
      size,
      delay: -random() * 6,
      duration: 4.6 + random() * 3.4,
    };
    placed.push(position);
    stars.push({ entry, position });
  }

  const lines: StarLine[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < placed.length; index += 1) {
    let closest = -1;
    let closestDistance = Number.POSITIVE_INFINITY;
    for (let other = 0; other < placed.length; other += 1) {
      if (index === other) continue;
      const left = placed[index];
      const right = placed[other];
      const dx = (left.x - right.x) * 1.55;
      const dy = left.y - right.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = other;
      }
    }
    if (closest < 0 || closestDistance > 22) continue;
    const key = index < closest ? `${index}:${closest}` : `${closest}:${index}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const from = placed[index];
    const to = placed[closest];
    lines.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y });
  }

  return { stars, lines };
}
