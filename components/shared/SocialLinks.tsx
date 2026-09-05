import { SOCIAL_ICONS } from '@/components/icons/social';
import { SOCIAL_LINKS, type SocialLink } from '@/lib/config/social-links';
import { cn } from '@/lib/cn';

type SocialLinksProps = {
  className?: string;
  linkClassName?: string;
  /** Platform names to hide (e.g. when WhatsApp is shown as a CTA elsewhere). */
  omit?: readonly SocialLink['name'][];
  size?: 'sm' | 'md';
  /** Footer is dark; light suits drawers / light surfaces. */
  variant?: 'dark' | 'light';
};

export function SocialLinks({
  className,
  linkClassName,
  omit,
  size = 'md',
  variant = 'dark',
}: SocialLinksProps) {
  const links = omit?.length
    ? SOCIAL_LINKS.filter((link) => !omit.includes(link.name))
    : SOCIAL_LINKS;

  const touch = size === 'sm' ? 'h-10 w-10' : 'h-11 w-11';
  const iconSize = size === 'sm' ? 18 : 20;
  const hasLayout = Boolean(className && /\b(grid|flex)\b/.test(className));

  return (
    <ul
      className={cn(
        'max-w-full min-w-0 gap-2',
        !hasLayout && 'flex flex-wrap items-center',
        className
      )}
    >
      {links.map((link) => {
        const Icon = SOCIAL_ICONS[link.icon];
        return (
          <li key={link.name} className="min-w-0">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              title={link.name}
              className={cn(
                touch,
                'inline-flex items-center justify-center rounded-xl border transition-[color,border-color,background-color,transform] duration-200',
                'hover:-translate-y-0.5',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2',
                variant === 'dark'
                  ? [
                      'border-white/10 bg-white/5 text-slate-300',
                      'hover:border-[#60a5fa]/45 hover:bg-white/10 hover:text-white',
                      'focus-visible:ring-[#60a5fa] focus-visible:ring-offset-[#0b1220]',
                    ]
                  : [
                      'border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
                      'hover:border-[#2563eb]/40 hover:bg-[#eff6ff] hover:text-[#1d4ed8]',
                      'dark:hover:border-[#60a5fa]/45 dark:hover:bg-white/10 dark:hover:text-white',
                      'focus-visible:ring-offset-background',
                    ],
                linkClassName
              )}
            >
              <Icon width={iconSize} height={iconSize} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
