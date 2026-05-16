/**
 * Format an amount in XOF (West African CFA franc).
 * All monetary values are stored as integers (no decimals).
 */
export function formatXOF(amount: number, showSymbol = true): string {
  const formatted = new Intl.NumberFormat('fr-BJ', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  if (!showSymbol) {
    return formatted.replace(/[^\d\s]/g, '').trim();
  }
  return formatted;
}

export function formatCurrency(amount: number, currency = 'XOF'): string {
  if (currency === 'XOF') return formatXOF(amount);
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

/** Round fare to nearest 5 XOF for clean UX display */
export function roundFare(amount: number): number {
  return Math.round(amount / 5) * 5;
}

/** Convert from major unit — XOF has no minor units */
export function toDisplayAmount(storageAmount: number): number {
  return storageAmount;
}
