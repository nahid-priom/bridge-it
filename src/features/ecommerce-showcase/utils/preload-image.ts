/** Browser image preload — resolves when decoded (or rejects on error). */
export function preloadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('Missing image url'));
      return;
    }
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

export function pageImageUrl(
  page: { image_url?: string | null; fallback_url?: string | null } | null | undefined
): string | null {
  if (!page) return null;
  return page.fallback_url || page.image_url || null;
}

export function projectPageImageQueryKey(projectId: string, pageId: string) {
  return ['ecommerce-project-page-image', projectId, pageId] as const;
}
