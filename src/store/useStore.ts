import { create } from 'zustand';
import { PageType, CategoryType, Service } from '../types';

interface CartItem {
  service: Service;
  quantity: number;
}

interface AppState {
  currentPage: PageType;
  selectedCategory: CategoryType | null;
  selectedServiceId: string | null;
  selectedSellerId: string | null;
  searchQuery: string;
  cart: CartItem[];
  isMenuOpen: boolean;
  isChatOpen: boolean;
  isDarkMode: boolean;
  notification: string | null;
  
  setPage: (page: PageType) => void;
  setCategory: (category: CategoryType | null) => void;
  setSelectedService: (id: string | null) => void;
  setSelectedSeller: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  toggleMenu: () => void;
  toggleChat: () => void;
  setNotification: (msg: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  currentPage: 'home',
  selectedCategory: null,
  selectedServiceId: null,
  selectedSellerId: null,
  searchQuery: '',
  cart: [],
  isMenuOpen: false,
  isChatOpen: false,
  isDarkMode: true,
  notification: null,

  setPage: (page) => set({ currentPage: page, isMenuOpen: false }),
  setCategory: (category) => set({ selectedCategory: category }),
  setSelectedService: (id) => set({ selectedServiceId: id }),
  setSelectedSeller: (id) => set({ selectedSellerId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
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
