import { Request } from 'express';

import { Seller, User } from '@app/entities';

export interface AuthRequest extends Request {
  user: User;
}

export interface SellerAuthRequest extends Request {
  seller: Seller;
}
