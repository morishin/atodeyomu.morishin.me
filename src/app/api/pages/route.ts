import { NextRequest } from "next/server";

import { PageInfo } from "@/lib/PageInfo";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(null, { status: 401 });
  }

  const formData = await request.formData();
  const url =
    formData.get("url") ?? formData.get("text") ?? formData.get("title");
  if (typeof url !== "string") {
    return new Response("Invalid input", { status: 400 });
  }

  const pageInfo = await PageInfo.fetch(url);
  if (pageInfo.title === null) {
    return new Response(`Failed to load page: ${url}`, { status: 400 });
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
        userId: session.user.id,
        url,
      },
    },
    create: {
      userId: session.user.id,
      url,
      title: pageInfo.title,
      description: pageInfo.description ?? "",
      image: pageInfo.image,
    },
    update: {
      title: pageInfo.title,
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
