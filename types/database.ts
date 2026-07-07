export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  price: number;
  stock: number;
  description: string;
  images: string[];
  created_at: string;
};

export type ProductWithCategory = Product & {
  categories: Pick<Category, "name" | "slug"> | null;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

export type OrderStatus = "beklemede" | "odendi" | "kargoda" | "tamamlandi" | "iptal";

export type Order = {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  currency: string;
  shipping_address: string;
  stripe_checkout_session_id: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
};

export type OrderWithItems = Order & { order_items: OrderItem[] };

export type Database = {
  public: {
    Tables: {
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> };
      products: { Row: Product; Insert: Partial<Product>; Update: Partial<Product> };
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      orders: { Row: Order; Insert: Partial<Order>; Update: Partial<Order> };
      order_items: { Row: OrderItem; Insert: Partial<OrderItem>; Update: Partial<OrderItem> };
    };
  };
};
