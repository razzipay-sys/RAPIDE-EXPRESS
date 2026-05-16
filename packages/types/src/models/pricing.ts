export interface PricingZone {
  id: string;
  name: string;
  slug: string;
  baseFare: number;
  perKmRate: number;
  minFare: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
}

export interface PricingRule {
  id: string;
  zoneId: string;
  ruleType: 'weight' | 'category' | 'time_of_day' | 'priority' | 'insurance';
  condition: {
    operator: 'gte' | 'lte' | 'eq' | 'in';
    value: number | string | string[];
  };
  multiplier: number | null;
  addedFee: number | null;
  priority: number;
  isActive: boolean;
}

export interface SurgeInfo {
  zone: string;
  multiplier: number;
  reason: string;
  expiresAt: number;
}
