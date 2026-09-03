import { SHOWCASE_BUCKET } from '../config/constants';
import { pageTypeFolder } from '../config/page-types';

export { SHOWCASE_BUCKET };

export function projectFolder(projectId: string): string {
  return `projects/${projectId}`;
}

export function coverObjectPath(projectId: string, ext: 'avif' | 'webp', version?: string): string {
  const file = version ? `cover-${version}.${ext}` : `cover.${ext}`;
  return `${projectFolder(projectId)}/cover/${file}`;
}

export function pageObjectPath(
  projectId: string,
  pageType: string,
  pageId: string,
  variant: 'desktop' | 'mobile' | 'thumbnail' | 'original',
  ext: 'avif' | 'webp' | 'png' | 'jpg'
): string {
  const folder = pageTypeFolder(pageType);
  return `${projectFolder(projectId)}/${folder}/${pageId}-${variant}.${ext}`;
}

export function originalObjectPath(projectId: string, fileName: string): string {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
  return `${projectFolder(projectId)}/original/${Date.now()}-${safe}`;
}
