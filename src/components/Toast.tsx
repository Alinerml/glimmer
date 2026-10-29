import { SparkIcon } from './Icons';

export function Toast({ message }: { message: string | null }) {
  return (
    <div className={`toast${message ? ' is-visible' : ''}`} role="status" aria-live="polite">
      {message && <SparkIcon size={14} />}
      <span>{message}</span>
    </div>
  );
}
