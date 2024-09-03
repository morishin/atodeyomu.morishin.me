import { type NextRequest } from "next/server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  const session = await auth();
  if (session?.user?.id === undefined) {
    return new Response("Unauthorized", { status: 401 });
  }

  const page = await prisma.page.findUniqueOrThrow({
    where: {
      id: params.pageId,
    },
  });
  if (page.userId !== session.user.id) {
    return new Response("Forbidden", { status: 403 });
  }
  await prisma.page.update({
    where: {
      id: page.id,
    },
    data: {
      readAt: new Date().toISOString(),
    },
  });

  return new Response(null, { status: 204 });
}
