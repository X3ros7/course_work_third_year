import { Order, Product } from '@app/entities';

export interface SendMailQueueParams {
  firstName: string;
  email: string;
}

export interface SendReceiptSuccessMailQueueParams extends SendMailQueueParams {
  product: Product;
  order: Order;
  receipt: Buffer;
}

export interface SendCodeMailQueueParams extends SendMailQueueParams {
  code: number;
}

export interface UploadQueueParams {
  file: Express.Multer.File;
  id: number;
}
