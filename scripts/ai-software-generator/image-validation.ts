import { access, stat } from 'node:fs/promises';

/** SVG-engine covers are typically ~6–12KB; AI lifestyle covers are larger. */
export const MIN_AI_COVER_BYTES = 18_000;
export const MIN_AI_SCREEN_BYTES = 25_000;

export async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

export async function assertMinBytes(p: string, min: number, label: string): Promise<boolean> {
  if (!(await fileExists(p))) {
    console.warn(`QA missing: ${label} → ${p}`);
    return false;
  }
  const s = await stat(p);
  if (s.size < min) {
    console.warn(`QA tiny (likely SVG): ${label} ${s.size}B < ${min}B → ${p}`);
    return false;
  }
  return true;
}

export function isLikelyAiAvif(bytes: number, kind: 'cover' | 'screen'): boolean {
  return kind === 'cover' ? bytes >= MIN_AI_COVER_BYTES : bytes >= MIN_AI_SCREEN_BYTES;
}
