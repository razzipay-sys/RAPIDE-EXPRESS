const BENIN_PREFIXES = ['97', '98', '99', '96', '95', '94', '93', '61', '62', '63', '64', '65', '66', '67', '68', '69'];
const BENIN_COUNTRY_CODE = '+229';

/**
 * Format a Benin phone number for display.
 * Input: "97123456" or "+22997123456"
 * Output: "+229 97 12 34 56"
 */
export function formatBeninPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const local = cleaned.startsWith('229') ? cleaned.slice(3) : cleaned;
  if (local.length === 8) {
    return `${BENIN_COUNTRY_CODE} ${local.slice(0, 2)} ${local.slice(2, 4)} ${local.slice(4, 6)} ${local.slice(6)}`;
  }
  return phone;
}

export function normalizeBeninPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('229')) return `+${cleaned}`;
  if (cleaned.length === 8) return `${BENIN_COUNTRY_CODE}${cleaned}`;
  return phone;
}

export function isValidBeninPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  const local = cleaned.startsWith('229') ? cleaned.slice(3) : cleaned;
  return local.length === 8 && BENIN_PREFIXES.some((p) => local.startsWith(p));
}

export function maskPhone(phone: string): string {
  const formatted = formatBeninPhone(phone);
  return formatted.replace(/(\+\d{3}\s\d{2})\s\d{2}\s\d{2}(\s\d{2})/, '$1 ** **$2');
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}
