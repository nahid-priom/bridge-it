'use client';

import { useSearchParams } from 'next/navigation';
import { parseShowcaseFilters } from '../utils/filters';

export function useShowcaseFilters() {
  const searchParams = useSearchParams();
  return parseShowcaseFilters(searchParams);
}
