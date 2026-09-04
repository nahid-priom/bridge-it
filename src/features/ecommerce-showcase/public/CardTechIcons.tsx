import { TECHNOLOGY_OPTIONS } from '../config/constants';

const ICON_COUNT = 3;

const TECH_COLORS: Record<string, string> = {
  'Next.js': '#ffffff',
  React: '#61dafb',
  Laravel: '#ff2d20',
  TypeScript: '#3178c6',
  Supabase: '#3ecf8e',
  PostgreSQL: '#336791',
  'Tailwind CSS': '#38bdf8',
  'Node.js': '#5fa04e',
};

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pickTechs(seed: string, stack: string[], count = ICON_COUNT) {
  const pool = TECHNOLOGY_OPTIONS.map((item) => item.id);
  const preferred = stack.filter((item) => pool.includes(item as (typeof pool)[number]));
  const rest = pool.filter((item) => !preferred.includes(item));
  let n = hashSeed(seed);
  const shuffled = [...rest];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    n = (n * 1664525 + 1013904223) >>> 0;
    const j = n % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return [...preferred, ...shuffled].slice(0, count);
}

function TechGlyph({ name }: { name: string }) {
  const color = TECH_COLORS[name] ?? '#94a3b8';
  const common = { viewBox: '0 0 24 24', className: 'h-4 w-4', 'aria-hidden': true as const };
  switch (name) {
    case 'React':
      return (
        <svg {...common} fill="none" stroke={color} strokeWidth="1.6">
          <circle cx="12" cy="12" r="2.2" fill={color} stroke="none" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
        </svg>
      );
    case 'Next.js':
      return (
        <svg {...common} fill="currentColor">
          <circle cx="12" cy="12" r="10" className="text-text-primary" />
          <path d="M8 16V8h2.1l5.4 7.2V8H18v8h-2.1L10.5 8.9V16H8z" className="fill-background" />
        </svg>
      );
    case 'Laravel':
      return (
        <svg {...common} fill={color}>
          <path d="M3.4 6.2 8 8.6v6.6l4.4 2.4V11l4.2-2.3v6.7L12.4 18 8 15.6 3.6 18V8.7l-.2-.1V6.2zm8.8-2.1L16.6 6l4.4-2.3v6.8L16.6 13l-4.4-2.4V4.1z" />
        </svg>
      );
    case 'TypeScript':
      return (
        <svg {...common} fill={color}>
          <rect x="2" y="2" width="20" height="20" rx="3" />
          <path
            fill="#fff"
            d="M13.2 16.7v-1.5c.4.2.8.4 1.3.5.5.1 1 .1 1.4 0 .3-.1.5-.3.5-.5 0-.2-.1-.4-.4-.5l-1.6-.6c-1-.4-1.5-1-1.5-1.9 0-.6.2-1.1.7-1.5.5-.4 1.2-.6 2.1-.6.6 0 1.2.1 1.8.3.5.2 1 .4 1.4.7l-.6 1.4c-.4-.2-.8-.4-1.2-.5-.5-.1-.9-.1-1.2 0-.3.1-.4.3-.4.5s.2.4.6.5l1.6.6c1 .4 1.5 1 1.5 2 0 .7-.3 1.2-.8 1.6-.5.4-1.3.6-2.3.6-.7 0-1.4-.1-2-.3-.6-.2-1.1-.5-1.5-.8zM6.4 11.2h3.1V10H3.9v1.2h3.1V18h1.6v-6.8z"
          />
        </svg>
      );
    case 'Supabase':
      return (
        <svg {...common} fill={color}>
          <path d="M13.4 3.2 4.8 14.3c-.4.5 0 1.2.7 1.2h6.2l-1.1 5.3c-.2.8.8 1.3 1.3.7l8.6-11.1c.4-.5 0-1.2-.7-1.2h-6.2l1.1-5.3c.2-.8-.8-1.3-1.3-.7z" />
        </svg>
      );
    case 'PostgreSQL':
      return (
        <svg {...common} fill={color}>
          <path d="M16.8 3.4c-1.2-.2-2.5.3-3.3 1.4-.7-.8-1.7-1.3-2.8-1.3-2.3 0-4.2 2.4-4.2 5.4 0 2.2.8 4 2.1 4.8l-.4 6.2c0 .5.4.9.9.8l2.4-.4.3 1.6c.1.4.5.6.8.5l2.2-.6c.4-.1.6-.5.5-.8l-.3-1.5 2.4.1c.5 0 .9-.4.9-.9l.1-3.3c1.2-.9 1.9-2.7 1.9-4.8 0-2.6-1.4-4.7-3.5-5.2z" />
        </svg>
      );
    case 'Tailwind CSS':
      return (
        <svg {...common} fill={color}>
          <path d="M12 6c-2.5 0-4.1 1.2-4.8 3.7.9-1.2 2-1.7 3.2-1.4.7.2 1.2.7 1.7 1.3C13 11 13.9 12 15.8 12c2.5 0 4.1-1.2 4.8-3.7-.9 1.2-2 1.7-3.2 1.4-.7-.2-1.2-.7-1.7-1.3C14.8 7 13.9 6 12 6zM7.2 12c-2.5 0-4.1 1.2-4.8 3.7.9-1.2 2-1.7 3.2-1.4.7.2 1.2.7 1.7 1.3C8.2 17 9.1 18 11 18c2.5 0 4.1-1.2 4.8-3.7-.9 1.2-2 1.7-3.2 1.4-.7-.2-1.2-.7-1.7-1.3C10 13 9.1 12 7.2 12z" />
        </svg>
      );
    case 'Node.js':
      return (
        <svg {...common} fill={color}>
          <path d="M12 2.2 3.6 7v10L12 21.8 20.4 17V7L12 2.2zm0 2.3 6.2 3.5v7L12 18.5 5.8 15V8L12 4.5z" />
        </svg>
      );
    default:
      return (
        <svg {...common} fill={color}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export function CardTechIcons({
  seed,
  stack,
  count = ICON_COUNT,
  size = 'sm',
  showLabels = false,
  scrollable = false,
}: {
  seed: string;
  stack: string[];
  count?: number;
  size?: 'sm' | 'md';
  showLabels?: boolean;
  scrollable?: boolean;
}) {
  const visible = pickTechs(seed, stack, count);
  const box = size === 'md' ? 'h-9 w-9' : 'h-7 w-7';
  return (
    <ul
      className={
        scrollable
          ? 'flex max-w-full flex-nowrap items-center gap-1.5 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          : showLabels
            ? 'flex flex-wrap items-center gap-2'
            : 'flex items-center gap-1.5'
      }
      aria-label="Technologies"
    >
      {visible.map((name) => (
        <li
          key={name}
          title={name}
          className={
            showLabels
              ? 'inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border-subtle bg-background-soft py-0.5 pl-0.5 pr-2'
              : `inline-flex ${box} shrink-0 items-center justify-center rounded-full border border-border-subtle bg-background-soft`
          }
        >
          <span className={showLabels ? 'inline-flex h-6 w-6 items-center justify-center' : undefined}>
            <span className="sr-only">{name}</span>
            <TechGlyph name={name} />
          </span>
          {showLabels ? (
            <span className="whitespace-nowrap text-[11px] font-medium text-text-secondary">{name}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/** @deprecated Public pricing removed — kept as no-op for any residual imports. */
export function CardStartingPrice() {
  return null;
}
