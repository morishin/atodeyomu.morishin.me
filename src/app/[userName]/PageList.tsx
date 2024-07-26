"use client";

import useSWRInfinite from "swr/infinite";
import { useEffect } from "react";

import { Box, HStack, Stack, VStack } from "@styled-system/jsx";
import { Text } from "@/components/park-ui";
import { ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";

type Page = ApiUserPageResponse[number];

const fetcher: (url: string) => Promise<ApiUserPageResponse> = (url: string) =>
  fetch(url).then((r) => r.json());

export const PageList = ({ userName }: { userName: string }) => {
  const getKey = (pageIndex: number, previousPageData: Page[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/users/${userName}/pages?page=${pageIndex}`;
  };

  const { data, size, setSize } = useSWRInfinite(getKey, fetcher);

  useEffect(() => {
    console.log("🔥", JSON.stringify(data, null, 2));
  }, [data]);

  return (
    <VStack>
      {data?.map((pages) =>
        pages.map((page) => (
          <Stack key={page.id}>
            <HStack>
              <Box width="50px" height="50px" bg="gray" borderRadius="4px">
                {page.image ? (
                  <img src={page.image} width="50" height="50" />
                ) : null}
              </Box>
              <VStack>
                <Text as="h3">{page.title}</Text>
                <Text>{page.description}</Text>
              </VStack>
            </HStack>
          </Stack>
        ))
      )}
      <button onClick={() => setSize(size + 1)}>Load more</button>
    </VStack>
  );
};
