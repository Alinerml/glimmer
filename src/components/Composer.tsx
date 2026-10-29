import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { MOODS, moodOf, type MoodId } from '../types';
import { greeting } from '../lib/date';
import { playAddChime } from '../lib/sound';
import { MoodGlyph, SparkIcon } from './Icons';

interface ComposerProps {
  total: number;
  streak: number;
  todayCount: number;
  onAdd: (text: string, mood: MoodId) => void;
}

export function Composer({ total, streak, todayCount, onAdd }: ComposerProps) {
  const [text, setText] = useState('');
  const [mood, setMood] = useState<MoodId>('calm');
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sentTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const element = inputRef.current;
    if (!element) return;
    element.style.height = '0px';
    element.style.height = `${Math.min(element.scrollHeight, 132)}px`;
  }, [text]);

  useEffect(() => {
    return () => {
      if (sentTimer.current) window.clearTimeout(sentTimer.current);
    };
  }, []);

  const submit = () => {
    const clean = text.trim();
    if (!clean) return;
    onAdd(clean, mood);
    playAddChime();
    setText('');
    setSent(true);
    if (sentTimer.current) window.clearTimeout(sentTimer.current);
    sentTimer.current = window.setTimeout(() => setSent(false), 900);

    if (window.matchMedia('(pointer: coarse)').matches) {
      inputRef.current?.blur();
    } else {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  const activeMood = moodOf(mood);

  return (
    <div className="composer-wrap">
      <div className="sky-meta" aria-label="星空统计">
        {total > 0 ? (
          <>
            <span>
              <b>{total}</b> 束微光
            </span>
            <i className="meta-dot" aria-hidden="true" />
            <span>{streak > 0 ? `连续 ${streak} 天` : '今天重新开始'}</span>
            {todayCount > 0 && (
              <>
                <i className="meta-dot" aria-hidden="true" />
                <span>今天 {todayCount} 束</span>
              </>
            )}
          </>
        ) : (
          <span>从第一束微光开始</span>
        )}
      </div>

      <form
        className={`composer${sent ? ' is-sent' : ''}`}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="composer-head">
          <span className="composer-prompt">{greeting()}，有什么微光？</span>
          <span className={`char-count${text.length > 0 ? ' has-text' : ''}`}>
            {text.length}/140
          </span>
        </div>

        <textarea
          ref={inputRef}
          className="composer-input"
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, 140))}
          onKeyDown={handleKeyDown}
          maxLength={140}
          rows={1}
          enterKeyHint="done"
          aria-label="写下此刻的一点微光"
          placeholder="一句话就好。今天让你停下来的一瞬……"
        />

        <div className="composer-bottom">
          <div className="moods" role="radiogroup" aria-label="此刻的心情">
            {MOODS.map((item) => {
              const active = mood === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  title={item.hint}
                  className={`mood${active ? ' is-active' : ''}`}
                  style={
                    {
                      '--mood-color': item.color,
                      '--mood-soft': item.soft,
                    } as CSSProperties
                  }
                  onClick={() => setMood(item.id)}
                >
                  <MoodGlyph mood={item.id} size={12} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button type="submit" className="ignite-btn" disabled={!text.trim()}>
            <SparkIcon size={15} />
            点亮
          </button>
        </div>
        <span className="mood-note" aria-live="polite">
          {activeMood.hint}
        </span>
      </form>

      <p className="composer-hint">
        <span className="hint-desktop">Enter 点亮 · Shift + Enter 换行</span>
        <span className="hint-mobile">只属于你的本地星空</span>
      </p>
    </div>
  );
}
