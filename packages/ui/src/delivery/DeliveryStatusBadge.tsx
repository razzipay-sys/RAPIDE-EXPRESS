import type { DeliveryStatus } from '@rapide/types';

import { Badge } from '../primitives/Badge';

const STATUS_CONFIG: Record<
  DeliveryStatus,
  { label: string; variant: 'default' | 'orange' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  DRAFT: { label: 'Brouillon', variant: 'default' },
  PENDING: { label: 'En attente', variant: 'warning' },
  ASSIGNED: { label: 'Assigné', variant: 'info' },
  RIDER_EN_ROUTE_PICKUP: { label: 'En route', variant: 'info' },
  AT_PICKUP: { label: 'À la collecte', variant: 'orange' },
  PICKED_UP: { label: 'Collecté', variant: 'orange' },
  IN_TRANSIT: { label: 'En transit', variant: 'orange' },
  AT_DROPOFF: { label: 'À destination', variant: 'orange' },
  DELIVERED: { label: 'Livré', variant: 'success' },
  FAILED: { label: 'Échec', variant: 'danger' },
  CANCELLED: { label: 'Annulé', variant: 'danger' },
  REFUNDED: { label: 'Remboursé', variant: 'default' },
};

interface DeliveryStatusBadgeProps {
  status: DeliveryStatus;
  locale?: 'fr' | 'en';
}

const EN_LABELS: Partial<Record<DeliveryStatus, string>> = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  ASSIGNED: 'Assigned',
  RIDER_EN_ROUTE_PICKUP: 'En route',
  AT_PICKUP: 'At pickup',
  PICKED_UP: 'Picked up',
  IN_TRANSIT: 'In transit',
  AT_DROPOFF: 'At dropoff',
  DELIVERED: 'Delivered',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
};

export function DeliveryStatusBadge({ status, locale = 'fr' }: DeliveryStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const label = locale === 'en' ? (EN_LABELS[status] ?? config.label) : config.label;

  return (
    <Badge variant={config.variant}>
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-40" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
      </span>
      {label}
    </Badge>
  );
}
