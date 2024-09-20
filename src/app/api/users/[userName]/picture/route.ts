import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth/auth.config";

export async function POST(
  request: Request,
  { params }: { params: { userName: string } }
): Promise<NextResponse> {
  if (request.body === null) {
    return NextResponse.json(null, { status: 400 });
  }
  const session = await getServerSession(authConfig);
  if (!session?.user) {
    return NextResponse.json(null, { status: 401 });
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: { name: params.userName },
  });
  if (session.user.id !== user.id) {
    return NextResponse.json(null, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  const extension = filename?.split(".").pop() ?? null;
  const timestamp = new Date().getTime();
  const newFilename = `${params.userName}-${timestamp}${extension ? `.${extension}` : ""}`;

  const blob = await put(newFilename, request.body, {
    access: "public",
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { image: blob.url },
  });

  return NextResponse.json(blob, { status: 200 });
}