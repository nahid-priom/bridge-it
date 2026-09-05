/** Shared sanitize + tokenized ILIKE fallback for showcase catalog search. */

const MAX_QUERY_LENGTH = 120;
const MAX_TOKENS = 8;

export function sanitizeShowcaseQuery(raw: string | null | undefined): string {
  if (!raw) return '';
  return raw
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_QUERY_LENGTH);
}

export function tokenizeShowcaseQuery(raw: string | null | undefined): string[] {
  const sanitized = sanitizeShowcaseQuery(raw);
  if (!sanitized) return [];
  return sanitized
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2)
    .slice(0, MAX_TOKENS);
}

/** Escape `%`, `_`, and `\` for Postgres ILIKE patterns. */
export function escapeIlikePattern(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

type FilterableQuery = {
  or: (filters: string) => FilterableQuery;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter: (column: string, operator: string, value?: any) => FilterableQuery;
};

/**
 * Apply tokenized ILIKE search to a Supabase/PostgREST query builder.
 * Single token → `.or(field.ilike.%t%,...)`
 * Multi token → `.filter('and', `(or(...),or(...))`)`
 */
export function applyTokenizedIlikeFilter<T extends FilterableQuery>(
  query: T,
  rawQuery: string | null | undefined,
  fields: readonly string[]
): T {
  const tokens = tokenizeShowcaseQuery(rawQuery);
  if (tokens.length === 0 || fields.length === 0) return query;

  if (tokens.length === 1) {
    const pattern = `%${escapeIlikePattern(tokens[0]!)}%`;
    const orFilter = fields.map((field) => `${field}.ilike.${pattern}`).join(',');
    return query.or(orFilter) as T;
  }

  const andParts = tokens.map((token) => {
    const pattern = `%${escapeIlikePattern(token)}%`;
    const orInner = fields.map((field) => `${field}.ilike.${pattern}`).join(',');
    return `or(${orInner})`;
  });

  return query.filter('and', `(${andParts.join(',')})`) as T;
}

export const ECOMMERCE_SEARCH_FIELDS = [
  'title',
  'industry',
  'short_description',
  'category_name',
  'category_slug',
] as const;

export const SOFTWARE_SEARCH_FIELDS = [
  'title',
  'industry',
  'short_description',
  'feature_summary',
  'category_name',
  'taxonomy_category_name',
  'child_category_name',
  'business_type',
  'solution_group',
  'software_type',
] as const;

export const CREATIVE_SEARCH_FIELDS = [
  'title',
  'short_description',
  'outcome_line',
  'service_group',
  'service_type',
  'target_business',
] as const;
