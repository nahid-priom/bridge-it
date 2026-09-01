'use client';

import { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { bulkGenerateSolutionCoversAction } from '@/app/actions/solution-cover';
import type { CoverEntityType } from '@/lib/solutions/coverTypes';

type ProductCoverBulkPanelProps = {
  onComplete?: () => void;
};

export function ProductCoverBulkPanel({ onComplete }: ProductCoverBulkPanelProps) {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  const runBulk = async (force = false) => {
    setRunning(true);
    setError(null);
    setProgress('Starting bulk cover generation...');

    const result = await bulkGenerateSolutionCoversAction({
      entityTypes: ['bitp', 'marketplace-service', 'marketplace-product'] as CoverEntityType[],
      force,
    });

    setRunning(false);

    if (result.error) {
      setError(result.error);
      setProgress(null);
      return;
    }

    const data = result.data;
    if (data) {
      setProgress(
        `Generated ${data.generated} / ${data.total} · Failed ${data.failed} · Remaining ${data.remaining}`
      );
      onComplete?.();
    }
  };

  return (
    <div className="rounded-xl border border-white/10 p-4 space-y-3 bg-white/[0.02]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Bulk Cover Generation</h3>
          <p className="text-xs text-white/50 mt-0.5">
            Generate premium covers for products missing valid Supabase cover images.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={running}
            onClick={() => runBulk(false)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
            Generate Missing Covers
          </button>
          <button
            type="button"
            disabled={running}
            onClick={() => {
              if (confirm('Regenerate all covers? This will call the AI API for every item.')) {
                runBulk(true);
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-white/10 text-white/70 hover:text-white disabled:opacity-50"
          >
            Regenerate All
          </button>
        </div>
      </div>
      {progress && <p className="text-xs text-emerald-300">{progress}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
