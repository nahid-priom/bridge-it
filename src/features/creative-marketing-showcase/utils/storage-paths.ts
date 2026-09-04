export function creativeCoverCardPath(projectId: string): string {
  return `projects/${projectId}/cover-card.avif`;
}

export function creativeCoverDetailPath(projectId: string): string {
  return `projects/${projectId}/cover-detail.avif`;
}

export function creativeAssetPreviewPath(projectId: string, assetKey: string): string {
  return `projects/${projectId}/assets/${assetKey}.avif`;
}

export function creativeAssetThumbPath(projectId: string, assetKey: string): string {
  return `projects/${projectId}/assets/${assetKey}-thumb.avif`;
}
