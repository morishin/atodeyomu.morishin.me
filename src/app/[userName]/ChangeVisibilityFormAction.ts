"use server";

import { getServerSession } from "next-auth/next";

import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth/auth.config";

type ChangeVisibilityFormResponse = {
  state: "idle" | "success" | "error";
  timestamp: number;
};

export async function requestChangeVisibility(
  _prevState: ChangeVisibilityFormResponse,
  formData: FormData
): Promise<ChangeVisibilityFormResponse> {
  const session = await getServerSession(authConfig);
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
