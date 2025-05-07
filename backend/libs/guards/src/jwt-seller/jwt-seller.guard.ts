import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthSellerGuard extends AuthGuard('jwt-seller') {
  handleRequest(err: any, seller: any, info: any, context: ExecutionContext) {
    if (err || !seller) {
      throw new ForbiddenException('Only authenticated sellers are allowed');
    }

    if (!seller.isVerified) {
      throw new ForbiddenException(
        'Seller is not verified. Please, confirm email address first',
      );
    }

    if (seller.isBlocked) {
      throw new ForbiddenException('Seller is blocked');
    }

    const req = context.switchToHttp().getRequest();
    req.seller = seller;

    return seller;
  }

  getRequest(context: any) {
    const request = super.getRequest(context);
    request.seller = request.user;
    return request;
  }
}
