import { useEffect, useState, type CSSProperties } from 'react';
import { moodOf, type Glimmer } from '../types';
import { formatFullDate, formatTime, relativeLabel } from '../lib/date';
import { CloseIcon, MoodGlyph, TrashIcon } from './Icons';

interface DetailSheetProps {
  entry: Glimmer;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function DetailSheet({ entry, onClose, onDelete }: DetailSheetProps) {
  const mood = moodOf(entry.mood);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(() => setConfirming(false), 3200);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  return (
    <div
      className="overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        className="sheet detail-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-text"
      >
        <button type="button" className="sheet-close" onClick={onClose} aria-label="关闭" autoFocus>
          <CloseIcon size={17} />
        </button>

        <div
          className="detail-star"
          style={
            {
              '--star-color': mood.color,
              '--star-soft': mood.soft,
            } as CSSProperties
          }
          aria-hidden="true"
        >
          <span className="detail-star-halo" />
          <span className="detail-star-core" />
        </div>

        <div className="detail-meta">
          <span
            className="detail-mood"
            style={
              {
                '--mood-color': mood.color,
                '--mood-soft': mood.soft,
              } as CSSProperties
            }
          >
            <MoodGlyph mood={entry.mood} size={13} />
            {mood.label}
          </span>
          <span className="detail-relative">{relativeLabel(entry.at)}</span>
        </div>

        <p className="detail-text" id="detail-text">
          {entry.text}
        </p>

        <p className="detail-date">
          {formatFullDate(entry.at)} · {formatTime(entry.at)}
        </p>

        <div className="detail-actions">
          <button
            type="button"
            className={`btn detail-delete${confirming ? ' is-confirming' : ''}`}
            onClick={() => {
              if (confirming) {
                onDelete(entry.id);
              } else {
                setConfirming(true);
              }
            }}
            aria-live="polite"
          >
            <TrashIcon size={14} />
            {confirming ? '再点一次，确认让它消失' : '让它回到夜空'}
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            留在星空里
          </button>
        </div>
      </article>
    </div>
  );
}
