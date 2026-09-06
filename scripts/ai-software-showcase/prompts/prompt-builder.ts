import { baseDesignPrompt } from '../config/design-systems';
import type { HeroDef, ProductHeroConfig } from '../config/hero-registry';

const NEGATIVE = [
  'Do NOT generate marketing landing pages, device bezels, or phone mockup frames.',
  'Do NOT use lorem ipsum, gibberish, neon, glassmorphism, purple gradients, or sci-fi UI.',
  'Do NOT invent unrelated industry data. No unreadable micro text.',
].join(' ');

export function buildCoverPrompt(product: ProductHeroConfig): string {
  return [
    `Premium enterprise software product cover for "${product.title}" (${product.brandName}).`,
    `Industry: ${product.industry}. Composition: industry environment + realistic desktop software UI preview.`,
    `Focus: ${product.coverFocus}.`,
    'Software UI must be clearly visible (sidebar + dashboard/KPIs). Professional photography style, Bridge IT Park quality.',
    baseDesignPrompt(),
    NEGATIVE,
    'Aspect: landscape cover suitable for catalog card and detail hero.',
  ].join(' ');
}

export function buildScreenPrompt(product: ProductHeroConfig, hero: HeroDef): string {
  return [
    `Realistic production ERP screenshot — NOT an illustration.`,
    `PRODUCT: ${product.title} (${product.brandName}). INDUSTRY: ${product.industry}.`,
    `PAGE: ${hero.title}. PURPOSE: ${hero.purpose}. KEY: ${hero.key}.`,
    'USER ROLE: operations manager / domain specialist using this screen daily.',
    'Show consistent app shell: left sidebar with domain modules, top header with search and primary actions,',
    'main content with readable KPIs, filters, and a realistic data table or workflow panel.',
    'Industry-specific terminology and sample data only. BDT/local business context when relevant.',
    baseDesignPrompt(),
    NEGATIVE,
    'Aspect ratio 16:10 desktop application window. Sharp readable labels.',
  ].join(' ');
}

export function buildNegativePromptBlock(): string {
  return NEGATIVE;
}
