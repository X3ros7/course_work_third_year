import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '@app/enums';

@Injectable()
export class JwtAdminAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('Not authorized');
    }

    if (user.role !== Roles.Admin) {
      throw new ForbiddenException('Only authenticated admins are allowed');
    }

    if (!user.isVerified) {
      throw new ForbiddenException(
        'Admin is not verified. Please, confirm email address first',
      );
    }

    if (user.isBlocked) {
      throw new ForbiddenException('Admin is blocked');
    }

    return user;
  }
}
