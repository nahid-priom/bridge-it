import { FEED_MILL_HERO_SET, allExpectedPngFiles, screenPngName } from './feed-mill-hero-set';
import { buildCoverPrompt } from './cover-prompts';
import { buildScreenPrompt } from './screen-prompts';
import { FEED_MILL_DESIGN_SYSTEM } from './design-tokens';

export type GenerationManifestEntry = {
  slug: string;
  kind: 'cover' | 'screen';
  screenKey?: string;
  pngFile: string;
  prompt: string;
};

export function buildGenerationManifest(): {
  visualVersion: number;
  designSystem: string;
  entries: GenerationManifestEntry[];
} {
  const entries: GenerationManifestEntry[] = [];
  for (const product of FEED_MILL_HERO_SET) {
    entries.push({
      slug: product.slug,
      kind: 'cover',
      pngFile: product.coverFile,
      prompt: buildCoverPrompt(product.slug),
    });
    for (const hero of product.heroes) {
      entries.push({
        slug: product.slug,
        kind: 'screen',
        screenKey: hero.key,
        pngFile: screenPngName(product.slug, hero.key),
        prompt: buildScreenPrompt(product.slug, hero.key),
      });
    }
  }
  return {
    visualVersion: FEED_MILL_DESIGN_SYSTEM.visualVersion,
    designSystem: FEED_MILL_DESIGN_SYSTEM.id,
    entries,
  };
}

export function printManifestSummary(): void {
  const m = buildGenerationManifest();
  console.log(`Feed Mill AI generation manifest v${m.visualVersion} (${m.entries.length} assets)`);
  console.log('Expected PNG files:');
  for (const f of allExpectedPngFiles()) console.log(`  - ${f}`);
}
