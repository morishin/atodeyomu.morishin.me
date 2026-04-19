import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LandingContent } from "@/app/LandingContent";
import { auth } from "@/lib/auth/auth";
import { redirectToWelcomePageIfNeeded } from "@/lib/redirects";

export const metadata: Metadata = {
  title: {
    absolute: "ato de yomu — read it later app",
  },
  description:
    "ato de yomu is a free read-it-later app and reading list. Save web pages from any device, track unread/read, and share your list via RSS or keep it private.",
  alternates: {
    canonical: "/en",
    languages: {
      ja: "/",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "ato de yomu — read it later app",
    description:
      "A simple, free read-it-later app. Save pages in one tap, track what you've read, and share your list or keep it private.",
    url: "https://atodeyomu.morishin.me/en",
    locale: "en_US",
  },
};

export default async function HomeEn() {
  const session = await auth();
  if (session?.user?.name) {
    await redirectToWelcomePageIfNeeded(session);
    redirect(`/${session.user.name}`);
  }
  return <LandingContent lang="default" />;
}
