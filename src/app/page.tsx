import { redirect } from "next/navigation";
import { ArrowRightIcon, LibraryBigIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth/next";

import { Text } from "@/components/park-ui";
import { redirectToWelcomePageIfNeeded } from "@/lib/redirects";
import { HStack, VStack } from "@styled-system/jsx";
import { Button } from "@/components/park-ui/button";
import { Card } from "@/components/park-ui/card";
import { authConfig } from "@/lib/auth/auth.config";

export default async function Home() {
  const session = await getServerSession(authConfig);
  if (session?.user?.name) {
    await redirectToWelcomePageIfNeeded(session);
    redirect(`/${session.user.name}`);
  }

  return (
    <VStack
      alignItems="center"
      paddingTop="8"
      paddingBottom="8"
      paddingInline="4"
      gap="7"
    >
      <Link href="/">
        <Text as="h1" fontSize="3xl">
          <HStack>
            <LibraryBigIcon size="1em" />
            ato de yomu
          </HStack>
        </Text>
      </Link>
      <Text fontSize="xl">
        Save web pages to read later, track your reading history, and share your
        lists—or keep them private.
      </Text>
      <Link href="/api/auth/signin">
        <Button variant="outline" size="xl">
          Get Started
          <ArrowRightIcon />
        </Button>
      </Link>
      <Card.Root maxWidth="625px" marginTop="4">
        <Image
          width="1250"
          height="1181"
          alt="screenshot"
          src="/example_page.png"
          style={{
            objectFit: "contain",
            backgroundColor: "white",
            width: "100%",
            height: "auto",
          }}
        />
      </Card.Root>
    </VStack>
  );
}
