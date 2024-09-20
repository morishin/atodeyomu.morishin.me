"use server";

import { randomBytes } from "node:crypto";

import { getServerSession } from "next-auth/next";

import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth/auth.config";

type AccessTokenRotateFormResponse = {
  state: "idle" | "success" | "error";
  timestamp: number;
  personalAccessToken: string;
};

export async function requestAccessTokenRotate(
  prevState: AccessTokenRotateFormResponse
): Promise<AccessTokenRotateFormResponse> {
  const session = await await getServerSession(authConfig);
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
