import { create } from 'zustand';
import { CategoryType, Service, SearchFilters, DEFAULT_SEARCH_FILTERS } from '@/types';
import type { SearchSortOption } from '@/lib/searchFilter';

interface CartItem {
  service: Service;
  quantity: number;
}

interface AppState {
  selectedCategory: CategoryType | null;
  searchQuery: string;
  searchFilters: SearchFilters;
  sortBy: SearchSortOption;
  viewMode: 'grid' | 'list';
  isSearchModalOpen: boolean;
  cart: CartItem[];
  isMenuOpen: boolean;
  isChatOpen: boolean;
  notification: string | null;

  setCategory: (category: CategoryType | null) => void;
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: SearchFilters) => void;
  updateSearchFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  setSortBy: (sort: SearchSortOption) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  resetFilters: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  toggleMenu: () => void;
  toggleChat: () => void;
  setNotification: (msg: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedCategory: null,
  searchQuery: '',
  searchFilters: { ...DEFAULT_SEARCH_FILTERS },
  sortBy: 'relevance',
  viewMode: 'grid',
  isSearchModalOpen: false,
  cart: [],
  isMenuOpen: false,
  isChatOpen: false,
  notification: null,

  setCategory: (category) =>
    set((state) => ({
      selectedCategory: category,
      searchFilters: category
        ? { ...state.searchFilters, category }
        : state.searchFilters,
    })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchFilters: (filters) => set({ searchFilters: filters }),
  updateSearchFilter: (key, value) =>
    set((state) => ({
      searchFilters: { ...state.searchFilters, [key]: value },
    })),
  setSortBy: (sort) => set({ sortBy: sort }),
  setViewMode: (mode) => set({ viewMode: mode }),
  resetFilters: () =>
    set({
      searchFilters: { ...DEFAULT_SEARCH_FILTERS },
      sortBy: 'relevance',
    }),
  openSearchModal: () => set({ isSearchModalOpen: true, isMenuOpen: false }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
  addToCart: (service) =>
    set((state) => {
      const existing = state.cart.find((item) => item.service.id === service.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.service.id === service.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          notification: 'Item quantity updated!',
        };
      }
      return {
        cart: [...state.cart, { service, quantity: 1 }],
        notification: 'Added to cart!',
      };
    }),
  removeFromCart: (serviceId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.service.id !== serviceId),
    })),
  clearCart: () => set({ cart: [] }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setNotification: (msg) => set({ notification: msg }),
}));

export const useSearchQuery = () => useStore((s) => s.searchQuery);
export const useSearchFilters = () => useStore((s) => s.searchFilters);
export const useMarketplaceUi = () =>
  useStore((s) => ({ sortBy: s.sortBy, viewMode: s.viewMode }));
