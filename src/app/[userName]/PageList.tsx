import { SWRInfiniteResponse } from "swr/infinite";

import { ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";
import { Text } from "@/components/park-ui";
import { Box, HStack, VStack } from "@styled-system/jsx";

export const PageList = ({
  data,
  size,
  setSize,
}: Pick<
  SWRInfiniteResponse<ApiUserPageResponse>,
  "data" | "size" | "setSize"
>) => {
  return (
    <VStack alignItems="stretch">
      {data?.map((pages) =>
        pages.map((page) => (
          <HStack key={page.id} alignItems="flex-start">
            <Box
              width="64px"
              height="64px"
              bg="gray"
              borderRadius="4px"
              borderWidth="thin"
              borderColor="lightgray"
              overflow="hidden"
            >
              {page.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt=""
                  src={page.image}
                  width="64"
                  height="64"
                  style={{
                    objectFit: "cover",
                    backgroundColor: "white",
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : null}
            </Box>
            <VStack flex="1" alignItems="flex-start" gap="0">
              <Text
                as="h3"
                fontWeight="semibold"
                textOverflow="ellipsis"
                lineClamp={1}
              >
                {page.title}
              </Text>
              <Text size="xs" textOverflow="ellipsis" lineClamp={2}>
                {page.description}
              </Text>
            </VStack>
          </HStack>
        ))
      )}
      <button onClick={() => setSize(size + 1)}>Load more</button>
    </VStack>
  );
};
