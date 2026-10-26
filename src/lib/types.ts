export type Category = "main" | "appetizer" | "soup" | "dessert";
export type PaymentMethod = "cash" | "etransfer" | "card";
export type Fulfillment = "pickup" | "delivery";
export type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_cook: boolean;
  slug: string | null;
  kitchen_name: string | null;
  bio: string | null;
  area: string | null;
  whatsapp: string | null;
  accepts_cash: boolean;
  accepts_etransfer: boolean;
  accepts_card: boolean;
  etransfer_email: string | null;
  offers_pickup: boolean;
  offers_delivery: boolean;
  delivery_fee_cents: number;
  stripe_account_id: string | null;
  stripe_charges_enabled: boolean;
  cover_url: string | null;
  cuisines: string[];
  created_at: string;
};

export type Dish = {
  id: string;
  cook_id: string;
  name: string;
  description: string | null;
  category: Category;
  price_cents: number;
  photo_url: string | null;
  available: boolean;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  dish_id: string | null;
  dish_name: string;
  unit_price_cents: number;
  quantity: number;
};

/** A kitchen as shown on the home page. */
export type KitchenCard = {
  id: string;
  slug: string;
  kitchen_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  area: string | null;
  cuisines: string[];
  offers_pickup: boolean;
  offers_delivery: boolean;
  cover: string | null;
  popular: Pick<Dish, "id" | "name" | "price_cents">[];
  matches: Pick<Dish, "id" | "name" | "price_cents">[] | null;
};

export type Order = {
  id: string;
  cook_id: string;
  dish_id: string | null;
  buyer_id: string | null;
  /** Short summary of what was ordered, e.g. "2 × Chicken Adobo, 1 × Leche Flan". */
  dish_name: string;
  /** Total number of meals in the order. */
  quantity: number;
  delivery_fee_cents: number;
  total_cents: number;
  buyer_name: string;
  buyer_phone: string;
  note: string | null;
  fulfillment: Fulfillment;
  payment_method: PaymentMethod;
  status: OrderStatus;
  paid: boolean;
  stripe_session_id: string | null;
  created_at: string;
  completed_at: string | null;
};

export type OrderWithItems = Order & { items: OrderItem[] };
