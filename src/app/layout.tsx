import "./globals.css";
import type { Metadata } from "next";

import ClientSessionProvider from "@/components/ClientSessionProvider";
import { auth } from "@/lib/auth/auth";
import { VStack } from "@styled-system/jsx";

export const metadata: Metadata = {
  title: "atodeyomu",
  description: "Your reading list",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        <ClientSessionProvider session={session}>
          <VStack alignItems="center">
            <VStack w="2xl" maxW="100vw" alignItems="stretch">
              {children}
            </VStack>
          </VStack>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
