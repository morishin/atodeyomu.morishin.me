import { notFound } from "next/navigation";
import { type NextRequest } from "next/server";
import RSS from "rss";

import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { userName: string } }
) {
  const isRead = Boolean(Number(request.nextUrl.searchParams.get("read")));

  const user = await prisma.user.findUniqueOrThrow({
    where: { name: params.userName },
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
  if (user.private) {
    notFound();
  }

  const feed = new RSS({
    title: `${user.name}'s ${isRead ? "reads" : "unreads"} | ato de yomu`,
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
