export type CategoryId = 'all' | 'cakes' | 'vegetables' | 'fruits' | 'produce' | 'bakery' | 'dairy' | 'beverages';

export interface Product {
  id: string;
  name: string;
  category: 'Cakes' | 'Vegetables' | 'Fruits' | 'Produce' | 'Dairy' | 'Beverages' | 'Bakery';
  categoryId: CategoryId;
  price: number;
  unit: string;
  image: string;
  imageAlt?: string;
  isTopPick?: boolean;
  organic?: boolean;
  weightOrVolume?: string;
  badge?: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  postalCode: string;
  timeSlot?: string;
  notes?: string;
}

export type PaymentMethodType = 'esewa' | 'card' | 'cod';

export type OrderStatus = 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';

export interface Order {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  nprTotal?: number;
  deliveryInfo: DeliveryInfo;
  paymentMethod: PaymentMethodType;
  paymentRef?: string;
  status: OrderStatus;
  date: string;
  createdAt: string;
  estimatedDelivery: string;
}

