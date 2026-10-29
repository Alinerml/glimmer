import { useMemo, type CSSProperties } from 'react';
import { moodOf, type Glimmer } from '../types';
import { buildSkyLayout } from '../lib/constellation';
import { formatShortDate, relativeLabel } from '../lib/date';

interface SkyProps {
  entries: Glimmer[];
  selectedId: string | null;
  latestId: string | null;
  echoPulse: number;
  onSelect: (id: string) => void;
}

interface Dust {
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

function createDust(): Dust[] {
  let seed = 20261027;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({ length: 72 }, () => ({
    x: random() * 100,
    y: random() * 100,
    size: random() > 0.82 ? 1.8 : 1,
    opacity: 0.08 + random() * 0.38,
    duration: 9 + random() * 14,
    delay: -random() * 24,
  }));
}

export function Sky({ entries, selectedId, latestId, echoPulse, onSelect }: SkyProps) {
  const layout = useMemo(() => buildSkyLayout(entries), [entries]);
  const dust = useMemo(createDust, []);

  return (
    <section className="sky" aria-label="你的星空">
      <div className="sky-glow" aria-hidden="true" />
      <div className="dust-field" aria-hidden="true">
        {dust.map((particle, index) => (
          <span
            key={index}
            className="dust"
            style={
              {
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {layout.lines.length > 0 && (
        <svg
          className="constellation-lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {layout.lines.map((line, index) => (
            <line
              key={index}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      )}

      <div className="starfield">
        {layout.stars.map(({ entry, position }) => {
          const mood = moodOf(entry.mood);
          const active = selectedId === entry.id;
          return (
            <button
              key={entry.id}
              type="button"
              className={`star${active ? ' is-selected' : ''}${latestId === entry.id ? ' is-new' : ''}`}
              style={
                {
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  '--star-color': mood.color,
                  '--star-soft': mood.soft,
                  '--star-size': `${position.size}px`,
                  '--twinkle-duration': `${position.duration}s`,
                  '--twinkle-delay': `${position.delay}s`,
                } as CSSProperties
              }
              onClick={() => onSelect(entry.id)}
              aria-label={`${formatShortDate(entry.at)} · ${mood.label}：${entry.text.slice(0, 48)}`}
              aria-haspopup="dialog"
              aria-pressed={active}
            >
              <span className="star-halo" aria-hidden="true" />
              <span className="star-core" aria-hidden="true" />
              <span className="star-date" aria-hidden="true">
                {relativeLabel(entry.at)} · {mood.label}
              </span>
            </button>
          );
        })}
      </div>

      {entries.length === 0 && (
        <div className="empty-sky">
          <div className="empty-orb" aria-hidden="true">
            <span className="empty-orb-ring" />
            <span className="empty-orb-ring empty-orb-ring--two" />
            <span className="empty-orb-core" />
          </div>
          <p className="empty-kicker">YOUR PRIVATE SKY</p>
          <h2>今晚，点亮第一束微光</h2>
          <p className="empty-copy">
            写下一句话，它会成为你星空里的第一颗星。
            <br />
            没有账号，也没有云端，只有你和此刻。
          </p>
        </div>
      )}

      {echoPulse > 0 && <span key={echoPulse} className="meteor" aria-hidden="true" />}
    </section>
  );
}
