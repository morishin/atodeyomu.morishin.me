import {
  ArrowRightIcon,
  BookOpenCheckIcon,
  GiftIcon,
  GlobeIcon,
  KeyRoundIcon,
  LibraryBigIcon,
  LockIcon,
  RssIcon,
  ShareIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Text } from "@/components/park-ui";
import { Button } from "@/components/park-ui/button";
import { Card } from "@/components/park-ui/card";
import { Box, HStack, Stack, VStack } from "@styled-system/jsx";
import { Locale } from "@/lib/i18n/locale";
import { i18n } from "@/lib/i18n/strings";

const Feature = ({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) => (
  <Card.Root width="100%">
    <Card.Body>
      <VStack alignItems="flex-start" gap="3">
        <Box color="accent.default">{icon}</Box>
        <Text as="h3" fontSize="lg" fontWeight="semibold">
          {title}
        </Text>
        <Text fontSize="sm" color="fg.muted">
          {body}
        </Text>
      </VStack>
    </Card.Body>
  </Card.Root>
);

const SectionHeading = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <VStack gap="2" alignItems="center" textAlign="center">
    <Text as="h2" fontSize="2xl" fontWeight="bold">
      {title}
    </Text>
    {subtitle ? (
      <Text color="fg.muted" fontSize="md">
        {subtitle}
      </Text>
    ) : null}
  </VStack>
);

const Faq = ({ q, a }: { q: string; a: string }) => (
  <Card.Root width="100%">
    <Card.Body>
      <VStack alignItems="flex-start" gap="2">
        <Text as="h3" fontSize="md" fontWeight="semibold">
          {q}
        </Text>
        <Text fontSize="sm" color="fg.muted">
          {a}
        </Text>
      </VStack>
    </Card.Body>
  </Card.Root>
);

export const LandingContent = ({ lang }: { lang: Locale }) => {
  const title = i18n("ato de yomu", lang);

  const faqs: { q: string; a: string }[] = [
    {
      q: i18n("What is ato de yomu?", lang),
      a: i18n(
        "ato de yomu is a read-later / reading list app for saving web pages you want to come back to. It tracks unread and read pages, supports public profiles with RSS, and offers an API — a simple alternative to apps like Readwise Reader, Pocket, and Instapaper.",
        lang
      ),
    },
    {
      q: i18n("Is it free?", lang),
      a: i18n("Yes. ato de yomu is free to use for everyone.", lang),
    },
    {
      q: i18n("Can I keep my reading list private?", lang),
      a: i18n(
        "Yes. You can make your entire profile private, or control visibility per page.",
        lang
      ),
    },
    {
      q: i18n("Can I follow someone else's list?", lang),
      a: i18n(
        "Every public list has an RSS feed at /<username>/rss. Subscribe from any RSS reader.",
        lang
      ),
    },
    {
      q: i18n("Does it have an API?", lang),
      a: i18n(
        "Yes. Each user has a personal access token and can POST to /api/users/<username>/pages to add a page. This powers Shortcuts, Alfred, and the Chrome Extension.",
        lang
      ),
    },
    {
      q: i18n(
        "How is it different from Readwise, Pocket, or Instapaper?",
        lang
      ),
      a: i18n(
        "ato de yomu focuses on one thing: a no-frills list of pages to read later, with public/private profiles and RSS built in. It doesn't highlight, summarize, or charge a subscription — it just keeps your list.",
        lang
      ),
    },
  ];

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    alternateName: ["ato de yomu", "あとで読む", "後で読む"],
    description: i18n(
      "Save web pages to read later, track your reading history, and share your lists—or keep them private.",
      lang
    ),
    url: "https://atodeyomu.morishin.me",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web, iOS, Android",
    inLanguage: ["ja", "en"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Person",
      name: "morishin",
      url: "https://morishin.me",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <VStack
      alignItems="stretch"
      paddingTop="8"
      paddingBottom="12"
      paddingInline="4"
      gap="14"
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <VStack alignItems="center" gap="6">
        <VStack gap="1">
          <Link href="/">
            <Text as="h1" fontSize="3xl" fontWeight="bold">
              <HStack>
                <LibraryBigIcon size="1em" />
                {title}
              </HStack>
            </Text>
          </Link>
          <Text fontSize="xs" color="fg.subtle">
            /ato de jomɯ/
          </Text>
        </VStack>
        <Text fontSize="xl" textAlign="center" fontWeight="medium">
          {i18n("The read-it-later app that stays out of your way.", lang)}
        </Text>
        <Text fontSize="md" color="fg.muted" textAlign="center" maxWidth="xl">
          {i18n(
            "Save web pages in one tap, track what you've read, and share your list—or keep it private.",
            lang
          )}
        </Text>
        <Stack
          gap="4"
          flexDirection={{ base: "row", smDown: "column" }}
          justifyContent="center"
          width={{ smDown: "2xs" }}
          maxWidth="100%"
          paddingInline={{ base: "0", smDown: "8" }}
        >
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
        <Card.Root maxWidth="625px" marginTop="2">
          <Image
            width="1250"
            height="1181"
            alt={title}
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

      <VStack gap="6" alignItems="stretch">
        <SectionHeading
          title={i18n("Why ato de yomu?", lang)}
          subtitle={i18n(
            "A simple, fast reading list app that respects your time.",
            lang
          )}
        />
        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr 1fr", smDown: "1fr" }}
          gap="4"
        >
          <Feature
            icon={<BookOpenCheckIcon />}
            title={i18n("Unread / Read tracking", lang)}
            body={i18n(
              "A clear inbox of unread pages and a searchable history of what you've finished. Mark all as read when you declare reading bankruptcy.",
              lang
            )}
          />
          <Feature
            icon={<ShareIcon />}
            title={i18n("Save from anywhere", lang)}
            body={i18n(
              "PWA share target, iOS Shortcuts, Chrome Extension, Alfred Workflow, or plain cURL — add pages the way that fits your workflow.",
              lang
            )}
          />
          <Feature
            icon={<LockIcon />}
            title={i18n("Public or private lists", lang)}
            body={i18n(
              "Share your reading list as a public profile, or flip one switch to make everything private. Each page can also be set public or private individually.",
              lang
            )}
          />
          <Feature
            icon={<RssIcon />}
            title={i18n("RSS for public lists", lang)}
            body={i18n(
              "Every public list has an RSS feed, so friends can follow what you're reading from their favorite reader.",
              lang
            )}
          />
          <Feature
            icon={<KeyRoundIcon />}
            title={i18n("API & Personal Access Token", lang)}
            body={i18n(
              "Automate adding pages from your own scripts, Shortcuts, or custom tools with a personal access token.",
              lang
            )}
          />
          <Feature
            icon={<GiftIcon />}
            title={i18n("Free and open", lang)}
            body={i18n(
              "ato de yomu is free to use. No ads, no tracking pixels, no upsell.",
              lang
            )}
          />
        </Box>
      </VStack>

      <VStack gap="6" alignItems="stretch">
        <SectionHeading
          title={i18n("How to save a page", lang)}
          subtitle={i18n("Use whichever method fits your device.", lang)}
        />
        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr 1fr", smDown: "1fr" }}
          gap="4"
        >
          <Feature
            icon={<GlobeIcon />}
            title={i18n("iPhone / iPad", lang)}
            body={i18n(
              "Install as a PWA from Safari and use Web Share, or install the iOS Shortcut for one-tap saving from the share sheet.",
              lang
            )}
          />
          <Feature
            icon={<GlobeIcon />}
            title={i18n("Android", lang)}
            body={i18n(
              "Install as a PWA from Chrome and share pages directly from the share menu.",
              lang
            )}
          />
          <Feature
            icon={<GlobeIcon />}
            title={i18n("Desktop browser", lang)}
            body={i18n(
              "Install the Chrome Extension to save the current tab with one click.",
              lang
            )}
          />
          <Feature
            icon={<GlobeIcon />}
            title={i18n("Alfred / CLI", lang)}
            body={i18n(
              "Use the Alfred Workflow or any script that can POST to the REST API.",
              lang
            )}
          />
        </Box>
      </VStack>

      <VStack gap="6" alignItems="stretch">
        <SectionHeading title={i18n("Frequently asked questions", lang)} />
        <VStack gap="3" alignItems="stretch">
          {faqs.map((item) => (
            <Faq key={item.q} q={item.q} a={item.a} />
          ))}
        </VStack>
      </VStack>

      <VStack gap="4" alignItems="center" paddingTop="4">
        <Text as="h2" fontSize="2xl" fontWeight="bold" textAlign="center">
          {i18n("Start reading smarter", lang)}
        </Text>
        <Text color="fg.muted" textAlign="center" maxWidth="xl">
          {i18n(
            "Create a free account with your Google login and start saving pages in seconds.",
            lang
          )}
        </Text>
        <Link href="/api/auth/signin">
          <Button variant="solid" size="xl">
            {i18n("Get Started", lang)}
            <ArrowRightIcon />
          </Button>
        </Link>
      </VStack>
    </VStack>
  );
};
