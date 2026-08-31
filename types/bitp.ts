/** Bridge IT Park domain types */

export type BitpUserRole = 'client' | 'admin' | 'super_admin' | 'buyer' | 'seller';

export type ProductStatus = 'draft' | 'published' | 'archived';
export type PricingType = 'fixed' | 'starting_from' | 'package' | 'custom_quote' | 'subscription';
export type ProductType =
  | 'service'
  | 'software'
  | 'website'
  | 'marketing'
  | 'creative'
  | 'digital_product'
  | 'subscription';

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
