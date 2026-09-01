import Link from 'next/link';
import Image from 'next/image';
import { Play, ExternalLink } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

type SoftwarePreviewStripProps = {
  title: string;
  cover: string;
  demoSlug?: string | null;
  demoUrl?: string | null;
};

export function SoftwarePreviewStrip({ title, cover, demoSlug, demoUrl }: SoftwarePreviewStripProps) {
  const href = demoSlug ? ROUTES.softwareDemo(demoSlug) : demoUrl ?? null;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
        <h3 className="font-black text-sm">Live Demo Preview</h3>
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:underline"
          >
            <Play className="w-3.5 h-3.5" aria-hidden />
            Open live demo
            <ExternalLink className="w-3 h-3" aria-hidden />
          </Link>
        )}
      </div>
      <div className="relative aspect-video bg-gradient-to-br from-[#0f2744] to-[#132f52]">
        <Image src={cover} alt={`${title} — demo preview`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
      </div>
    </div>
  );
}
