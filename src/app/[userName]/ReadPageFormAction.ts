"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

type ReadPageFormResponse = {
  state: "idle" | "success" | "error";
  timestamp: number;
};

export async function requestReadPage(
  _prevState: ReadPageFormResponse,
  formData: FormData
): Promise<ReadPageFormResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { state: "error", timestamp: Date.now() };
  }

  const pageId = formData.get("pageId");
  if (typeof pageId !== "string") {
    return { state: "error", timestamp: Date.now() };
  }
  const read = Boolean(Number(formData.get("read")));

  const page = await prisma.page.findUniqueOrThrow({
    where: {
      id: pageId,
    },
  });
  if (page.userId !== session.user.id) {
    return { state: "error", timestamp: Date.now() };
  }
  await prisma.page.update({
    where: {
      id: page.id,
    },
    data: {
      readAt: read ? new Date().toISOString() : null,
    },
  });

  return { state: "success", timestamp: Date.now() };
}
