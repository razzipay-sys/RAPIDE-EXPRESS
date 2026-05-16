import { IsBoolean, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ParcelCategory } from '@rapide/types';

export class PriceEstimateDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  pickupLat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  pickupLng: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  dropoffLat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  dropoffLng: number;

  @IsEnum(ParcelCategory)
  parcelCategory: ParcelCategory;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weightKg?: number;

  @IsOptional()
  @IsBoolean()
  isPriority?: boolean;

  @IsOptional()
  @IsBoolean()
  isInsured?: boolean;
}
