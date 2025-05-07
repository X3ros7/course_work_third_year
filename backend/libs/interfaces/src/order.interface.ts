export interface IOrder {
  productId: number;
  userId: number;
  paymentIntentId: string;
  paymentIntentStatus: string;
}
