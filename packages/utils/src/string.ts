import { customAlphabet } from 'nanoid';

const TRACKING_ALPHABET = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const nanoid = customAlphabet(TRACKING_ALPHABET, 4);

/** Generate a tracking code like RPD-20260516-4F2A */
export function generateTrackingCode(): string {
  const date = new Date();
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('');
  return `RPD-${datePart}-${nanoid()}`;
}

/** Generate a short referral code */
export function generateReferralCode(): string {
  return customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8)();
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return `${str.slice(0, maxLen - 1)}…`;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function initials(fullName: string): string {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
