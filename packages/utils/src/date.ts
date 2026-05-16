/**
 * Format a date for delivery display in French or English.
 * e.g. "Aujourd'hui à 14:30" / "Today at 2:30 PM"
 */
export function formatDeliveryDate(date: Date, locale: 'fr' | 'en' = 'fr'): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString(locale === 'fr' ? 'fr-BJ' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isToday) {
    return locale === 'fr' ? `Aujourd'hui à ${time}` : `Today at ${time}`;
  }

  return date.toLocaleDateString(locale === 'fr' ? 'fr-BJ' : 'en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(date: Date, locale: 'fr' | 'en' = 'fr'): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale === 'fr' ? 'fr' : 'en', { numeric: 'auto' });

  if (seconds < 60) return rtf.format(-seconds, 'second');
  if (seconds < 3600) return rtf.format(-Math.floor(seconds / 60), 'minute');
  if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600), 'hour');
  return rtf.format(-Math.floor(seconds / 86400), 'day');
}

export function formatEta(minutes: number, locale: 'fr' | 'en' = 'fr'): string {
  if (minutes < 1) return locale === 'fr' ? 'Imminent' : 'Arriving now';
  if (minutes < 60) return locale === 'fr' ? `${minutes} min` : `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return locale === 'fr'
    ? `${h}h${m > 0 ? ` ${m}min` : ''}`
    : `${h}h${m > 0 ? ` ${m}m` : ''}`;
}

export function isWithinBusinessHours(date = new Date()): boolean {
  const hour = date.getHours();
  return hour >= 7 && hour < 22;
}

export function toAbsoluteDate(relative: string): Date {
  const now = new Date();
  if (relative === 'today') return now;
  if (relative === 'tomorrow') {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return d;
  }
  return new Date(relative);
}
