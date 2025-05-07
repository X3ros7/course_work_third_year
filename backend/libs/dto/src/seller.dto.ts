import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSellerDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isBlocked?: boolean;
}
