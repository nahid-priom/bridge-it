import { buildPageMetadata } from '@/lib/metadata';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getClientProjectFiles } from '@/lib/services/projects.service';
import { FileDownloadButton } from '@/components/client-dashboard/FileDownloadButton';

export const metadata = buildPageMetadata({
  title: 'Files | Bridge IT Park',
  path: '/dashboard/files',
  noIndex: true,
});

export default async function ClientFilesPage() {
  const user = await getCurrentUser();
  const files = user ? await getClientProjectFiles(user.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Project Files</h1>
        <p className="text-sm text-text-secondary mt-1">Download deliverables shared by Bridge IT Park.</p>
      </div>
      {files.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-12 text-center">
          <p className="text-text-secondary">No files available yet. Files will appear here when your project deliverables are ready.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => (
            <li key={file.id} className="rounded-xl border border-slate-200 dark:border-white/10 p-4 flex justify-between items-center gap-4">
              <div>
                <p className="font-semibold text-sm">{file.file_name}</p>
                <p className="text-xs text-text-secondary">{file.project_title}</p>
                {file.file_size ? (
                  <p className="text-xs text-text-secondary mt-0.5">{Math.round(file.file_size / 1024)} KB</p>
                ) : null}
              </div>
              <FileDownloadButton filePath={file.file_path} fileName={file.file_name} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
