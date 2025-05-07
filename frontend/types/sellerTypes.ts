import { BaseResponse } from './basicTypes';

export interface SellerLoginRequest {
  email: string;
  password: string;
}

export interface SellerRegisterRequest {
  email: string;
  name: string;
  password: string;
  description: string;
}

export interface Seller {
  id: number;
  name: string;
  description: string;
  isBlocked: boolean;
}

export interface SellerAuthResponse extends BaseResponse {
  data: {
    token: string;
    refreshToken: string;
    seller: Seller;
  };
}
