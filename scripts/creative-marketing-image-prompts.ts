/**
 * Premium creative prompts for marketing gallery screens (AI image gen).
 */
import type { SeedCreativeMarketingProduct } from '../src/features/creative-marketing-showcase/types';

export function marketingAssetPrompt(
  product: SeedCreativeMarketingProduct,
  asset: { key: string; name: string; kind: string }
): string {
  const base = [
    'Premium agency portfolio mockup for Bridge IT Park creative marketing services.',
    'Photorealistic presentation, soft studio lighting, subtle depth of field, crisp typography,',
    'no watermarks, no fake logos of Meta/Facebook/Instagram trademarks, no unreadable lorem spam.',
    'Bangladesh-friendly business aesthetic: deep navy #0f2744, electric blue accents, clean whites.',
    `Service: ${product.title}. Screen title: ${asset.name}.`,
  ].join(' ');

  if (asset.kind === 'dashboard') {
    return `${base} Show a premium dark analytics dashboard UI mockup on a laptop screen: KPI cards, soft charts, campaign table, modern SaaS chrome, glass panels, high-end marketing agency vibe. Aspect 16:9.`;
  }

  if (product.serviceSubcategory === 'graphics-design') {
    return `${base} Show a premium graphic design deliverable mockup: floating print/social creatives on a dark navy desk with soft shadows, tasteful props, Behance-quality composition, editorial lighting. Aspect 16:9.`;
  }

  return `${base} Show a polished marketing creative board: campaign visuals arranged as a premium mood board with soft paper textures and modern brand design. Aspect 16:9.`;
}
