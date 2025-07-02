import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Bases } from "@/components/(reusable)/bases";
import { UserEditProvider } from "@/app/context/(admin)/UserEditContext";
import { CrewEditProvider } from "@/app/context/(admin)/CrewEditContext";
import { Toaster } from "@/components/ui/sonner";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <Toaster position="top-right" richColors closeButton duration={3000} />
      <UserEditProvider>
        <CrewEditProvider>
          <div className="h-screen">{children}</div>
        </CrewEditProvider>
      </UserEditProvider>
    </NextIntlClientProvider>
  );
}
