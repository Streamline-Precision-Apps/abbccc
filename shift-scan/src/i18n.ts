import {NextIntlClientProvider} from 'next-intl';
import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async (req) => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  let locale = 'en';
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});