import { Product } from './productTypes';

export interface Order {
  id: number;
  product: Product;
  stripePaymentStatus: string;
  deliveryStatus: string;
  createdAt: Date;
  updatedAt: Date;
}
