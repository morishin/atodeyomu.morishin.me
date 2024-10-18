"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

type MarkAllAsReadFormResponse = {
  state: "idle" | "success" | "error";
  timestamp: number;
};

export async function requestMarkAllAsRead(
  _prevState: MarkAllAsReadFormResponse,
  _formData: FormData
): Promise<MarkAllAsReadFormResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { state: "error", timestamp: Date.now() };
  }

  await prisma.page.updateMany({
    where: {
      userId: session.user.id,
      readAt: null,
    },
    data: {
      readAt: new Date().toISOString(),
    },
  });

  return { state: "success", timestamp: Date.now() };
}
