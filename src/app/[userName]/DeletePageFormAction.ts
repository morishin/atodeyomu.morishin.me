"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

type DeletePageFormResponse = {
  state: "idle" | "success" | "error";
  timestamp: number;
};

export async function requestDeletePage(
  _prevState: DeletePageFormResponse,
  formData: FormData
): Promise<DeletePageFormResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { state: "error", timestamp: Date.now() };
  }

  const pageId = formData.get("pageId");
  if (typeof pageId !== "string") {
    return { state: "error", timestamp: Date.now() };
  }

  const page = await prisma.page.findUniqueOrThrow({
    where: {
      id: pageId,
    },
  });
  if (page.userId !== session.user.id) {
    return { state: "error", timestamp: Date.now() };
  }
  await prisma.page.delete({
    where: {
      id: page.id,
    },
  });

  return { state: "success", timestamp: Date.now() };
}
