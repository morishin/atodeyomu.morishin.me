import "./globals.css";

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import ClientSessionProvider from "@/components/ClientSessionProvider";
import { auth } from "@/lib/auth/auth";
import { VStack } from "@styled-system/jsx";

export const metadata: Metadata = {
  title: "ato de yomu | Read It Later",
  description:
    "Save web pages to read later, track your reading history, and share your lists—or keep them private.",
  openGraph: {
    title: "ato de yomu | Read It Later",
    siteName: "ato de yomu",
    description:
      "Save web pages to read later, track your reading history, and share your lists—or keep them private.",
    type: "website",
    url: "https://atodeyomu.morishin.me",
    images: {
      url: "https://atodeyomu.morishin.me/og-image.png",
      width: 630,
      height: 630,
    },
  },
  twitter: {
    card: "summary",
  },
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
