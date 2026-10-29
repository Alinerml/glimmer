const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export function dayKey(input: number | Date): string {
  const date = new Date(input);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function formatFullDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 · 星期${WEEKDAYS[date.getDay()]}`;
}

export function formatShortDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function relativeLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  if (dayKey(date) === dayKey(today)) return '今天';
  if (dayKey(date) === dayKey(yesterday)) return '昨天';
  if (date.getFullYear() === today.getFullYear()) return formatShortDate(timestamp);
  return `${date.getFullYear()}年${formatShortDate(timestamp)}`;
}

export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return '夜深了';
  if (hour < 9) return '早安';
  if (hour < 12) return '上午好';
  if (hour < 14) return '午安';
  if (hour < 18) return '下午好';
  if (hour < 22) return '晚上好';
  return '夜深了';
}

export function getStreak(entries: Array<{ at: number }>): number {
  if (entries.length === 0) return 0;
  const days = new Set(entries.map((entry) => dayKey(entry.at)));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getDayCount(entries: Array<{ at: number }>): number {
  return new Set(entries.map((entry) => dayKey(entry.at))).size;
}

export function getTodayCount(entries: Array<{ at: number }>): number {
  const today = dayKey(new Date());
  return entries.filter((entry) => dayKey(entry.at) === today).length;
}
