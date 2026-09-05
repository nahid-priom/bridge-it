export type {
  CatalogBreadcrumbItem,
  CatalogCategoryRoot,
  CatalogFaq,
  CatalogFaqScope,
  CatalogIndustry,
  CatalogPageMetadata,
  CatalogProductKind,
  CatalogProductListFilters,
  CatalogProductListResult,
  CatalogProductRef,
  CatalogRelatedProduct,
  CatalogUrlRedirect,
} from './types';

export {
  CATALOG_CATEGORY_ROOTS,
  CATALOG_ROOTS,
  getCatalogRootMeta,
  isCatalogCategoryRoot,
} from './config/roots';
export type { CatalogRootMeta } from './config/roots';

export {
  SOFTWARE_INDUSTRY_SLUGS,
  SOFTWARE_PRODUCT_INDUSTRY_MAP,
  softwareIndustryForProduct,
} from './config/software-industry-map';
export type { SoftwareIndustrySlug, SoftwareProductSlug } from './config/software-industry-map';

export {
  SOFTWARE_FLAGSHIP_BY_INDUSTRY,
  SOFTWARE_HOME_PREVIEW_SLUGS,
  SOFTWARE_HUB_PRIORITY_SLUGS,
  SOFTWARE_INDUSTRIES_45,
} from './config/software-industries-45';
export type { SoftwareIndustry45Slug } from './config/software-industries-45';

export { listIndustries, getIndustryByPath } from './api/industries';
export { getProductByPath, getProductRefById, listProducts } from './api/products';
export { lookupRedirect } from './api/redirects';
export { listFaqs } from './api/faqs';
export { listRelatedProducts } from './api/related';

export {
  buildCategoryMetadata,
  buildIndustryMetadata,
  buildProductMetadata,
} from './seo/metadata';
export {
  buildCategoryBreadcrumbs,
  buildIndustryBreadcrumbs,
  buildProductBreadcrumbs,
} from './seo/breadcrumbs';

export { catalogKeys } from './utils/query-keys';
export { getPublicAssetUrl } from './utils/cover';
export type { CatalogCoverFields } from './utils/cover';
export { categoryPath, industryPath, normalizeCatalogPath, productPath } from './utils/paths';

export {
  CatalogAnalytics,
  CatalogBreadcrumb,
  CatalogCTA,
  CatalogEmptyState,
  CatalogFaqList,
  CatalogPrice,
  CatalogProductCard,
  ExploreCatalogLayout,
  CatalogSidebar,
  CatalogToolbar,
  FeaturedBadge,
  CatalogCoverImage,
  IndustryCard,
  IndustryGrid,
  PackageBadge,
  ProductReviews,
  RelatedProducts,
  StarRating,
  consultationDeepLink,
  formatCatalogPrice,
  parseSoftwarePriceParam,
  softwarePriceBounds,
} from './components';
export type {
  CatalogAnalyticsPayload,
  CatalogProductFeature,
  CatalogSidebarIndustry,
} from './components';
export { listApprovedReviews, submitCatalogReview } from './api/reviews';
export type { CatalogProductReview, CatalogReviewKind } from './types/reviews';
export { fallbackRatingFromSlug } from './types/reviews';
