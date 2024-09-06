import { redirect } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";

import { Text } from "@/components/park-ui";
import { auth } from "@/lib/auth/auth";
import { redirectToWelcomePageIfNeeded } from "@/lib/redirects";
import { VStack, Box } from "@styled-system/jsx";
import { Button } from "@/components/park-ui/button";
import { Card } from "@/components/park-ui/card";

export default async function Home() {
  const session = await auth();
  if (session?.user?.name) {
    await redirectToWelcomePageIfNeeded(session);
    redirect(`/${session.user.name}`);
  }

  return (
    <VStack
      alignItems="center"
      paddingTop={{ smDown: "0", base: "4" }}
      paddingBottom="12"
      paddingInline="4"
      gap="7"
    >
      <Text as="h1" fontSize="2xl">
        ato de yomu
      </Text>
      <a href="/api/auth/signin">
        <Button variant="outline" size="xl">
          Get Started
          <ArrowRightIcon />
        </Button>
      </a>
      <Text fontSize="xl">
        <b>ato de yomu</b> is a reading list app that lets you save web pages to
        read later. You can choose to keep your list private or share it with
        others.
      </Text>
      <Card.Root maxWidth="625px">
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
