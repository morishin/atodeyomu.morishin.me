import { type NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authConfig } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/prisma";
import { PageInfo } from "@/lib/PageInfo";

export type ApiUserPageResponse = {
  id: string;
  userId: string;
  url: string;
  title: string;
  description: string;
  image: string | null;
  readAt: string | null;
  createdAt: string;
}[];

export async function GET(
  request: NextRequest,
  { params }: { params: { userName: string } }
) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { name: params.userName },
  });
  if (user.private) {
    const session = await getServerSession(authConfig);
    if (session?.user?.id !== user.id) {
      notFound();
    }
  }

  const searchParams = request.nextUrl.searchParams;
  const isRead = Boolean(Number(searchParams.get("read")));
  const page = Math.max(1, Number(searchParams.get("page")));
  const perPage = Math.min(
    100,
    Math.max(1, Number(searchParams.get("perPage")))
  );
  const pages = await prisma.page.findMany({
    where: {
      userId: user.id,
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
    skip: isNaN(page) ? 0 : (page - 1) * perPage,
    take: perPage,
  });

  return new Response(JSON.stringify(pages, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userName: string } }
) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { name: params.userName },
  });

  const authorization = request.headers.get("authorization");
  const token = authorization?.replace("Bearer ", "");
  if (token !== user.personalAccessToken) {
    return new Response(null, { status: 401 });
  }

  const body: { url: string } = await request.json();

  let pageInfo: PageInfo;
  try {
    pageInfo = await PageInfo.fetch(body.url);
  } catch {
    return new Response("Failed to fetch the page", { status: 500 });
  }

  const page = await prisma.page.upsert({
    select: {
      id: true,
      url: true,
      title: true,
      description: true,
      image: true,
      createdAt: true,
    },
    where: {
      userId_url: {
        userId: user.id,
        url: body.url,
      },
    },
    create: {
      userId: user.id,
      url: body.url,
      title: pageInfo.title ?? "",
      description: pageInfo.description ?? "",
      image: pageInfo.image,
    },
    update: {
      title: pageInfo.title ?? "",
      description: pageInfo.description ?? "",
      image: pageInfo.image,
      createdAt: new Date().toISOString(),
      readAt: null,
    },
  });

  return new Response(JSON.stringify(page, null, 2), {
    status: 201,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
