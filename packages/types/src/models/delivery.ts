import type { DeliveryStatus, ParcelCategory, PaymentMethod } from '../enums/delivery';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DeliveryAddress extends Coordinates {
  fullAddress: string;
  contactName?: string;
  contactPhone?: string;
}

export interface PriceEstimate {
  baseFare: number;
  distanceFare: number;
  weightSurcharge: number;
  surgeMultiplier: number;
  priorityPremium: number;
  insuranceFee: number;
  totalFare: number;
  platformFee: number;
  riderEarning: number;
  currency: 'XOF';
  distanceKm: number;
  estimatedMinutes: number;
  surgeActive: boolean;
}

export interface Delivery {
  id: string;
  trackingCode: string;
  status: DeliveryStatus;
  customerId: string;
  riderId: string | null;
  merchantId: string | null;

  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupContactName: string | null;
  pickupContactPhone: string | null;

  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  recipientName: string | null;
  recipientPhone: string;

  parcelCategory: ParcelCategory;
  weightKg: number | null;
  lengthCm: number | null;
  widthCm: number | null;
  heightCm: number | null;
  parcelImageUrl: string | null;
  deliveryNotes: string | null;

  distanceKm: number;
  baseFare: number;
  distanceFare: number;
  surgeMultiplier: number;
  priorityPremium: number;
  insuranceFee: number;
  totalFare: number;
  platformFee: number;
  riderEarning: number;

  isPriority: boolean;
  isInsured: boolean;
  isScheduled: boolean;
  scheduledFor: Date | null;
  paymentMethod: PaymentMethod;
  paymentStatus: string;

  assignedAt: Date | null;
  pickedUpAt: Date | null;
  deliveredAt: Date | null;
  cancelledAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryStop {
  id: string;
  deliveryId: string;
  sequence: number;
  address: string;
  latitude: number;
  longitude: number;
  contactName: string | null;
  contactPhone: string | null;
  notes: string | null;
  arrivedAt: Date | null;
}

export interface DeliveryTimelineEntry {
  id: string;
  deliveryId: string;
  status: DeliveryStatus;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  actorType: 'customer' | 'rider' | 'admin' | 'system' | null;
  createdAt: Date;
}
