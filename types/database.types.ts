export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'buyer' | 'seller' | 'admin';
export type ProductStatus = 'active' | 'draft' | 'archived';
export type ProductType =
  | 'product'
  | 'service'
  | 'course'
  | 'software'
  | 'ad'
  | 'digital-product';
export type SellerStatus = 'active' | 'inactive' | 'suspended';
export type OrderStatus = 'pending' | 'in-progress' | 'review' | 'completed' | 'cancelled';
export type MessageType = 'text' | 'file' | 'image';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          seller_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          seller_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          seller_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_seller_id_fkey';
            columns: ['seller_id'];
            isOneToOne: false;
            referencedRelation: 'sellers';
            referencedColumns: ['id'];
          },
        ];
      };
      sellers: {
        Row: {
          id: string;
          user_id: string | null;
          slug: string;
          name: string;
          tagline: string | null;
          avatar_url: string | null;
          cover_image_url: string | null;
          description: string | null;
          location: string | null;
          category_key: string | null;
          rating: number;
          review_count: number;
          verified: boolean;
          seller_level: string;
          completed_projects: number;
          response_time: string | null;
          joined_at: string;
          is_public: boolean;
          status: SellerStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          slug: string;
          name: string;
          tagline?: string | null;
          avatar_url?: string | null;
          cover_image_url?: string | null;
          description?: string | null;
          location?: string | null;
          category_key?: string | null;
          rating?: number;
          review_count?: number;
          verified?: boolean;
          seller_level?: string;
          completed_projects?: number;
          response_time?: string | null;
          joined_at?: string;
          is_public?: boolean;
          status?: SellerStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          slug?: string;
          name?: string;
          tagline?: string | null;
          avatar_url?: string | null;
          cover_image_url?: string | null;
          description?: string | null;
          location?: string | null;
          category_key?: string | null;
          rating?: number;
          review_count?: number;
          verified?: boolean;
          seller_level?: string;
          completed_projects?: number;
          response_time?: string | null;
          joined_at?: string;
          is_public?: boolean;
          status?: SellerStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          key: string;
          label: string;
          slug: string;
          icon: string;
          description: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          label: string;
          slug: string;
          icon?: string;
          description?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          label?: string;
          slug?: string;
          icon?: string;
          description?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_description: string;
          description: string;
          category_id: string;
          seller_id: string;
          price: number;
          old_price: number | null;
          rating: number;
          reviews_count: number;
          delivery_time: string;
          image_url: string;
          badge: string | null;
          seller_level: string;
          is_featured: boolean;
          is_promoted: boolean;
          product_type: ProductType;
          metadata: Json;
          status: ProductStatus;
          search_vector: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          short_description?: string;
          description?: string;
          category_id: string;
          seller_id: string;
          price: number;
          old_price?: number | null;
          rating?: number;
          reviews_count?: number;
          delivery_time?: string;
          image_url?: string;
          badge?: string | null;
          seller_level?: string;
          is_featured?: boolean;
          is_promoted?: boolean;
          product_type?: ProductType;
          metadata?: Json;
          status?: ProductStatus;
          search_vector?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          short_description?: string;
          description?: string;
          category_id?: string;
          seller_id?: string;
          price?: number;
          old_price?: number | null;
          rating?: number;
          reviews_count?: number;
          delivery_time?: string;
          image_url?: string;
          badge?: string | null;
          seller_level?: string;
          is_featured?: boolean;
          is_promoted?: boolean;
          product_type?: ProductType;
          metadata?: Json;
          status?: ProductStatus;
          search_vector?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'products_seller_id_fkey';
            columns: ['seller_id'];
            isOneToOne: false;
            referencedRelation: 'sellers';
            referencedColumns: ['id'];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          sort_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt_text?: string | null;
          sort_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      product_tags: {
        Row: {
          id: string;
          product_id: string;
          tag: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          tag: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          tag?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_tags_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          reviewer_name: string;
          reviewer_avatar: string | null;
          rating: number;
          title: string;
          comment: string;
          verified: boolean;
          helpful_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          reviewer_name: string;
          reviewer_avatar?: string | null;
          rating: number;
          title?: string;
          comment?: string;
          verified?: boolean;
          helpful_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          reviewer_name?: string;
          reviewer_avatar?: string | null;
          rating?: number;
          title?: string;
          comment?: string;
          verified?: boolean;
          helpful_count?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          seller_id: string;
          product_id: string | null;
          status: OrderStatus;
          total_amount: number;
          currency: string;
          delivery_date: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          seller_id: string;
          product_id?: string | null;
          status?: OrderStatus;
          total_amount: number;
          currency?: string;
          delivery_date?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          seller_id?: string;
          product_id?: string | null;
          status?: OrderStatus;
          total_amount?: number;
          currency?: string;
          delivery_date?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          buyer_id: string;
          seller_id: string;
          subject: string | null;
          last_message_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          seller_id: string;
          subject?: string | null;
          last_message_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          seller_id?: string;
          subject?: string | null;
          last_message_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          message_type: MessageType;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          message_type?: MessageType;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          message_type?: MessageType;
          read_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          read: boolean;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type?: string;
          title: string;
          body?: string;
          read?: boolean;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string;
          read?: boolean;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      seller_applications: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          business_name: string;
          display_name: string;
          category_focus: string;
          services_offered: string[];
          portfolio_url: string | null;
          social_links: Json;
          phone: string;
          location: string;
          bio: string;
          experience_level: string;
          ad_interest: boolean;
          ad_budget_range: string | null;
          status: string;
          admin_note: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          business_name: string;
          display_name: string;
          category_focus: string;
          services_offered?: string[];
          portfolio_url?: string | null;
          social_links?: Json;
          phone: string;
          location: string;
          bio: string;
          experience_level: string;
          ad_interest?: boolean;
          ad_budget_range?: string | null;
          status?: string;
          admin_note?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          business_name?: string;
          display_name?: string;
          category_focus?: string;
          services_offered?: string[];
          portfolio_url?: string | null;
          social_links?: Json;
          phone?: string;
          location?: string;
          bio?: string;
          experience_level?: string;
          ad_interest?: boolean;
          ad_budget_range?: string | null;
          status?: string;
          admin_note?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      seller_documents: {
        Row: {
          id: string;
          application_id: string;
          user_id: string;
          document_type: string;
          file_url: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          user_id: string;
          document_type: string;
          file_url: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          user_id?: string;
          document_type?: string;
          file_url?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      seller_ad_preferences: {
        Row: {
          id: string;
          application_id: string;
          category_key: string;
          promotion_type: string;
          budget_range: string | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          category_key: string;
          promotion_type?: string;
          budget_range?: string | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          category_key?: string;
          promotion_type?: string;
          budget_range?: string | null;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      admin_audit_logs: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          table_name: string;
          record_id: string | null;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          action: string;
          table_name: string;
          record_id?: string | null;
          payload?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string | null;
          action?: string;
          table_name?: string;
          record_id?: string | null;
          payload?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      products_refresh_search_vector: {
        Args: { p_product_id: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type DbProduct = Tables<'products'>;
export type DbCategory = Tables<'categories'>;
export type DbSeller = Tables<'sellers'>;
export type DbReview = Tables<'reviews'>;

export type DbProductListItem = Pick<
  DbProduct,
  | 'id'
  | 'slug'
  | 'title'
  | 'short_description'
  | 'description'
  | 'category_id'
  | 'seller_id'
  | 'price'
  | 'old_price'
  | 'rating'
  | 'reviews_count'
  | 'delivery_time'
  | 'image_url'
  | 'badge'
  | 'seller_level'
  | 'is_featured'
  | 'is_promoted'
  | 'status'
  | 'created_at'
  | 'updated_at'
>;

export type DbProductSearchHit = Pick<
  DbProduct,
  | 'id'
  | 'slug'
  | 'title'
  | 'short_description'
  | 'price'
  | 'rating'
  | 'reviews_count'
  | 'delivery_time'
  | 'image_url'
  | 'badge'
  | 'seller_level'
  | 'is_featured'
  | 'is_promoted'
  | 'category_id'
  | 'seller_id'
>;

export type ProductWithRelations = DbProduct & {
  categories: Pick<DbCategory, 'key' | 'label' | 'slug'> | null;
  sellers: Pick<DbSeller, 'slug' | 'name' | 'seller_level'> | null;
  product_tags: { tag: string }[];
  product_images: { url: string; sort_order: number; is_primary: boolean }[];
};
