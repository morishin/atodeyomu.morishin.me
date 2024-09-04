import "./globals.css";
import type { Metadata } from "next";

import ClientSessionProvider from "@/components/ClientSessionProvider";
import { auth } from "@/lib/auth/auth";

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
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  );
}
