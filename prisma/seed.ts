import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  // await prisma.user.deleteMany();
  const now = new Date();
  await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      name: "alice",
      personalAccessToken: "DUMMY",
      pages: {
        createMany: {
          data: Array.from({ length: 200 }).map((_, i) => ({
            title: `Page ${i}`,
            url: `https://example.com/page/${i}`,
            description: `Description for page ${i}`,
            createdAt: new Date(now.getTime() + i),
          })),
        },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
