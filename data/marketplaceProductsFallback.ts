import { MAIN_PRODUCT_CATEGORIES } from '@/constants/mainProductCategories';
import type {
  MarketplaceProduct,
  MarketplaceProductCategory,
  MarketplaceProductHomeData,
} from '@/types/marketplaceProduct';

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

type ProductSeed = {
  name: string;
  categorySlug: string;
  price: number;
  comparePrice?: number;
  stock: number;
  brand: string;
  tags: string[];
  isPopular?: boolean;
  isFeatured?: boolean;
};

const PRODUCT_SEEDS: ProductSeed[] = [
  // Electronics
  { name: 'Dell Inspiron Business Laptop', categorySlug: 'electronics', price: 72000, comparePrice: 78000, stock: 12, brand: 'Dell', tags: ['laptop', 'business'], isFeatured: true },
  { name: 'HP ProBook Business Laptop', categorySlug: 'electronics', price: 68000, comparePrice: 74000, stock: 8, brand: 'HP', tags: ['laptop'] },
  { name: 'Samsung 27" Business Monitor', categorySlug: 'electronics', price: 28000, stock: 24, brand: 'Samsung', tags: ['monitor', 'display'], isPopular: true },
  { name: 'Logitech C920 HD Webcam', categorySlug: 'electronics', price: 6500, stock: 45, brand: 'Logitech', tags: ['webcam'] },
  { name: 'Mechanical Keyboard Pro', categorySlug: 'electronics', price: 4500, comparePrice: 5200, stock: 30, brand: 'Keychron', tags: ['keyboard'] },
  { name: 'Wireless Mouse Ergonomic', categorySlug: 'electronics', price: 2200, stock: 60, brand: 'Logitech', tags: ['mouse'] },
  { name: 'UPS 1000VA Backup', categorySlug: 'electronics', price: 8500, stock: 18, brand: 'Digital', tags: ['ups', 'power'] },
  { name: 'External SSD 1TB', categorySlug: 'electronics', price: 9500, stock: 35, brand: 'Samsung', tags: ['storage', 'ssd'], isPopular: true },
  // Gadgets
  { name: 'Wireless Earbuds Pro', categorySlug: 'gadgets', price: 3500, comparePrice: 4200, stock: 80, brand: 'SoundMax', tags: ['earbuds', 'audio'], isPopular: true },
  { name: 'Smart Watch Fitness', categorySlug: 'gadgets', price: 5500, stock: 40, brand: 'FitBand', tags: ['watch', 'wearable'] },
  { name: '20000mAh Power Bank', categorySlug: 'gadgets', price: 2800, stock: 100, brand: 'Anker', tags: ['power-bank'], isFeatured: true },
  { name: 'USB-C Hub 7-in-1', categorySlug: 'gadgets', price: 3200, stock: 55, brand: 'Baseus', tags: ['hub', 'usb'] },
  { name: 'Bluetooth Speaker Portable', categorySlug: 'gadgets', price: 4200, stock: 42, brand: 'JBL', tags: ['speaker', 'audio'] },
  { name: 'Phone Tripod Stand', categorySlug: 'gadgets', price: 1200, stock: 70, brand: 'Ulanzi', tags: ['tripod'] },
  { name: 'Laptop Cooling Pad', categorySlug: 'gadgets', price: 1800, stock: 38, brand: 'CoolMaster', tags: ['laptop-accessory'] },
  { name: 'Ring Light 10"', categorySlug: 'gadgets', price: 2500, stock: 50, brand: 'Neewer', tags: ['lighting', 'content'] },
  // Office Solutions
  { name: 'Thermal POS Printer', categorySlug: 'office-solutions', price: 12500, stock: 22, brand: 'Xprinter', tags: ['pos', 'printer'], isFeatured: true },
  { name: 'Barcode Scanner USB', categorySlug: 'office-solutions', price: 4500, stock: 35, brand: 'Honeywell', tags: ['barcode', 'scanner'] },
  { name: 'Cash Drawer RJ11', categorySlug: 'office-solutions', price: 6800, stock: 15, brand: 'Posiflex', tags: ['cash-drawer', 'pos'] },
  { name: 'Biometric Attendance Machine', categorySlug: 'office-solutions', price: 15000, stock: 10, brand: 'ZKTeco', tags: ['attendance'], isPopular: true },
  { name: 'Office WiFi Router Dual Band', categorySlug: 'office-solutions', price: 5500, stock: 28, brand: 'TP-Link', tags: ['router', 'network'] },
  { name: 'Document Scanner A4', categorySlug: 'office-solutions', price: 18500, stock: 8, brand: 'Canon', tags: ['scanner'] },
  { name: 'Label Printer 4x6', categorySlug: 'office-solutions', price: 9800, stock: 14, brand: 'Brother', tags: ['label', 'shipping'] },
  { name: 'Conference Speakerphone', categorySlug: 'office-solutions', price: 12000, stock: 12, brand: 'Jabra', tags: ['conference', 'audio'] },
  // Smart Devices
  { name: 'Smart CCTV 4 Channel Kit', categorySlug: 'smart-devices', price: 22000, comparePrice: 25000, stock: 16, brand: 'Hikvision', tags: ['cctv', 'security'], isFeatured: true },
  { name: 'Smart Door Lock Fingerprint', categorySlug: 'smart-devices', price: 14500, stock: 11, brand: 'Tuya', tags: ['lock', 'smart-home'] },
  { name: 'Smart LED Bulb Pack (4)', categorySlug: 'smart-devices', price: 2800, stock: 48, brand: 'Philips', tags: ['lighting', 'smart'] },
  { name: 'Smart Home Hub', categorySlug: 'smart-devices', price: 8500, stock: 20, brand: 'Aqara', tags: ['hub', 'automation'] },
  { name: 'Smart IP Camera WiFi', categorySlug: 'smart-devices', price: 4200, stock: 32, brand: 'Ezviz', tags: ['camera', 'wifi'], isPopular: true },
  { name: 'Motion Sensor PIR', categorySlug: 'smart-devices', price: 1500, stock: 55, brand: 'Tuya', tags: ['sensor'] },
  { name: 'Smart Plug 16A (2 Pack)', categorySlug: 'smart-devices', price: 2200, stock: 60, brand: 'Sonoff', tags: ['plug'] },
  { name: 'Video Doorbell WiFi', categorySlug: 'smart-devices', price: 7500, stock: 18, brand: 'Xiaomi', tags: ['doorbell', 'security'] },
  // Digital Products
  { name: 'POS Software License (1 Year)', categorySlug: 'digital-products', price: 15000, stock: 999, brand: 'DeshiPOS', tags: ['pos', 'license'], isFeatured: true },
  { name: 'Accounting Software License', categorySlug: 'digital-products', price: 12000, stock: 999, brand: 'AccountsBD', tags: ['accounting', 'license'] },
  { name: 'Inventory Management Software', categorySlug: 'digital-products', price: 18000, comparePrice: 22000, stock: 999, brand: 'StockFlow', tags: ['inventory'], isPopular: true },
  { name: 'ERP Starter License', categorySlug: 'digital-products', price: 45000, stock: 999, brand: 'BizERP', tags: ['erp', 'license'] },
  { name: 'CRM Dashboard Template', categorySlug: 'digital-products', price: 8000, stock: 999, brand: 'TemplateHub', tags: ['crm', 'template'] },
  { name: 'HR Payroll Module License', categorySlug: 'digital-products', price: 25000, stock: 999, brand: 'PayrollBD', tags: ['hrm', 'payroll'] },
  { name: 'E-commerce Admin Dashboard UI', categorySlug: 'digital-products', price: 6500, stock: 999, brand: 'UIForge', tags: ['ui', 'template'] },
  { name: 'School Management System License', categorySlug: 'digital-products', price: 35000, stock: 999, brand: 'EduSoft', tags: ['school', 'license'] },
];

function productThumb(categorySlug: string, name: string): string {
  const bg = {
    electronics: '0ea5e9',
    gadgets: '8b5cf6',
    'office-solutions': '64748b',
    'smart-devices': '10b981',
    'digital-products': 'f59e0b',
  }[categorySlug] ?? '10b981';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=512&bold=true`;
}

function buildCategories(): MarketplaceProductCategory[] {
  return MAIN_PRODUCT_CATEGORIES.map((cat, i) => ({
    id: `mp-prod-cat-${cat.slug}`,
    slug: cat.slug,
    name: cat.name,
    description: cat.description,
    icon: null,
    sortOrder: i + 1,
    isFeatured: true,
  }));
}

function buildProducts(categories: MarketplaceProductCategory[]): MarketplaceProduct[] {
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  return PRODUCT_SEEDS.map((seed, index) => {
    const category = bySlug.get(seed.categorySlug)!;
    const slug = slugify(seed.name);
    return {
      id: `mp-prod-${slug}`,
      slug,
      categoryId: category.id,
      categorySlug: category.slug,
      categoryName: category.name,
      name: seed.name,
      shortDescription: `${seed.name} — premium ${category.name.toLowerCase()} for Bangladeshi businesses.`,
      fullDescription: `High-quality ${seed.name} from ${seed.brand}. Ideal for SMEs and growing companies in Bangladesh.`,
      thumbnailUrl: productThumb(seed.categorySlug, seed.name),
      gallery: [],
      price: seed.price,
      comparePrice: seed.comparePrice ?? null,
      currency: 'BDT',
      stock: seed.stock,
      brand: seed.brand,
      sku: `DF-${String(index + 1).padStart(4, '0')}`,
      tags: seed.tags,
      specifications: {},
      isFeatured: seed.isFeatured ?? false,
      isPopular: seed.isPopular ?? false,
      rating: 4.6 + (index % 4) * 0.1,
      reviewCount: 18 + (index * 7) % 120,
    };
  });
}

export function getMarketplaceProductsFallbackData(): MarketplaceProductHomeData {
  const categories = buildCategories();
  return { categories, products: buildProducts(categories) };
}
