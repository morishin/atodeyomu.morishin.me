"use server";

import { auth } from "@/lib/auth/auth";
import { locale } from "@/lib/i18n/locale";
import { i18n } from "@/lib/i18n/strings";
import { prisma } from "@/lib/prisma";

type UpdateUserNameFormResponse = {
  state: "idle" | "success" | "error";
  timestamp: number;
  userName?: string;
  errorMessage?: string;
};

export async function requestUpdateUserName(
  _prevState: UpdateUserNameFormResponse,
  formData: FormData
): Promise<UpdateUserNameFormResponse> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { state: "error", timestamp: Date.now() };
  }

  const name = formData.get("name");
  if (typeof name !== "string") {
    return { state: "error", timestamp: Date.now() };
  }

  if (name.match(/[^a-zA-Z0-9_-]/)) {
    return {
      state: "error",
      timestamp: Date.now(),
      errorMessage: "Invalid character in user name. Use [a-zA-Z0-9_-].",
    };
  }

  const lang = locale();

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        registerCompleted: true,
      },
    });
  } catch (error) {
    return {
      state: "error",
      timestamp: Date.now(),
      errorMessage: i18n("This name is already taken.", lang),
    };
  }

  return { state: "success", timestamp: Date.now(), userName: name };
}
