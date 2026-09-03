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
      <p className="inline-flex w-fit items-center rounded-full border border-[#2563eb]/40 bg-[#2563eb]/10 px-3.5 py-1 text-xs font-semibold text-[#60a5fa] sm:text-sm">
        100+ Custom E-commerce Website Ideas
      </p>

      <h1 className="mt-4 max-w-[18ch] font-display font-black tracking-tight text-[clamp(2rem,9vw,2.75rem)] leading-[1.15] text-text-primary lg:max-w-none lg:text-[clamp(2.625rem,3.6vw,4rem)] lg:leading-[1.14]">
        <span className="block text-text-primary dark:text-white">আপনার Business-এর জন্য</span>
        <span className="block text-[#3b82f6]">Perfect E-commerce</span>
        <span className="block text-[#3b82f6]">Website বেছে নিন</span>
      </h1>

      <p className="mt-4 max-w-[540px] text-sm leading-relaxed text-text-secondary sm:text-base md:text-[1.05rem]">
        Next.js, React & Laravel-এর 100+ Premium E-commerce Design থেকে আপনার পছন্দের Design দেখুন।
      </p>

      <p className="mt-4 flex items-center gap-2 text-sm font-medium text-text-primary sm:text-base">
        <span
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-white"
          aria-hidden
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
        <span>
          Website শুরু মাত্র <span className="font-semibold text-[#3b82f6]">৳5,000</span> থেকে
        </span>
      </p>

      <HeroSearch className="mt-6" />
      <HeroActions className="mt-5" />
    </div>
  );
}
