import { prisma } from "@/lib/prisma";

export type ApiUserPageResponse = {
  pages: {
    id: string;
    userId: string;
    url: string;
    title: string;
    description: string;
    image: string | null;
    readAt: string | null;
    createdAt: string;
  }[];
  totalCount: number;
};

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
  const condition = {
    userId,
    readAt: isRead ? { not: null } : null,
  };
  const [pages, totalCount] = await prisma.$transaction([
    prisma.page.findMany({
      where: condition,
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
    }),
    prisma.page.count({
      where: condition,
    }),
  ]);

  return {
    pages: pages.map((page) => ({
      id: page.id,
      userId: page.userId,
      url: page.url,
      title: page.title,
      description: page.description,
      image: page.image ?? null,
      readAt: page.readAt?.toISOString() ?? null,
      createdAt: page.createdAt.toISOString(),
    })),
    totalCount,
  };
};
