import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { ScanDataProvider } from '../../../components/context/ScannedJobSIte';


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
            <ScanDataProvider>
            {children}
            </ScanDataProvider>
        </NextIntlClientProvider>
    </body>
</html>
);
}