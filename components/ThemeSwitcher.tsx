'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/cn';

type ThemeChoice = 'light' | 'dark' | 'system';

const options: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

function ThemeIcon({ theme }: { theme: ThemeChoice | undefined }) {
  if (theme === 'light') return <Sun className="w-4 h-4" />;
  if (theme === 'dark') return <Moon className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
}

interface ThemeSwitcherProps {
  variant?: 'navbar' | 'mobile';
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ variant = 'navbar' }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  if (!mounted) {
    return (
      <div
        className={cn(
          'rounded-xl bg-surface/50 border border-border-subtle',
          variant === 'navbar' ? 'w-9 h-9' : 'h-11 w-full'
        )}
        aria-hidden
      />
    );
  }

  const active = (theme as ThemeChoice) || 'system';
  const activeLabel = options.find((o) => o.value === active)?.label ?? 'System';

  if (variant === 'mobile') {
    return (
      <div className="space-y-2">
        <p className="px-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Theme</p>
        <div className="grid grid-cols-3 gap-2">
          {options.map(({ value, label, icon: Icon }) => {
            const isActive = active === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                aria-label={`Use ${label} theme`}
                aria-pressed={isActive}
                className={cn(
                  'flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer border',
                  isActive
                    ? 'bg-bridge-primary/15 border-bridge-primary/40 text-text-primary'
                    : 'glass border-border-subtle text-text-muted hover:text-text-primary hover:border-border-subtle'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>
        <p className="px-1 text-[10px] text-text-muted">
          Displaying {resolvedTheme === 'dark' ? 'dark' : 'light'} (device: {active === 'system' ? 'auto' : activeLabel.toLowerCase()})
        </p>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-soft transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40"
        aria-label={`Theme: ${activeLabel}. Click to change`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <ThemeIcon theme={active} />
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select theme"
          className="absolute right-0 top-full mt-2 w-40 py-1.5 glass-strong rounded-xl border border-border-subtle shadow-xl shadow-black/10 dark:shadow-black/40 z-[60] animate-scale-in"
        >
          {options.map(({ value, label, icon: Icon }) => {
            const isActive = active === value;
            return (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors cursor-pointer',
                  isActive
                    ? 'text-text-primary bg-background-soft'
                    : 'text-text-muted hover:text-text-primary hover:bg-background-soft'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-bridge-primary-light shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
