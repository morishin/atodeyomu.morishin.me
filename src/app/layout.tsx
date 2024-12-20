import "./globals.css";

import type { Metadata, ResolvingMetadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import ClientSessionProvider from "@/components/ClientSessionProvider";
import { auth } from "@/lib/auth/auth";
import { VStack } from "@styled-system/jsx";
import { RegisterWorker } from "@/app/RegisterWorker";
import LocaleProvider from "@/lib/i18n/LocaleProvider";
import { locale } from "@/lib/i18n/locale";
import { i18n } from "@/lib/i18n/strings";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export async function generateMetadata(
  _props: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const lang = await locale();
  const title = i18n("ato de yomu", lang);
  const description = i18n(
    "Save web pages to read later, track your reading history, and share your lists—or keep them private.",
    lang
  );
  return {
    title,
    description,
    openGraph: {
      title,
      siteName: title,
      description,
      type: "website",
      url: "https://atodeyomu.morishin.me",
      images: {
        url:
          lang === "ja"
            ? "https://atodeyomu.morishin.me/og-image-ja.png"
            : "https://atodeyomu.morishin.me/og-image.png",
        width: 630,
        height: 630,
      },
    },
    twitter: {
      card: "summary",
    },
    manifest: lang === "ja" ? "manifest-ja.json" : "manifest.json",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const lang = await locale();

  return (
    <html lang={lang === "ja" ? "ja" : "en"}>
      <body>
        <ClientSessionProvider session={session}>
          <LocaleProvider locale={lang}>
            <VStack alignItems="center">
              <VStack w="2xl" maxW="100vw" alignItems="stretch">
                {children}
              </VStack>
            </VStack>
          </LocaleProvider>
        </ClientSessionProvider>
        <Analytics />
        <SpeedInsights />
        <RegisterWorker />
      </body>
    </html>
  );
}
