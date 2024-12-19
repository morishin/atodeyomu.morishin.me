import { ArrowRightIcon, LibraryBigIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Text } from "@/components/park-ui";
import { Button } from "@/components/park-ui/button";
import { Card } from "@/components/park-ui/card";
import { redirectToWelcomePageIfNeeded } from "@/lib/redirects";
import { HStack, Stack, VStack } from "@styled-system/jsx";
import { auth } from "@/lib/auth/auth";
import { i18n } from "@/lib/i18n/strings";
import { locale } from "@/lib/i18n/locale";

export default async function Home() {
  const session = await auth();
  if (session?.user?.name) {
    await redirectToWelcomePageIfNeeded(session);
    redirect(`/${session.user.name}`);
  }
  const lang = locale();
  return (
    <VStack
      alignItems="center"
      paddingTop="8"
      paddingBottom="8"
      paddingInline="4"
      gap="7"
    >
      <VStack gap="1">
        <Link href="/">
          <Text as="h1" fontSize="3xl">
            <HStack>
              <LibraryBigIcon size="1em" />
              {i18n("ato de yomu", lang)}
            </HStack>
          </Text>
        </Link>
        <Text fontSize="xs" color="fg.subtle">
          /äto de jomɯ/
        </Text>
      </VStack>
      <Text fontSize="xl">
        {i18n(
          "Save web pages to read later, track your reading history, and share your lists—or keep them private.",
          lang
        )}
      </Text>
      <Stack gap="4" flexDirection={{ base: "row", smDown: "column" }}>
        <Link href="/api/auth/signin">
          <Button variant="solid" size="xl" width={{ smDown: "100%" }}>
            {i18n("Get Started", lang)}
            <ArrowRightIcon />
          </Button>
        </Link>
        <Link href="/morishin">
          <Button variant="outline" size="xl" width={{ smDown: "100%" }}>
            {i18n("See Example", lang)}
          </Button>
        </Link>
      </Stack>
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
