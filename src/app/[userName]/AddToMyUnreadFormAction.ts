"use server";

import { getServerSession } from "next-auth/next";

import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth/auth.config";

type AddToMyUnreadFormResponse = {
  state: "idle" | "success" | "error";
  timestamp: number;
};

export async function requestAddToMyUnread(
  _prevState: AddToMyUnreadFormResponse,
  formData: FormData
): Promise<AddToMyUnreadFormResponse> {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return { state: "error", timestamp: Date.now() };
  }

  const pageId = formData.get("pageId");
  if (typeof pageId !== "string") {
    return { state: "error", timestamp: Date.now() };
  }

  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
    },
  });
  if (!page) {
    return { state: "error", timestamp: Date.now() };
  }

  await prisma.page.upsert({
    where: {
      userId_url: {
        userId: session.user.id,
        url: page.url,
      },
    },
    create: {
      userId: session.user.id,
      url: page.url,
      title: page.title,
      description: page.description,
      image: page.image,
    },
    update: {
      createdAt: new Date().toISOString(),
      readAt: null,
    },
  });

  return { state: "success", timestamp: Date.now() };
}
