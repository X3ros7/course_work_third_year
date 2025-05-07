import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '@app/enums';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('Not authorized');
    }

    if (user.role !== Roles.User) {
      throw new ForbiddenException('Only authenticated users are allowed');
    }

    if (!user.isVerified) {
      throw new ForbiddenException(
        'User is not verified. Please, confirm email address first',
      );
    }

    if (user.isBlocked) {
      throw new ForbiddenException('User is blocked');
    }

    return user;
  }
}
