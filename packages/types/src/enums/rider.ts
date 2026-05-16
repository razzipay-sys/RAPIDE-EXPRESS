export enum RiderStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  DOCUMENTS_REQUIRED = 'DOCUMENTS_REQUIRED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export enum RiderOnlineStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BUSY = 'busy',
}

export enum VehicleType {
  MOTORCYCLE = 'MOTORCYCLE',
  BICYCLE = 'BICYCLE',
  CAR = 'CAR',
  VAN = 'VAN',
  TRUCK = 'TRUCK',
}

export enum DocumentType {
  NATIONAL_ID = 'NATIONAL_ID',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  INSURANCE = 'INSURANCE',
  PROFILE_PHOTO = 'PROFILE_PHOTO',
}

export enum KycStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export const VEHICLE_TYPE_LABELS: Record<VehicleType, { fr: string; en: string }> = {
  [VehicleType.MOTORCYCLE]: { fr: 'Moto', en: 'Motorcycle' },
  [VehicleType.BICYCLE]: { fr: 'Vélo', en: 'Bicycle' },
  [VehicleType.CAR]: { fr: 'Voiture', en: 'Car' },
  [VehicleType.VAN]: { fr: 'Fourgonnette', en: 'Van' },
  [VehicleType.TRUCK]: { fr: 'Camion', en: 'Truck' },
};
