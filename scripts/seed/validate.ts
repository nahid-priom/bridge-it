import type { SeedCategory, SeedProduct, SeedReview, SeedSeller } from './demo-data';

export type ValidationIssue = {
  level: 'error' | 'warn';
  message: string;
};

export type ValidationResult = {
  ok: boolean;
  issues: ValidationIssue[];
};

export function validateSeedData(input: {
  categories: SeedCategory[];
  sellers: SeedSeller[];
  products: SeedProduct[];
  reviews: SeedReview[];
}): ValidationResult {
  const issues: ValidationIssue[] = [];
  const categoryKeys = new Set(input.categories.map((c) => c.key));
  const sellerSlugs = new Set(input.sellers.map((s) => s.slug));
  const productSlugs = new Set<string>();

  const duplicateSlugs: string[] = [];
  for (const product of input.products) {
    if (productSlugs.has(product.slug)) duplicateSlugs.push(product.slug);
    productSlugs.add(product.slug);

    if (!categoryKeys.has(product.categoryKey)) {
      issues.push({
        level: 'error',
        message: `Product "${product.slug}" missing category key "${product.categoryKey}"`,
      });
    }

    if (!sellerSlugs.has(product.sellerSlug)) {
      issues.push({
        level: 'error',
        message: `Product "${product.slug}" missing seller slug "${product.sellerSlug}"`,
      });
    }

    if (!product.imageUrl?.trim()) {
      issues.push({
        level: 'error',
        message: `Product "${product.slug}" missing image`,
      });
    }

    if (product.price < 0 || Number.isNaN(product.price)) {
      issues.push({
        level: 'error',
        message: `Product "${product.slug}" has invalid price`,
      });
    }

    if (product.rating < 0 || product.rating > 5 || Number.isNaN(product.rating)) {
      issues.push({
        level: 'error',
        message: `Product "${product.slug}" has invalid rating`,
      });
    }
  }

  for (const slug of duplicateSlugs) {
    issues.push({
      level: 'error',
      message: `Duplicate product slug "${slug}"`,
    });
  }

  for (const review of input.reviews) {
    if (!productSlugs.has(review.productSlug)) {
      issues.push({
        level: 'warn',
        message: `Review "${review.legacyId}" references unknown product slug "${review.productSlug}"`,
      });
    }

    if (review.rating < 0 || review.rating > 5) {
      issues.push({
        level: 'error',
        message: `Review "${review.legacyId}" has invalid rating`,
      });
    }
  }

  const categorySlugDupes = input.categories
    .map((c) => c.slug)
    .filter((slug, i, arr) => arr.indexOf(slug) !== i);
  for (const slug of new Set(categorySlugDupes)) {
    issues.push({ level: 'error', message: `Duplicate category slug "${slug}"` });
  }

  const sellerSlugDupes = input.sellers
    .map((s) => s.slug)
    .filter((slug, i, arr) => arr.indexOf(slug) !== i);
  for (const slug of new Set(sellerSlugDupes)) {
    issues.push({ level: 'error', message: `Duplicate seller slug "${slug}"` });
  }

  const errors = issues.filter((i) => i.level === 'error');
  return { ok: errors.length === 0, issues };
}
