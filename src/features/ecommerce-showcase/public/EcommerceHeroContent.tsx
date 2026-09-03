import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { HeroActions } from './HeroActions';
import { HeroSearch } from './HeroSearch';

export function EcommerceHeroContent({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col justify-center motion-safe:opacity-0 motion-safe:[animation:hero-fade-up_0.55s_ease-out_forwards]',
        className
      )}
    >
      <p className="inline-flex w-fit items-center rounded-full border border-[#2563eb]/40 bg-[#2563eb]/10 px-3 py-1 text-xs font-semibold text-[#60a5fa]">
        100+ Custom E-commerce Website Ideas
      </p>

      <h1 className="mt-5 max-w-[560px] font-display text-[clamp(2rem,8vw,2.375rem)] font-extrabold leading-[1.15] tracking-tight text-text-primary lg:mt-[1.375rem] lg:text-[clamp(2.75rem,3.2vw,3.5rem)]">
        <span className="block text-text-primary dark:text-white">আপনার Business-এর জন্য</span>
        <span className="block text-[#3b82f6]">Perfect E-commerce Website</span>
        <span className="block text-[#3b82f6]">বেছে নিন</span>
      </h1>

      <p className="mt-5 max-w-[560px] text-sm leading-relaxed text-text-secondary md:text-base">
        100+ Premium E-commerce Design থেকে আপনার পছন্দের Design বেছে নিন।
      </p>

      <p className="mt-4 flex items-center gap-2 text-sm font-medium text-text-primary md:text-[15px]">
        <span
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-white"
          aria-hidden
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
        <span>
          Website শুরু মাত্র <span className="font-bold text-[#2563eb] dark:text-[#60a5fa]">৳5,000</span> থেকে
        </span>
      </p>

      <HeroSearch className="mt-6" />
      <HeroActions className="mt-4" />
    </div>
  );
}
