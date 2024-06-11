import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import {Providers } from './providers';

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  let locale;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
          {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}