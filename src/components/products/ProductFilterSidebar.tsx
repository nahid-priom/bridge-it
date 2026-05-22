import React from 'react';
import { SearchFilters } from '../../types';
import { SearchFilterSidebar } from '../search/SearchFilterSidebar';

interface ProductFilterSidebarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onClearAll: () => void;
  className?: string;
}

/** Products page reuses marketplace filter sidebar (category, price, rating, flags) */
export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = (props) => (
  <SearchFilterSidebar {...props} />
);
