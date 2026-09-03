'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

export function ShowcaseHero() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/websites?q=${encodeURIComponent(q)}` : '/websites');
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(16,185,129,0.16),transparent_55%),radial-gradient(900px_circle_at_90%_10%,rgba(15,39,68,0.12),transparent_50%)]" />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(var(--header-offset)+1.5rem)] pb-12 md:pb-16">
        <p className="inline-flex items-center rounded-full border border-emerald-200/80 dark:border-emerald-500/30 bg-white/80 dark:bg-white/5 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          100+ Custom E-commerce Website Ideas
        </p>
        <h1 className="mt-5 max-w-4xl font-display font-black tracking-tight leading-[1.12] text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] text-[#0f2744] dark:text-white">
          আপনার Business-এর জন্য
          <span className="block text-emerald-600">Perfect E-commerce Website বেছে নিন</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base md:text-lg text-text-secondary">
          100+ Custom Next.js, React & Laravel E-commerce Design থেকে আপনার পছন্দের Design দেখুন।
        </p>

        <form onSubmit={onSubmit} className="mt-8 max-w-xl" role="search">
          <div className="flex items-stretch rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Fashion, Electronics, Grocery..."
              className="flex-1 min-w-0 px-4 py-3.5 text-sm md:text-base bg-transparent outline-none"
              aria-label="Search websites"
            />
            <button
              type="submit"
              className="m-1.5 w-11 h-11 rounded-xl bg-emerald-600 text-white inline-flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/websites"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f2744] text-white px-7 py-3.5 text-sm font-semibold hover:bg-[#16375f]"
          >
            Explore Websites
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/consultation"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-white/15 px-7 py-3.5 text-sm font-semibold bg-white dark:bg-transparent"
          >
            Free Demo / Discuss Your Project
          </Link>
        </div>
      </div>
    </section>
  );
}
