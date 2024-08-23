"use client";

import useSWRInfinite from "swr/infinite";

import { PageList } from "@/app/[userName]/PageList";
import { Tabs } from "@/components/park-ui";
import { VStack } from "@styled-system/jsx";
import { AddPageForm } from "@/app/[userName]/AddPageForm";
import { type ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";

type Page = ApiUserPageResponse[number];

const fetcher: (url: string) => Promise<ApiUserPageResponse> = (url: string) =>
  fetch(url).then((r) => r.json());

export const Content = ({
  userName,
  isMyPage,
}: {
  userName: string;
  isMyPage: boolean;
}) => {
  const getKey = (pageIndex: number, previousPageData: Page[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/users/${userName}/pages?page=${pageIndex + 1}`;
  };

  const { data, size, setSize, mutate } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateFirstPage: false,
  });

  return (
    <VStack>
      <AddPageForm isAvailable={isMyPage} mutate={mutate} />
      <Tabs.Root defaultValue="unread" w="xl" maxW="100vw">
        <Tabs.List>
          <Tabs.Trigger key={"unread"} value={"unread"}>
            Unread
          </Tabs.Trigger>
          <Tabs.Trigger key={"read"} value={"read"}>
            Read
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="unread">
          <PageList data={data} size={size} setSize={setSize} />
        </Tabs.Content>
        <Tabs.Content value="read">Know Solid? Check out Svelte!</Tabs.Content>
      </Tabs.Root>
    </VStack>
  );
};
