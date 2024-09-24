import { prisma } from "@/lib/prisma";

export type ApiUserPageResponse = {
  id: string;
  userId: string;
  url: string;
  title: string;
  description: string;
  image: string | null;
  readAt: string | null;
  createdAt: string;
}[];

export const fetchPages = async ({
  userId,
  isRead,
  perPage,
  page,
}: {
  userId: string;
  isRead: boolean;
  perPage: number;
  page: number;
}): Promise<ApiUserPageResponse> => {
  const pages = await prisma.page.findMany({
    where: {
      userId,
      readAt: isRead ? { not: null } : null,
    },
    orderBy: [
      {
        readAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    skip: isNaN(page) ? 0 : (page - 1) * perPage,
    take: perPage,
  });

  return pages.map((page) => ({
    id: page.id,
    userId: page.userId,
    url: page.url,
    title: page.title,
    description: page.description,
    image: page.image ?? null,
    readAt: page.readAt?.toISOString() ?? null,
    createdAt: page.createdAt.toISOString(),
  }));
};
