export enum DeliveryStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  RIDER_EN_ROUTE_PICKUP = 'RIDER_EN_ROUTE_PICKUP',
  AT_PICKUP = 'AT_PICKUP',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  AT_DROPOFF = 'AT_DROPOFF',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum ParcelCategory {
  DOCUMENTS = 'DOCUMENTS',
  ELECTRONICS = 'ELECTRONICS',
  FOOD = 'FOOD',
  CLOTHING = 'CLOTHING',
  MEDICINE = 'MEDICINE',
  FRAGILE = 'FRAGILE',
  CASH = 'CASH',
  OTHER = 'OTHER',
}

export enum PriorityLevel {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  SAME_DAY = 'SAME_DAY',
}

export enum PaymentMethod {
  WALLET = 'WALLET',
  CARD = 'CARD',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, { fr: string; en: string }> = {
  [DeliveryStatus.DRAFT]: { fr: 'Brouillon', en: 'Draft' },
  [DeliveryStatus.PENDING]: { fr: 'En attente', en: 'Pending' },
  [DeliveryStatus.ASSIGNED]: { fr: 'Coursier assigné', en: 'Rider assigned' },
  [DeliveryStatus.RIDER_EN_ROUTE_PICKUP]: { fr: 'En route vers la collecte', en: 'En route to pickup' },
  [DeliveryStatus.AT_PICKUP]: { fr: 'À l\'adresse de collecte', en: 'At pickup location' },
  [DeliveryStatus.PICKED_UP]: { fr: 'Colis collecté', en: 'Package picked up' },
  [DeliveryStatus.IN_TRANSIT]: { fr: 'En transit', en: 'In transit' },
  [DeliveryStatus.AT_DROPOFF]: { fr: 'À destination', en: 'At dropoff location' },
  [DeliveryStatus.DELIVERED]: { fr: 'Livré', en: 'Delivered' },
  [DeliveryStatus.FAILED]: { fr: 'Échec de livraison', en: 'Delivery failed' },
  [DeliveryStatus.CANCELLED]: { fr: 'Annulé', en: 'Cancelled' },
  [DeliveryStatus.REFUNDED]: { fr: 'Remboursé', en: 'Refunded' },
};

export const TERMINAL_STATUSES: DeliveryStatus[] = [
  DeliveryStatus.DELIVERED,
  DeliveryStatus.FAILED,
  DeliveryStatus.CANCELLED,
  DeliveryStatus.REFUNDED,
];

export const ACTIVE_STATUSES: DeliveryStatus[] = [
  DeliveryStatus.ASSIGNED,
  DeliveryStatus.RIDER_EN_ROUTE_PICKUP,
  DeliveryStatus.AT_PICKUP,
  DeliveryStatus.PICKED_UP,
  DeliveryStatus.IN_TRANSIT,
  DeliveryStatus.AT_DROPOFF,
];
