/** Build a short one-line card tagline (default 4–5 words). */
export function cardElaboration(
  text: string | null | undefined,
  options?: { words?: number; fallback?: string }
): string {
  const words = options?.words ?? 5;
  const fallback = options?.fallback ?? 'Ready for your business';
  const cleaned = (text ?? '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return fallback;

  const parts = cleaned.split(' ').filter(Boolean);
  const slice = parts.slice(0, Math.max(1, words)).join(' ');
  return slice.replace(/[.,;:!?…]+$/u, '');
}
