export const MOODS = [
  {
    id: 'calm',
    label: '静谧',
    hint: '像水面一样安静',
    color: '#78e3d2',
    soft: 'rgba(120, 227, 210, 0.14)',
  },
  {
    id: 'joy',
    label: '雀跃',
    hint: '有一点小小的开心',
    color: '#ffd37d',
    soft: 'rgba(255, 211, 125, 0.14)',
  },
  {
    id: 'love',
    label: '心动',
    hint: '心里轻轻动了一下',
    color: '#ff9fbd',
    soft: 'rgba(255, 159, 189, 0.14)',
  },
  {
    id: 'tired',
    label: '疲惫',
    hint: '今天真的有点累',
    color: '#a9adff',
    soft: 'rgba(169, 173, 255, 0.14)',
  },
  {
    id: 'spark',
    label: '灵感',
    hint: '忽然亮起一个念头',
    color: '#b8f18d',
    soft: 'rgba(184, 241, 141, 0.14)',
  },
] as const;

export type MoodId = (typeof MOODS)[number]['id'];

export interface Glimmer {
  id: string;
  text: string;
  mood: MoodId;
  at: number;
}

export const MOOD_IDS: MoodId[] = MOODS.map((mood) => mood.id);

export function moodOf(id: string) {
  return MOODS.find((mood) => mood.id === id) ?? MOODS[0];
}
