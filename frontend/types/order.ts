import { User } from './user';
import { Product } from './product';

export type DeliveryStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
export type PaymentStatus = 'succeeded' | 'failed' | 'pending';

export interface Order {
  id: number;
  userId: number;
  productId: number;
  stripePaymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
  user: User;
  product: Product;
}

export interface OrdersResponse {
  message: string;
  code: number;
  data: Order[];
}
