export interface Seller {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  coverImage: string;
  category: CategoryType;
  rating: number;
  reviewCount: number;
  verified: boolean;
  description: string;
  tagline: string;
  location: string;
  joinedDate: string;
  completedProjects: number;
  responseTime: string;
  services: Service[];
  gallery: GalleryItem[];
  customUrl: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  deliveryTime: string;
  thumbnail: string;
  category: CategoryType;
  subcategory: string;
  rating: number;
  reviewCount: number;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  features: string[];
  demoItems: GalleryItem[];
  tags: string[];
  popular: boolean;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video' | 'demo';
  url: string;
  thumbnail: string;
  title: string;
  protected: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'file' | 'image';
}

export interface Order {
  id: string;
  serviceId: string;
  buyerId: string;
  sellerId: string;
  status: 'pending' | 'in-progress' | 'review' | 'completed' | 'cancelled';
  totalAmount: number;
  currency: string;
  createdAt: string;
  deliveryDate: string;
  service: Service;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  serviceId: string;
}

export type CategoryType = 
  | '2d-animation'
  | '3d-animation'
  | 'video-ads'
  | 'software'
  | 'digital-products'
  | 'courses'
  | 'boosting-agency'
  | 'editing'
  | 'web-development'
  | 'mobile-apps'
  | 'ui-ux-design'
  | 'digital-marketing';

export interface Category {
  id: CategoryType;
  name: string;
  nameBn: string;
  icon: string;
  description: string;
  color: string;
  gradient: string;
  count: number;
}

export type PageType = 
  | 'home'
  | 'categories'
  | 'category-detail'
  | 'service-detail'
  | 'seller-profile'
  | 'messages'
  | 'cart'
  | 'dashboard'
  | 'admin-dashboard'
  | 'search'
  | 'about';
