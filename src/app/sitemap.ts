import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

const SITE_URL = "https://atodeyomu.morishin.me";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publicUsers = await prisma.user.findMany({
    where: {
      private: false,
      registerCompleted: true,
    },
    select: {
      name: true,
      updatedAt: true,
    },
  });

  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          ja: `${SITE_URL}/`,
          en: `${SITE_URL}/en`,
        },
      },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          ja: `${SITE_URL}/`,
          en: `${SITE_URL}/en`,
        },
      },
    },
    ...publicUsers.map((user) => ({
      url: `${SITE_URL}/${user.name}`,
      lastModified: user.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];
}
