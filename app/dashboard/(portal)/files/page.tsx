import { buildPageMetadata } from '@/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Files | Bridge IT Park',
  path: '/dashboard/files',
  noIndex: true,
});

export default function ClientFilesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Project Files</h1>
        <p className="text-sm text-text-secondary mt-1">Download deliverables shared by Bridge IT Park.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-12 text-center">
        <p className="text-text-secondary">No files available yet. Files will appear here when your project deliverables are ready.</p>
      </div>
    </div>
  );
}
