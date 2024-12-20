import { notFound } from "next/navigation";
import { type NextRequest } from "next/server";
import RSS from "rss";

import { prisma } from "@/lib/prisma";
import { locale } from "@/lib/i18n/locale";
import { i18n } from "@/lib/i18n/strings";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userName: string }> }
) {
  const isRead = Boolean(Number(request.nextUrl.searchParams.get("read")));

  const userName = (await params).userName;
  const user = await prisma.user.findUnique({
    where: { name: userName },
    include: {
      pages: {
        where: {
          readAt: isRead ? { not: null } : null,
        },
        orderBy: [
          {
            readAt: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      },
    },
  });
  if (!user || user.private) {
    notFound();
  }

  const lang = await locale();
  const title = `${
    isRead
      ? i18n("{{username}}'s reads", lang).replace("{{username}}", user.name)
      : i18n("{{username}}'s unreads", lang).replace("{{username}}", user.name)
  } | ${i18n("ato de yomu", lang)}`;

  const feed = new RSS({
    title,
    site_url: `${request.nextUrl.protocol}//${request.nextUrl.host}`,
    feed_url: request.nextUrl.href,
  });

  user.pages.forEach((page) => {
    feed.item({
      title: page.title,
      description: page.description,
      url: page.url,
      date: isRead ? page.readAt ?? page.createdAt : page.createdAt,
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
