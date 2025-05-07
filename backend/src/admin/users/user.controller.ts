import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
  ApiPaginationQuery,
  FilterOperator,
  Paginate,
  Paginated,
  PaginateQuery,
} from 'nestjs-paginate';

import { UpdateUserDto } from '@app/dto';
import { JwtAdminAuthGuard, RolesGuard } from '@app/guards';
import { AllowRoles } from '@app/decorators';
import { Roles } from '@app/enums';
import { User } from '@app/entities';

import { AdminUsersService } from './user.service';

@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(JwtAdminAuthGuard, RolesGuard)
@AllowRoles(Roles.Admin)
export class AdminUsersController {
  constructor(private readonly userService: AdminUsersService) {}

  // TODO move this to separate config file
  @ApiPaginationQuery({
    sortableColumns: ['id', 'firstName', 'lastName', 'createdAt', 'email'],
    filterableColumns: {
      firstName: true,
      lastName: true,
      email: true,
      role: [FilterOperator.EQ],
      createdAt: true,
    },
  })
  @Get()
  async index(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return this.userService.index(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
