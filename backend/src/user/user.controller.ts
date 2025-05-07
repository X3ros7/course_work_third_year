import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Req,
  UploadedFile,
  UseInterceptors,
  Body,
  Post,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

import { ChangePasswordDto, UpdateUserDto } from '@app/dto';
import { User, UserFavorite, Order } from '@app/entities';
import { JwtAuthGuard, RolesGuard } from '@app/guards';
import { AuthRequest } from '@app/interfaces';
import { AllowRoles } from '@app/decorators';
import { Roles } from '@app/enums';

import { UserService } from './user.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@AllowRoles(Roles.User)
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('me')
  me(@Req() { user }: AuthRequest): User {
    return user;
  }

  @Get('favorites')
  async favorites(@Req() { user }: AuthRequest): Promise<UserFavorite[]> {
    return this.service.favorites(user);
  }

  @Get('orders')
  async orders(@Req() { user }: AuthRequest): Promise<Order[]> {
    return this.service.orders(user);
  }

  @Post('change-password')
  changePassword(
    @Req() { user }: AuthRequest,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    return this.service.changePassword(user, dto);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Patch('update')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Req() { user }: AuthRequest,
    @Body() dto: UpdateUserDto,
    @UploadedFile()
    avatar?: Express.Multer.File,
  ): Promise<User> {
    return this.service.update(user, dto, avatar);
  }
}
