'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { getProjectFileDownloadUrlAction } from '@/app/actions/project-files';

type FileDownloadButtonProps = {
  filePath: string;
  fileName: string;
};

export function FileDownloadButton({ filePath, fileName }: FileDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    const result = await getProjectFileDownloadUrlAction(filePath);
    setLoading(false);
    if (result.error || !result.url) {
      setError(result.error ?? 'Download failed');
      return;
    }
    window.open(result.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="text-right shrink-0">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-deshi-green hover:underline disabled:opacity-60"
      >
        <Download className="w-4 h-4" aria-hidden />
        {loading ? '…' : 'Download'}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
