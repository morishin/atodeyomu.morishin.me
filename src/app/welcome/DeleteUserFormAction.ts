"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

type DeleteUserFormResponse = {
  state: "idle" | "success" | "error";
  timestamp: number;
};

export async function requestDeleteUser(): Promise<DeleteUserFormResponse> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { state: "error", timestamp: Date.now() };
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      state: "error",
      timestamp: Date.now(),
    };
  }

  return { state: "success", timestamp: Date.now() };
}
