import { notFound } from "next/navigation";

import { Content } from "@/app/[userName]/Content";
import { fetchPages } from "@/app/api/users/[userName]/pages/fetchPages";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { redirectToWelcomePageIfNeeded } from "@/lib/redirects";
import { LoggedInUser } from "@/lib/types";
import { VStack } from "@styled-system/jsx";
import { apiUserPageDefaultPerPage } from "@/app/api/users/[userName]/pages/apiUserPageDefaultPerPage";
import { locale } from "@/lib/i18n/locale";
import { i18n } from "@/lib/i18n/strings";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ userName: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const userName = (await params).userName;
  if (userName.match(/[^a-zA-Z0-9_-]/)) {
    notFound();
  }

  const lang = await locale();

  const isRead = (await searchParams).read === "1";
  const title = `${
    isRead
      ? i18n("{{username}}'s reads", lang).replace("{{username}}", userName)
      : i18n("{{username}}'s unreads", lang).replace("{{username}}", userName)
  } | ${i18n("ato de yomu", lang)}`;

  const user = await prisma.user.findUnique({
    where: { name: userName },
  });
  if (!user) {
    notFound();
  }

  return {
    title,
    openGraph: {
      title,
      siteName: i18n("ato de yomu", lang),
      type: "website",
      url: `https://atodeyomu.morishin.me/${userName}`,
      images: {
        url:
          user?.image ?? lang === "ja"
            ? "https://atodeyomu.morishin.me/og-image-ja.png"
            : "https://atodeyomu.morishin.me/og-image.png",
        width: 630,
        height: 630,
      },
    },
    twitter: {
      card: "summary",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ userName: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userName } = await params;
  if (userName.match(/[^a-zA-Z0-9_-]/)) {
    notFound();
  }
  const user = await prisma.user.findUnique({
    where: { name: userName },
  });
  if (!user) {
    notFound();
  }
  const session = await auth();
  await redirectToWelcomePageIfNeeded(session);

  const isMyPage = session?.user?.id === user.id;
  const isPrivate = user.private;

  if (isPrivate && !isMyPage) {
    notFound();
  }

  let loggedInUser: LoggedInUser | null;
  if (!session?.user) {
    loggedInUser = null;
  } else {
    loggedInUser = {
      name: session.user.name,
      image: session.user.image ?? null,
      personalAccessToken: session.user?.personalAccessToken,
    };
  }

  const [unreadPages, readPages] = await Promise.all([
    fetchPages({
      userId: user.id,
      isRead: false,
      perPage: apiUserPageDefaultPerPage,
      page: 1,
    }),
    fetchPages({
      userId: user.id,
      isRead: true,
      perPage: apiUserPageDefaultPerPage,
      page: 1,
    }),
  ]);

  const initialPageData = {
    unread: unreadPages,
    read: readPages,
  };

  return (
    <VStack
      alignItems="stretch"
      paddingTop={{ smDown: "2", base: "4" }}
      paddingBottom="12"
    >
      <Content
        userName={user.name}
        userIcon={user.image}
        loggedInUser={loggedInUser}
        isPrivate={isPrivate}
        isMyPage={isMyPage}
        initialPageData={initialPageData}
      />
    </VStack>
  );
}
