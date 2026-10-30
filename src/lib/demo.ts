import type { Glimmer, MoodId } from '../types';

const DEMO_PARAM = 'demo';

/** 只有显式带上 ?demo=1 才进入演示模式，正常访问不受影响。 */
export function isDemoRequested(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const value = new URLSearchParams(window.location.search).get(DEMO_PARAM);
    return value === '1' || value === 'true';
  } catch {
    return false;
  }
}

interface DemoSeed {
  daysAgo: number;
  hour: number;
  minute: number;
  text: string;
  mood: MoodId;
}

const SEEDS: DemoSeed[] = [
  {
    daysAgo: 4,
    hour: 9,
    minute: 20,
    text: '把房间收拾干净，给自己泡了杯茶。',
    mood: 'calm',
  },
  {
    daysAgo: 4,
    hour: 13,
    minute: 40,
    text: '第一次做的菜居然很好吃，值得记一颗星。',
    mood: 'joy',
  },
  {
    daysAgo: 4,
    hour: 22,
    minute: 10,
    text: '夜里听见远处的火车声，像有人在替我去远方。',
    mood: 'love',
  },
  {
    daysAgo: 3,
    hour: 10,
    minute: 5,
    text: '下雨，哪也没去，把旧照片翻了一遍。',
    mood: 'calm',
  },
  {
    daysAgo: 3,
    hour: 16,
    minute: 30,
    text: '走过一条没走过的小路，尽头有家亮着灯的面包店。',
    mood: 'spark',
  },
  {
    daysAgo: 3,
    hour: 23,
    minute: 15,
    text: '加班到很晚，抬头看见月亮，突然没那么累了。',
    mood: 'tired',
  },
  {
    daysAgo: 2,
    hour: 9,
    minute: 10,
    text: '今天的咖啡刚刚好，不苦，也不急。',
    mood: 'calm',
  },
  {
    daysAgo: 2,
    hour: 12,
    minute: 45,
    text: '地铁上有人给老人让座，我偷偷开心了一下。',
    mood: 'joy',
  },
  {
    daysAgo: 2,
    hour: 20,
    minute: 20,
    text: '收到朋友寄来的明信片，字还是那么好看。',
    mood: 'love',
  },
  {
    daysAgo: 1,
    hour: 18,
    minute: 40,
    text: '傍晚的云像被人打翻的橘子汽水。',
    mood: 'love',
  },
  {
    daysAgo: 1,
    hour: 21,
    minute: 5,
    text: '会议结束后在楼下走了十分钟，什么也没想。',
    mood: 'tired',
  },
  {
    daysAgo: 1,
    hour: 23,
    minute: 30,
    text: '想到一个很喜欢的标题，先记下来。',
    mood: 'spark',
  },
];

function dayTimestamp(now: Date, daysAgo: number, hour: number, minute: number): number {
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - daysAgo,
    hour,
    minute,
    0,
    0,
  ).getTime();
}

/**
 * 生成 14 束示例微光，覆盖连续 5 天，其中今天 2 束。
 * 数据只存在于内存中，不读取也不写入 localStorage。
 */
export function buildDemoEntries(now = new Date()): Glimmer[] {
  const entries: Glimmer[] = SEEDS.map((seed, index) => ({
    id: `demo-${String(index + 1).padStart(2, '0')}`,
    text: seed.text,
    mood: seed.mood,
    at: dayTimestamp(now, seed.daysAgo, seed.hour, seed.minute),
  }));

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const nowAt = now.getTime();
  const firstToday = Math.max(startOfToday, nowAt - 50 * 60 * 1000);
  const secondToday = Math.max(firstToday + 1000, nowAt - 4 * 60 * 1000);

  entries.push(
    {
      id: 'demo-13',
      text: '把窗开了一条缝，风里有桂花和晚饭的味道。',
      mood: 'calm',
      at: firstToday,
    },
    {
      id: 'demo-14',
      text: '终于把拖了三天的那件小事做完了，心里轻了一格。',
      mood: 'joy',
      at: secondToday,
    },
  );

  return entries;
}
