import { Roles } from '@app/enums';

export interface Tokens {
  token: string;
  refreshToken: string;
}

export interface IAuthResult {
  token: string;
  refreshToken: string;
}

export interface UserAuthResult extends IAuthResult {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    role: Roles;
    isBlocked: boolean;
  };
}

export interface SellerAuthResult extends IAuthResult {
  seller: {
    id: number;
    name: string;
    description: string;
    isBlocked: boolean;
  };
}
