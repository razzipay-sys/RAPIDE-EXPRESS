import type { DeliveryStatus } from '../enums/delivery';

export enum WsEvent {
  // Rider → Server
  RIDER_LOCATION_UPDATE = 'rider:location:update',
  RIDER_STATUS_CHANGE = 'rider:status:change',
  DELIVERY_ACCEPT = 'delivery:accept',
  DELIVERY_REJECT = 'delivery:reject',
  DELIVERY_STATUS_UPDATE = 'delivery:status:update',

  // Server → Client
  NEW_DELIVERY_REQUEST = 'dispatch:new_request',
  DELIVERY_CANCELLED = 'delivery:cancelled',
  TRACKING_UPDATE = 'tracking:update',
  RIDER_LOCATION_BROADCAST = 'rider:location:broadcast',
}

export interface RiderLocationPayload {
  riderId: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export interface TrackingUpdate {
  deliveryId: string;
  status: DeliveryStatus;
  riderLocation: {
    latitude: number;
    longitude: number;
  } | null;
  estimatedMinutes: number | null;
  timestamp: number;
}

export interface DispatchRequest {
  requestId: string;
  deliveryId: string;
  trackingCode: string;
  pickupAddress: string;
  dropoffAddress: string;
  distanceKm: number;
  fare: number;
  expiresAt: number;
}
