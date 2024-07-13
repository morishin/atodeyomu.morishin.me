import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      name: "Alice",
      pages: {
        createMany: {
          data: [
            {
              title: "Check out Prisma with Next.js",
              url: "https://www.prisma.io/nextjs",
              description:
                "Learn how to use Prisma with Next.js in this step-by-step tutorial.",
            },
            {
              title: "Check out Nexus with Prisma",
              url: "https://www.nexusjs.org/prisma",
              description:
                "Learn how to use Nexus with Prisma in this step-by-step tutorial.",
            },
            {
              title: "Check out Next.js",
              url: "https://nextjs.org",
              description: "The React Framework for Production.",
            },
            {
              title: "Check out Nexus",
              url: "https://nexusjs.org",
              description: "The Schema-First GraphQL Framework.",
            },
          ],
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
