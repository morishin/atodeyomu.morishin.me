"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

type ProfilePictureFormResponse = {
  state: "idle" | "success" | "error";
  timestamp: number;
};

export async function requestProfilePicture(
  _prevState: ProfilePictureFormResponse,
  formData: FormData
): Promise<ProfilePictureFormResponse> {
  const session = await auth();
  if (!session?.user) {
    return { state: "error", timestamp: Date.now() };
  }

  const imageFile = formData.get("image") as File;
  const extension = imageFile.name.split(".").pop() ?? null;
  const timestamp = new Date().getTime();
  const newFilename = `${session.user.name}-${timestamp}${extension ? `.${extension}` : ""}`;
  const blob = await put(newFilename, imageFile, {
    access: "public",
  });
  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: blob.url },
  });
  revalidatePath("/");
  return { state: "success", timestamp: Date.now() };
}
