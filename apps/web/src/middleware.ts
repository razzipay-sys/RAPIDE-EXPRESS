import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';

import { defaultLocale, locales } from '@rapide/i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // /fr/ only, default locale at root /
});

export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
