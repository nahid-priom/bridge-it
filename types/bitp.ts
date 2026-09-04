/** Bridge IT Park domain types */

export type BitpUserRole = 'client' | 'admin' | 'super_admin' | 'buyer' | 'seller';

export type ProductStatus = 'draft' | 'published' | 'archived';
export type PricingType = 'fixed' | 'starting_from' | 'package' | 'custom_quote' | 'subscription';
export type ProductType =
  | 'ecommerce_website'
  | 'software_solution'
  | 'creative_digital_marketing'
  | 'mobile_app'
  | 'business_automation'
  | 'saas'
  | 'custom_development'
  /** @deprecated legacy values kept for DB rows until remapped */
  | 'service'
  | 'software'
  | 'website'
  | 'marketing'
  | 'creative'
  | 'digital_product'
  | 'subscription';

export const PRODUCT_TYPE_OPTIONS: Array<{ value: ProductType; label: string }> = [
  { value: 'ecommerce_website', label: 'E-commerce Website' },
  { value: 'software_solution', label: 'Software Solution' },
  { value: 'creative_digital_marketing', label: 'Creative & Digital Marketing' },
  { value: 'mobile_app', label: 'Mobile App' },
  { value: 'saas', label: 'SaaS' },
  { value: 'business_automation', label: 'Business Automation' },
  { value: 'custom_development', label: 'Custom Development' },
];

export type OrderStatus =
  | 'pending'
  | 'requirements_submitted'
  | 'confirmed'
  | 'in_progress'
  | 'waiting_client'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';
export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type ProjectStageStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';
export type ConsultationStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';

export type RequirementFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'radio'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone'
  | 'date'
  | 'file';

export interface BitpCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BitpProduct {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  thumbnail: string | null;
  cover_image: string | null;
  cover_image_path?: string | null;
  cover_image_alt?: string | null;
  cover_image_prompt?: string | null;
  cover_image_updated_at?: string | null;
  product_type: ProductType;
  pricing_type: PricingType;
  starting_price: number;
  currency: string;
  delivery_time: string | null;
  status: ProductStatus;
  featured: boolean;
  popular: boolean;
  sort_order: number;
  demo_url: string | null;
  preview_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  keywords: string[];
  target_customer?: string | null;
  promotional_price?: number | null;
  internal_demo_slug?: string | null;
  showroom_featured?: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  category?: BitpCategory;
}

export interface BitpProductPackage {
  id: string;
  product_id: string;
  name: string;
  subtitle: string | null;
  price: number;
  old_price: number | null;
  currency: string;
  billing_type: string;
  delivery_days: number | null;
  revision_count: number | null;
  highlighted: boolean;
  badge_text: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  features?: BitpPackageFeature[];
}

export interface BitpPackageFeature {
  id: string;
  package_id: string;
  feature_text: string;
  included: boolean;
  sort_order: number;
  created_at: string;
}

export interface BitpRequirementField {
  id: string;
  product_id: string;
  label: string;
  field_key: string;
  field_type: RequirementFieldType;
  placeholder: string | null;
  help_text: string | null;
  required: boolean;
  options: string[];
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BitpProductDetail extends BitpProduct {
  packages: BitpProductPackage[];
  requirement_fields: BitpRequirementField[];
  faqs?: BitpProductFaq[];
  stage_steps?: { id: string; title: string; description: string | null; duration_days: number | null; sort_order: number }[];
  demo_config?: EcommerceDemoConfig;
  software_demo_config?: SoftwareDemoConfig;
}

export interface BitpProductFaq {
  id: string;
  product_id: string;
  question: string;
  answer: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface DemoFeatureFlags {
  landingOnly?: boolean;
  catalog?: boolean;
  cart?: boolean;
  checkout?: boolean;
  customerAccount?: boolean;
  wishlist?: boolean;
  coupon?: boolean;
  variants?: boolean;
  stock?: boolean;
  courierFlow?: boolean;
  paymentGatewayUi?: boolean;
  fraudCheckerUi?: boolean;
  analytics?: boolean;
  adminPreview?: boolean;
  search?: boolean;
  returns?: boolean;
  purchaseStock?: boolean;
  roleAdmin?: boolean;
  seo?: boolean;
  pixelTracking?: boolean;
  advancedReports?: boolean;
}

export interface SoftwareFeatureFlags {
  dashboard?: boolean;
  products?: boolean;
  purchase?: boolean;
  sales?: boolean;
  stock?: boolean;
  reports?: boolean;
  parties?: boolean;
  ledger?: boolean;
  payments?: boolean;
  expenses?: boolean;
  transfer?: boolean;
  returns?: boolean;
  accounts?: boolean;
  employees?: boolean;
  roles?: boolean;
  bom?: boolean;
  production?: boolean;
  costing?: boolean;
  wastage?: boolean;
  requisition?: boolean;
  approval?: boolean;
  salesOrders?: boolean;
  delivery?: boolean;
  audit?: boolean;
}

export interface SoftwareDemoConfig {
  id: string;
  product_id: string;
  internal_demo_slug: string;
  demo_title: string;
  business_type: string;
  demo_description: string | null;
  package_level: number;
  theme_config: Record<string, unknown>;
  feature_flags: SoftwareFeatureFlags;
  workflow_config: string[];
  active: boolean;
  product?: BitpProduct;
  modules?: SoftwareDemoModule[];
}

export interface SoftwareDemoModule {
  id: string;
  demo_config_id: string;
  module_key: string;
  label: string;
  icon: string | null;
  sort_order: number;
  route_key: string;
  permissions: Record<string, unknown>;
  active: boolean;
}

export interface SoftwareDemoProduct {
  id: string;
  demo_config_id: string;
  session_id: string;
  sku: string;
  name: string;
  product_type: string;
  unit: string;
  opening_qty: number;
  current_qty: number;
  unit_cost: number;
  sale_price: number;
}

export interface SoftwareDemoParty {
  id: string;
  demo_config_id: string;
  session_id: string;
  party_type: string;
  name: string;
  phone: string | null;
  balance: number;
}

export interface SoftwareDemoPurchase {
  id: string;
  reference_no: string;
  supplier_id: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  lines?: { product_id: string; quantity: number; unit_cost: number; line_total: number }[];
}

export interface SoftwareDemoSale {
  id: string;
  reference_no: string;
  customer_id: string | null;
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  status: string;
  created_at: string;
}

export interface SoftwareDemoBom {
  id: string;
  name: string;
  finished_product_id: string;
  batch_size: number;
  lines?: { raw_product_id: string; quantity_per_batch: number }[];
}

export interface SoftwareDemoProductionOrder {
  id: string;
  reference_no: string;
  bom_id: string | null;
  batch_count: number;
  status: string;
  total_cost: number;
  wastage_qty: number;
  created_at: string;
}

export interface SoftwareDemoSessionSnapshot {
  products: SoftwareDemoProduct[];
  parties: SoftwareDemoParty[];
  purchases: SoftwareDemoPurchase[];
  sales: SoftwareDemoSale[];
  payments: { id: string; payment_type: string; amount: number; created_at: string }[];
  expenses: { id: string; category: string; amount: number; created_at: string }[];
  boms: SoftwareDemoBom[];
  productionOrders: SoftwareDemoProductionOrder[];
  requisitions: { id: string; reference_no: string; department: string; amount: number; status: string }[];
  salesOrders: { id: string; reference_no: string; total_amount: number; status: string }[];
  activity: { id: string; action_type: string; summary: string; created_at: string }[];
  metrics: SoftwareDemoMetrics;
}

export interface SoftwareDemoMetrics {
  totalProducts: number;
  totalStockValue: number;
  totalSales: number;
  totalPurchases: number;
  totalDue: number;
  totalExpenses: number;
  lowStockCount: number;
  profitEstimate: number;
}

export interface EcommerceDemoConfig {
  id: string;
  product_id: string;
  package_type: string;
  feature_flags: DemoFeatureFlags;
  theme: Record<string, unknown>;
  admin_modules: string[];
  product_limit: number;
  industry: string | null;
  active: boolean;
  product?: BitpProduct;
  categories?: DemoStoreCategory[];
  products?: DemoStoreProduct[];
}

export interface DemoStoreCategory {
  id: string;
  demo_config_id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
}

export interface DemoStoreProduct {
  id: string;
  demo_config_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  vertical: string | null;
  variants: DemoProductVariant[];
  stock: number;
  featured: boolean;
  sort_order: number;
  active: boolean;
}

export interface DemoProductVariant {
  id: string;
  label: string;
  price?: number;
  stock?: number;
}

export interface DemoOrder {
  id: string;
  demo_config_id: string;
  session_id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  subtotal: number;
  total: number;
  currency: string;
  payment_method: string;
  status: string;
  courier_status: string | null;
  is_demo: boolean;
  created_at: string;
  items?: DemoOrderItem[];
}

export interface DemoOrderItem {
  id: string;
  demo_order_id: string;
  product_name: string;
  product_slug: string | null;
  quantity: number;
  unit_price: number;
  total: number;
  variant_label: string | null;
}

export interface ProjectStageTemplate {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  steps?: ProjectStageTemplateStep[];
}

export interface ProjectStageTemplateStep {
  id: string;
  template_id: string;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface BitpOrder {
  id: string;
  order_number: string;
  client_id: string;
  product_id: string;
  package_id: string | null;
  quotation_id: string | null;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  product?: BitpProduct;
  package?: BitpProductPackage;
  client?: { id: string; full_name?: string | null; email?: string | null; phone?: string | null };
  requirements?: BitpOrderRequirement[];
}

export interface BitpOrderRequirement {
  id: string;
  order_id: string;
  field_id: string | null;
  field_key: string;
  label: string;
  value: string | null;
  value_json: unknown;
  created_at: string;
}

export interface BitpProject {
  id: string;
  order_id: string | null;
  client_id: string;
  title: string;
  description: string | null;
  status: string;
  progress_percent: number;
  start_date: string | null;
  expected_delivery_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  stages?: BitpProjectStage[];
}

export interface BitpProjectStage {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: ProjectStageStatus;
  sort_order: number;
  admin_note: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BitpQuotation {
  id: string;
  quotation_number: string;
  client_id: string;
  product_id: string | null;
  title: string;
  description: string | null;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  status: QuotationStatus;
  valid_until: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: BitpQuotationItem[];
}

export interface BitpQuotationItem {
  id: string;
  quotation_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

export interface BitpPayment {
  id: string;
  order_id: string | null;
  project_id: string | null;
  quotation_id: string | null;
  client_id: string;
  amount: number;
  currency: string;
  payment_method: string | null;
  transaction_reference: string | null;
  payment_status: string;
  proof_url: string | null;
  notes: string | null;
  created_at: string;
  verified_at: string | null;
  verified_by: string | null;
}

export interface BitpPortfolioItem {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  client_name: string | null;
  description: string | null;
  thumbnail: string | null;
  cover_image: string | null;
  project_url: string | null;
  case_study: string | null;
  featured: boolean;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BitpReview {
  id: string;
  client_id: string | null;
  client_name: string;
  company_name: string | null;
  designation: string | null;
  avatar_url: string | null;
  rating: number;
  review: string;
  featured: boolean;
  approved: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BitpSiteSetting {
  key: string;
  value: string;
  label: string | null;
  updated_at: string;
}

export interface BitpConsultationRequest {
  id: string;
  name: string;
  phone: string;
  business_name: string | null;
  service_interested: string | null;
  message: string | null;
  status: ConsultationStatus;
  created_at: string;
  updated_at: string;
}

export interface BitpConversationThread {
  id: string;
  client_id: string;
  order_id: string | null;
  project_id: string | null;
  quotation_id: string | null;
  subject: string | null;
  created_at: string;
  updated_at: string;
}

export interface BitpMessage {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface BitpNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  reference_type: string | null;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ProductSearchFilters {
  q?: string;
  category?: string;
  pricing_type?: PricingType;
  featured?: boolean;
  popular?: boolean;
  showroom_featured?: boolean;
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'newest';
  limit?: number;
  offset?: number;
}

export interface CreateOrderInput {
  product_id: string;
  package_id?: string | null;
  requirements: { field_key: string; label: string; value: string; field_id?: string }[];
  notes?: string;
}

export interface OrderStatusHistoryRow {
  id: string;
  order_id: string;
  status: string;
  notes: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface CreateConsultationInput {
  name: string;
  phone: string;
  business_name?: string;
  service_interested?: string;
  message?: string;
}
