import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ParcelCategory, PaymentMethod } from '@rapide/types';

export class CreateDeliveryDto {
  @IsString()
  pickupAddress: string;

  @IsNumber()
  @Min(-90) @Max(90)
  pickupLat: number;

  @IsNumber()
  @Min(-180) @Max(180)
  pickupLng: number;

  @IsOptional()
  @IsString()
  pickupContactName?: string;

  @IsOptional()
  @IsString()
  pickupContactPhone?: string;

  @IsString()
  dropoffAddress: string;

  @IsNumber()
  @Min(-90) @Max(90)
  dropoffLat: number;

  @IsNumber()
  @Min(-180) @Max(180)
  dropoffLng: number;

  @IsOptional()
  @IsString()
  recipientName?: string;

  @IsString()
  recipientPhone: string;

  @IsEnum(ParcelCategory)
  parcelCategory: ParcelCategory;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weightKg?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  deliveryNotes?: string;

  @IsOptional()
  @IsBoolean()
  isPriority?: boolean;

  @IsOptional()
  @IsBoolean()
  isInsured?: boolean;

  @IsOptional()
  @IsDateString()
  scheduledFor?: Date;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}
