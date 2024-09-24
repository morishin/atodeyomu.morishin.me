"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

type ChangeVisibilityFormResponse = {
  state: "idle" | "success" | "error";
  timestamp: number;
};

export async function requestChangeVisibility(
  _prevState: ChangeVisibilityFormResponse,
  formData: FormData
): Promise<ChangeVisibilityFormResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { state: "error", timestamp: Date.now() };
  }

  const isPrivate = Boolean(Number(formData.get("private")));

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      private: isPrivate,
    },
  });

  return { state: "success", timestamp: Date.now() };
}
