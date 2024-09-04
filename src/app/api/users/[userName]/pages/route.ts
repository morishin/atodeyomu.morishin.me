import { type NextRequest } from "next/server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

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
    const session = await auth();
    if (session?.user?.id !== user.id) {
      return new Response("Not Found", { status: 404 });
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
