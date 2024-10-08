"use server";

import { auth } from "@/lib/auth/auth";
import { PageInfo } from "@/lib/PageInfo";
import { prisma } from "@/lib/prisma";

type AddPageFormResponse = {
  state: "idle" | "success" | "error";
  timestamp: number;
};

export async function requestAddPage(
  _prevState: AddPageFormResponse,
  formData: FormData
): Promise<AddPageFormResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { state: "error", timestamp: Date.now() };
  }

  const url = formData.get("url");
  if (typeof url !== "string") {
    return { state: "error", timestamp: Date.now() };
  }

  const pageInfo = await PageInfo.fetch(url);

  if (pageInfo.title === null) {
    return { state: "error", timestamp: Date.now() };
  }

  await prisma.page.upsert({
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

  return { state: "success", timestamp: Date.now() };
}
