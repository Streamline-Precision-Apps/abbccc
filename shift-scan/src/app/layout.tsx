import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { LocaleProvider } from '../../components/localeContext';

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  let locale;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider>
          {children}
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}