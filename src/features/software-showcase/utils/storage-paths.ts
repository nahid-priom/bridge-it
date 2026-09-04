import { SOFTWARE_BUCKET } from '../config/constants';

export { SOFTWARE_BUCKET };

export function projectFolder(projectId: string): string {
  return `projects/${projectId}`;
}

export function coverCardPath(projectId: string): string {
  return `${projectFolder(projectId)}/cover/card.avif`;
}

export function coverDetailPath(projectId: string): string {
  return `${projectFolder(projectId)}/cover/detail.avif`;
}

export function screenPreviewPath(projectId: string, screenKey: string): string {
  return `${projectFolder(projectId)}/screens/${screenKey}/preview.avif`;
}

export function screenThumbPath(projectId: string, screenKey: string): string {
  return `${projectFolder(projectId)}/screens/${screenKey}/thumb.avif`;
}

export function originalObjectPath(projectId: string, fileName: string): string {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
  return `${projectFolder(projectId)}/original/${Date.now()}-${safe}`;
}
