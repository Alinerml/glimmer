import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { MOODS, type Glimmer, type MoodId } from '../types';
import { isNativeShell } from './platform';

const ENTRIES_KEY = 'glimmer.entries.v1';
const ONBOARDING_KEY = 'glimmer.onboarded.v1';
const MOTION_KEY = 'glimmer.calm-motion.v1';
const CODE_PREFIX = 'GLM1.';
const MAX_TEXT = 140;
const MAX_ENTRIES = 3000;

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function makeStableId(at: number, text: string): string {
  return `g_${at.toString(36)}_${hashString(text).toString(36)}`;
}

function isMood(value: unknown): value is MoodId {
  return typeof value === 'string' && MOODS.some((mood) => mood.id === value);
}

export function makeEntry(text: string, mood: MoodId): Glimmer {
  const at = Date.now();
  const clean = text.trim().slice(0, MAX_TEXT);
  const randomId =
    typeof globalThis.crypto?.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : makeStableId(at, clean);
  return { id: randomId, text: clean, mood, at };
}

export function sanitizeEntry(raw: unknown): Glimmer | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const text = typeof record.text === 'string' ? record.text.trim().slice(0, MAX_TEXT) : '';
  if (!text) return null;
  const now = Date.now();
  const rawAt = typeof record.at === 'number' && Number.isFinite(record.at) ? record.at : now;
  const at = rawAt > 946684800000 && rawAt < now + 86400000 ? rawAt : now;
  const mood = isMood(record.mood) ? record.mood : 'calm';
  const id =
    typeof record.id === 'string' && record.id.length > 0 && record.id.length < 96
      ? record.id
      : makeStableId(at, text);
  return { id, text, mood, at };
}

export function sanitizeEntries(raw: unknown): Glimmer[] {
  let source: unknown[] = [];
  if (Array.isArray(raw)) {
    source = raw;
  } else if (raw && typeof raw === 'object') {
    const entries = (raw as { entries?: unknown }).entries;
    if (Array.isArray(entries)) source = entries;
  }
  const output: Glimmer[] = [];
  const ids = new Set<string>();
  const contents = new Set<string>();
  for (const item of source) {
    const entry = sanitizeEntry(item);
    if (!entry) continue;
    const content = contentKey(entry);
    if (ids.has(entry.id) || contents.has(content)) continue;
    ids.add(entry.id);
    contents.add(content);
    output.push(entry);
    if (output.length >= MAX_ENTRIES) break;
  }
  return output;
}

export function loadEntries(): Glimmer[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    if (!raw) return [];
    return sanitizeEntries(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function saveEntries(entries: Glimmer[]): void {
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn('微光：本地存储写入失败', error);
  }
}

function contentKey(entry: Glimmer): string {
  return `${entry.at}|${entry.text}`;
}

export function mergeEntries(current: Glimmer[], incoming: Glimmer[]) {
  const ids = new Set(current.map((entry) => entry.id));
  const contents = new Set(current.map(contentKey));
  const added: Glimmer[] = [];
  for (const entry of incoming) {
    const content = contentKey(entry);
    if (ids.has(entry.id) || contents.has(content)) continue;
    ids.add(entry.id);
    contents.add(content);
    added.push(entry);
  }
  return { entries: [...current, ...added], added: added.length };
}

export function encodeCode(entries: Glimmer[]): string {
  const payload = {
    v: 1,
    a: 'glimmer',
    e: [...entries]
      .sort((left, right) => left.at - right.at)
      .map((entry) => {
        const moodIndex = MOODS.findIndex((mood) => mood.id === entry.mood);
        return [entry.text, moodIndex < 0 ? 0 : moodIndex, entry.at];
      }),
  };
  return `${CODE_PREFIX}${compressToEncodedURIComponent(JSON.stringify(payload))}`;
}

export function decodeCode(input: string): Glimmer[] {
  let code = input.trim();
  const marker = code.indexOf('#s=');
  if (marker >= 0) code = code.slice(marker + 3);
  try {
    code = decodeURIComponent(code);
  } catch {
    // 星语码本身是 URL-safe 的，解码失败时按原文继续。
  }
  code = code.replace(/\s+/g, '');
  if (!code) throw new Error('先粘贴一段星语码吧');
  if (code.startsWith(CODE_PREFIX)) code = code.slice(CODE_PREFIX.length);

  let json: string | null = null;
  try {
    json = decompressFromEncodedURIComponent(code);
  } catch {
    json = null;
  }
  if (!json) throw new Error('这段星语码不完整，请重新复制');

  let payload: unknown;
  try {
    payload = JSON.parse(json);
  } catch {
    throw new Error('这段星语码无法解析');
  }
  if (!payload || typeof payload !== 'object') {
    throw new Error('这段星语码无法解析');
  }
  const record = payload as { v?: unknown; e?: unknown };
  if (record.v !== 1 || !Array.isArray(record.e)) {
    throw new Error('星语码版本不受支持');
  }

  const output: Glimmer[] = [];
  const ids = new Set<string>();
  const contents = new Set<string>();
  for (const row of record.e) {
    if (!Array.isArray(row) || row.length < 3) continue;
    const [text, moodIndex, at] = row;
    if (typeof text !== 'string' || typeof at !== 'number' || !Number.isFinite(at)) continue;
    const mood = typeof moodIndex === 'number' && MOODS[moodIndex] ? MOODS[moodIndex].id : 'calm';
    const entry = sanitizeEntry({ text, mood, at, id: makeStableId(at, text) });
    if (!entry) continue;
    const content = contentKey(entry);
    if (ids.has(entry.id) || contents.has(content)) continue;
    ids.add(entry.id);
    contents.add(content);
    output.push(entry);
    if (output.length >= MAX_ENTRIES) break;
  }
  if (output.length === 0) throw new Error('星语码里没有读到微光');
  return output;
}

export function buildShareLink(code: string): string {
  const configured = import.meta.env.VITE_SHARE_BASE_URL?.trim();
  if (configured) {
    try {
      const base = /^https?:\/\//i.test(configured) ? configured : `https://${configured}`;
      const url = new URL(base);
      url.hash = `s=${code}`;
      return url.toString();
    } catch {
      return '';
    }
  }

  // file://、Capacitor 原生壳的地址都不是其他设备可访问的。
  if (isNativeShell()) return '';
  const { protocol, origin, pathname } = window.location;
  if (protocol !== 'http:' && protocol !== 'https:') return '';
  if (origin === 'https://localhost') return '';
  const params = new URLSearchParams(window.location.search);
  params.delete('demo');
  const query = params.toString();
  return `${origin}${pathname}${query ? `?${query}` : ''}#s=${code}`;
}

export function loadOnboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveOnboarded(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, '1');
  } catch {
    // 忽略隐私模式下的写入失败。
  }
}

export function loadCalmMotion(): boolean {
  try {
    return localStorage.getItem(MOTION_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveCalmMotion(value: boolean): void {
  try {
    localStorage.setItem(MOTION_KEY, value ? '1' : '0');
  } catch {
    // 忽略隐私模式下的写入失败。
  }
}
