let audioContext: AudioContext | null = null;

/**
 * 点亮微光时的一枚轻响。
 * 用 Web Audio 合成，不依赖音频文件，也不会走网络。
 */
export function playAddChime(): void {
  try {
    const AudioCtor =
      window.AudioContext ??
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;

    audioContext ??= new AudioCtor();
    const context = audioContext;
    if (context.state === 'suspended') {
      void context.resume().catch(() => {});
    }

    const start = context.currentTime + 0.02;
    const output = context.createGain();
    output.gain.setValueAtTime(0.9, start);
    output.connect(context.destination);

    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, start);
    filter.frequency.exponentialRampToValueAtTime(1800, start + 1.05);
    filter.Q.setValueAtTime(0.4, start);
    filter.connect(output);

    const notes = [
      { frequency: 659.25, delay: 0, duration: 0.9, level: 0.1 },
      { frequency: 987.77, delay: 0.075, duration: 1.05, level: 0.06 },
    ];

    for (const note of notes) {
      const at = start + note.delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(note.frequency, at);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(note.level, at + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + note.duration);
      oscillator.connect(gain);
      gain.connect(filter);
      oscillator.start(at);
      oscillator.stop(at + note.duration + 0.03);
    }
  } catch {
    // 浏览器禁用音频或环境不支持 Web Audio 时，安静地跳过。
  }
}
