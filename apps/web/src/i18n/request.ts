import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, isValidLocale, getMessages } from '@rapide/i18n';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isValidLocale(requested ?? '') ? requested! : defaultLocale;

  return {
    locale,
    messages: getMessages(locale),
  };
});
