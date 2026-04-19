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

const SITE_URL = "https://atodeyomu.morishin.me";

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
  const ogImage =
    lang === "ja" ? "/og-image-ja.png" : "/og-image.png";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    applicationName: title,
    keywords: [
      "あとで読む",
      "後で読む",
      "リーディングリスト",
      "未読管理",
      "ブックマーク",
      "あとで読むアプリ",
      "read it later",
      "read later app",
      "reading list app",
      "bookmark manager",
      "save articles to read later",
      "Readwise alternative",
      "Pocket alternative",
      "Instapaper alternative",
    ],
    authors: [{ name: "morishin" }],
    creator: "morishin",
    publisher: "morishin",
    alternates: {
      canonical: "/",
      languages: {
        ja: "/",
        en: "/en",
        "x-default": "/",
      },
      types: {
        "application/rss+xml": [],
      },
    },
    openGraph: {
      title,
      siteName: title,
      description,
      type: "website",
      url: SITE_URL,
      locale: lang === "ja" ? "ja_JP" : "en_US",
      images: {
        url: ogImage,
        width: 630,
        height: 630,
        alt: title,
      },
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    manifest: lang === "ja" ? "/manifest-ja.json" : "/manifest.json",
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
