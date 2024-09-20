import "./globals.css";
import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";

import ClientSessionProvider from "@/components/ClientSessionProvider";
import { VStack } from "@styled-system/jsx";
import { authConfig } from "@/lib/auth/auth.config";

export const metadata: Metadata = {
  title: "ato de yomu",
  description: "A reading list app that lets you save web pages to read later.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig);
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="favicon.png" />
        <link rel="icon" type="image/svg+xml" href="favicon.svg" />
      </head>
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
