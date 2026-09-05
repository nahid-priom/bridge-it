import type { CatalogCategoryRoot } from '../types';

export interface CatalogRootMeta {
  root: CatalogCategoryRoot;
  label: string;
  shortLabel: string;
  path: string;
  /** Legacy path still redirected during transition */
  legacyPath?: string;
  description: string;
  productTable:
    | 'software_projects'
    | 'ecommerce_projects'
    | 'creative_marketing_projects';
  kind: CatalogCategoryRoot;
}

export const CATALOG_ROOTS: Record<CatalogCategoryRoot, CatalogRootMeta> = {
  software: {
    root: 'software',
    label: 'Business Software',
    shortLabel: 'Software',
    path: '/software',
    description: 'Industry ERP and operations software for Bangladesh businesses.',
    productTable: 'software_projects',
    kind: 'software',
  },
  websites: {
    root: 'websites',
    label: 'E-commerce Websites',
    shortLabel: 'Websites',
    path: '/websites',
    description: 'Premium e-commerce website designs ready to customize.',
    productTable: 'ecommerce_projects',
    kind: 'websites',
  },
  marketing: {
    root: 'marketing',
    label: 'Creative & Marketing',
    shortLabel: 'Marketing',
    path: '/marketing',
    legacyPath: '/creative-marketing',
    description: 'Creative design and digital marketing packages for growing brands.',
    productTable: 'creative_marketing_projects',
    kind: 'marketing',
  },
} as const;

export const CATALOG_CATEGORY_ROOTS = Object.keys(CATALOG_ROOTS) as CatalogCategoryRoot[];

export function isCatalogCategoryRoot(value: string | null | undefined): value is CatalogCategoryRoot {
  return value === 'software' || value === 'websites' || value === 'marketing';
}

export function getCatalogRootMeta(root: CatalogCategoryRoot): CatalogRootMeta {
  return CATALOG_ROOTS[root];
}
