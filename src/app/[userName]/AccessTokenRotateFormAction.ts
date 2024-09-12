"use server";

import { randomBytes } from "node:crypto";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

type AccessTokenRotateFormResponse = {
  state: "idle" | "success" | "error";
  timestamp: number;
  personalAccessToken: string;
};

export async function requestAccessTokenRotate(
  prevState: AccessTokenRotateFormResponse
): Promise<AccessTokenRotateFormResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      state: "error",
      timestamp: Date.now(),
      personalAccessToken: prevState.personalAccessToken,
    };
  }

  const personalAccessToken = randomBytes(20).toString("hex");
  await prisma.user.update({
    where: { id: session.user.id },
    data: { personalAccessToken },
  });

  return { state: "success", timestamp: Date.now(), personalAccessToken };
}
