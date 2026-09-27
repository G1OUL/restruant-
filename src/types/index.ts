export type DietType = 'veg' | 'non-veg' | 'egg';

export type PortionType = 'half' | 'full';

export type Category = 
  | 'Veg Soups'
  | 'Non-Veg Soups'
  | 'Egg Soups'
  | 'Veg Starters'
  | 'Non-Veg Starters'
  | 'Veg Rice'
  | 'Egg Rice'
  | 'Non-Veg Rice'
  | 'Veg Noodles'
  | 'Egg Noodles'
  | 'Non-Veg Noodles';

export type MainCategory = 'All' | 'Soups' | 'Starters' | 'Rice' | 'Noodles';

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  diet: DietType;
  description: string;
  hasPortions: boolean;
  priceHalf?: number;
  priceFull: number;
  isAvailable: boolean;
  image: string;
  isSpicy?: boolean;
  isChefSpecial?: boolean;
  isPopular?: boolean;
  servesHalf?: string;
  servesFull?: string;
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  name: string;
  category: Category;
  diet: DietType;
  portion: PortionType;
  price: number;
  quantity: number;
  image: string;
  specialInstructions?: string;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';

export type PaymentStatus = 'unpaid' | 'bill_requested' | 'paid_cash' | 'paid_online';

export interface Order {
  id: string;
  orderNumber: number;
  tableNumber: string;
  items: CartItem[];
  subtotal: number;
  timePassCharge: number; // 20 if order < 250
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  specialInstructions?: string;
  createdAt: string; // ISO string
  updatedAt: string;
}

export type ServiceAlertType = 'call_waiter' | 'request_bill' | 'water' | 'cutlery';

export interface ServiceAlert {
  id: string;
  tableNumber: string;
  type: ServiceAlertType;
  message: string;
  createdAt: string;
  isResolved: boolean;
}

export type UserRole = 'customer' | 'waiter' | 'kitchen';

export interface RestaurantInfo {
  name: string;
  hindiName: string;
  tagline: string;
  type: string;
  address: string;
  landmark: string;
  contact: string[];
  minOrderNote: string;
  extraChargeNote: string;
}
