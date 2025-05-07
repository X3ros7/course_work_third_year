import { Track as ITrack } from '@app/interfaces';
import { ApiProperty, PartialType } from '@nestjs/swagger';

import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class Track implements ITrack {
  @ApiProperty()
  @IsNumber()
  number: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: Track, isArray: true })
  tracks?: Track[];

  @ApiProperty()
  @IsString()
  duration: string;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  genre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  artist: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1900)
  @IsNotEmpty()
  year: number;

  @ApiProperty({ type: Track, isArray: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const result = JSON.parse(value);
        console.log(result);
        return result;
      } catch (e) {
        console.error('Invalid trackList format:', value);
        return [];
      }
    }
    return value;
  })
  @IsArray()
  @IsNotEmpty()
  trackList: Track[];
}

export class ReviewDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;
}

export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  artist?: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1900)
  @IsOptional()
  year?: number;

  @ApiProperty({ type: Track, isArray: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const result = JSON.parse(value);
        console.log(result);
        return result;
      } catch (e) {
        console.error('Invalid trackList format:', value);
        return [];
      }
    }
    return value;
  })
  @IsArray()
  @IsOptional()
  trackList?: Track[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
