export type Category = "main" | "appetizer" | "soup" | "dessert";
export type PaymentMethod = "cash" | "etransfer" | "card";
export type Fulfillment = "pickup" | "delivery";
export type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type Profile = {
  id: string;
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

export type DishWithCook = Dish & {
  cook: Pick<Profile, "kitchen_name" | "slug" | "area" | "avatar_url"> | null;
};

export type Order = {
  id: string;
  cook_id: string;
  dish_id: string | null;
  buyer_id: string | null;
  dish_name: string;
  unit_price_cents: number;
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
