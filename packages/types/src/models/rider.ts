import type { KycStatus, RiderOnlineStatus, RiderStatus, VehicleType } from '../enums/rider';

export interface Rider {
  id: string;
  userId: string;
  status: RiderStatus;
  onlineStatus: RiderOnlineStatus;
  vehicleType: VehicleType;
  vehiclePlate: string;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleYear: number | null;
  rating: number;
  totalDeliveries: number;
  acceptanceRate: number;
  completionRate: number;
  level: number;
  xpPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiderDocument {
  id: string;
  riderId: string;
  documentType: string;
  fileUrl: string;
  status: KycStatus;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  rejectReason: string | null;
  expiresAt: Date | null;
  createdAt: Date;
}

export interface RiderLocation {
  riderId: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export interface RiderStats {
  riderId: string;
  totalEarnings: number;
  todayEarnings: number;
  weekEarnings: number;
  totalOnlineMinutes: number;
  avgRating: number;
  lastUpdated: Date;
}

export interface RiderWithLocation extends Rider {
  currentLocation: RiderLocation | null;
}
