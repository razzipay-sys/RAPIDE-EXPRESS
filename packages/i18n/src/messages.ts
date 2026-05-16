import frCommon from '../locales/fr/common.json';
import frAuth from '../locales/fr/auth.json';
import frDelivery from '../locales/fr/delivery.json';
import frWallet from '../locales/fr/wallet.json';
import frErrors from '../locales/fr/errors.json';
import frNotifications from '../locales/fr/notifications.json';

import enCommon from '../locales/en/common.json';
import enAuth from '../locales/en/auth.json';
import enDelivery from '../locales/en/delivery.json';
import enWallet from '../locales/en/wallet.json';
import enErrors from '../locales/en/errors.json';
import enNotifications from '../locales/en/notifications.json';

const messages = {
  fr: {
    common: frCommon,
    auth: frAuth,
    delivery: frDelivery,
    wallet: frWallet,
    errors: frErrors,
    notifications: frNotifications,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    delivery: enDelivery,
    wallet: enWallet,
    errors: enErrors,
    notifications: enNotifications,
  },
} as const;

export type SupportedLocale = keyof typeof messages;

export function getMessages(locale: string) {
  return messages[locale as SupportedLocale] ?? messages.fr;
}
