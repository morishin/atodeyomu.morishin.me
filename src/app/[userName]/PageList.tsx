import { SWRInfiniteResponse } from "swr/infinite";

import { ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";
import { Text } from "@/components/park-ui";
import { VStack } from "@styled-system/jsx";
import { Button } from "@/components/park-ui/button";
import { PageListItem } from "@/app/[userName]/PageListItem";

export const PageList = ({
  data,
  size,
  setSize,
  isRead,
  isLoading,
  showLoadMore,
  refresh,
}: Pick<
  SWRInfiniteResponse<ApiUserPageResponse>,
  "data" | "size" | "setSize"
> & {
  isRead: boolean;
  isLoading: boolean;
  showLoadMore: boolean;
  refresh: () => Promise<void>;
}) => {
  return (
    <VStack alignItems="stretch">
      {data?.map((pages) =>
        pages.map((page) => (
          <PageListItem
            key={page.id}
            page={page}
            isRead={isRead}
            refresh={refresh}
          />
        ))
      )}
      {showLoadMore || isLoading ? (
        <Button
          variant="outline"
          loading={isLoading}
          onClick={() => setSize(size + 1)}
        >
          Load More
        </Button>
      ) : data?.[0]?.length === 0 ? (
        <Text textAlign="center">No item</Text>
      ) : null}
    </VStack>
  );
};
