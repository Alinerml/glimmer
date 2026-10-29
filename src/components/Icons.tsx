import type { SVGProps } from 'react';
import type { MoodId } from '../types';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function icon(size: number, props: IconProps) {
  const { size: _size, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true,
    focusable: false,
    ...rest,
  } as const;
}

export function SparkIcon(props: IconProps) {
  const { size = 18, ...rest } = props;
  return (
    <svg {...icon(size, rest)}>
      <path
        d="M12 2.8c1 4.8 1.9 5.7 6.7 6.7-4.8 1-5.7 1.9-6.7 6.7-1-4.8-1.9-5.7-6.7-6.7 4.8-1 5.7-1.9 6.7-6.7Z"
        fill="currentColor"
      />
      <path d="M18.4 16.2c.4 1.8.8 2.2 2.6 2.6-1.8.4-2.2.8-2.6 2.6-.4-1.8-.8-2.2-2.6-2.6 1.8-.4 2.2-.8 2.6-2.6Z" fill="currentColor" opacity=".55" />
    </svg>
  );
}

export function EchoIcon(props: IconProps) {
  const { size = 18, ...rest } = props;
  return (
    <svg {...icon(size, rest)} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 11a8.5 8.5 0 1 0 2.4-5.9L3.5 7.5" />
      <path d="M3.5 3.5v4h4" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

export function SyncIcon(props: IconProps) {
  const { size = 18, ...rest } = props;
  return (
    <svg {...icon(size, rest)} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8.5h12.5l-3-3" />
      <path d="M20 15.5H7.5l3 3" />
      <path d="M4 8.5a5 5 0 0 1 5-5" opacity=".35" />
      <path d="M20 15.5a5 5 0 0 1-5 5" opacity=".35" />
    </svg>
  );
}

export function MoreIcon(props: IconProps) {
  const { size = 18, ...rest } = props;
  return (
    <svg {...icon(size, rest)} fill="currentColor">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  const { size = 18, ...rest } = props;
  return (
    <svg {...icon(size, rest)} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...icon(size, rest)} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
      <path d="M15.5 8.5v-2a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...icon(size, rest)} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function LinkIcon(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...icon(size, rest)} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.7 1.7" />
      <path d="M14 10.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.7-1.7" />
    </svg>
  );
}

export function QrIcon(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...icon(size, rest)} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="6" height="6" rx="1.2" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1.2" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1.2" />
      <path d="M14.5 14.5h2.5v2.5H14.5zM19 19h1.5v1.5H19zM14.5 20.5h1M20.5 14.5v2" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...icon(size, rest)} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5v11" />
      <path d="m7.5 10 4.5 4.5 4.5-4.5" />
      <path d="M4 17.5v1.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5" />
    </svg>
  );
}

export function UploadIcon(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...icon(size, rest)} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 15.5v-11" />
      <path d="m7.5 9 4.5-4.5L16.5 9" />
      <path d="M4 17.5v1.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...icon(size, rest)} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V4.5h6V7M6.5 7l.8 12h9.4l.8-12M10 11v4.5M14 11v4.5" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  const { size = 14, ...rest } = props;
  return (
    <svg {...icon(size, rest)} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  );
}

export function InstallIcon(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...icon(size, rest)} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="4" width="17" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
      <path d="M12 6.5v5M9.5 9l2.5 2.5L14.5 9" />
    </svg>
  );
}

export function StarMark(props: IconProps) {
  const { size = 24, ...rest } = props;
  return (
    <svg {...icon(size, rest)} fill="none">
      <circle cx="12" cy="12" r="10.2" stroke="currentColor" strokeOpacity=".22" strokeWidth="1" />
      <path
        d="M12 2.7c.9 4.6 1.7 5.4 6.3 6.3-4.6.9-5.4 1.7-6.3 6.3-.9-4.6-1.7-5.4-6.3-6.3 4.6-.9 5.4-1.7 6.3-6.3Z"
        fill="currentColor"
        transform="translate(0 3.2)"
      />
      <circle cx="18.8" cy="5.6" r="1" fill="currentColor" opacity=".65" />
      <circle cx="5.2" cy="18.4" r=".8" fill="currentColor" opacity=".4" />
    </svg>
  );
}

export function MoodGlyph({ mood, size = 13 }: { mood: MoodId; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true,
    focusable: false,
  } as const;

  if (mood === 'calm') {
    return (
      <svg {...common} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M4 9c2-2.2 4-2.2 6 0s4 2.2 6 0 3-1.7 4-.4M4 15c2-2.2 4-2.2 6 0s4 2.2 6 0 3-1.7 4-.4" />
      </svg>
    );
  }
  if (mood === 'joy') {
    return (
      <svg {...common} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
      </svg>
    );
  }
  if (mood === 'love') {
    return (
      <svg {...common}>
        <path
          d="M12 20s-7.8-4.6-7.8-10A4.2 4.2 0 0 1 12 7.2 4.2 4.2 0 0 1 19.8 10c0 5.4-7.8 10-7.8 10Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (mood === 'tired') {
    return (
      <svg {...common}>
        <path d="M20.5 15.2A8.6 8.6 0 0 1 8.8 3.5 8.7 8.7 0 1 0 20.5 15.2Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path
        d="M12 2.5c.9 4.9 1.9 5.9 6.8 6.8-4.9.9-5.9 1.9-6.8 6.8-.9-4.9-1.9-5.9-6.8-6.8 4.9-.9 5.9-1.9 6.8-6.8Z"
        fill="currentColor"
        transform="translate(0 2.6)"
      />
      <circle cx="18.5" cy="18" r="1.4" fill="currentColor" opacity=".5" />
    </svg>
  );
}
