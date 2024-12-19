import { SWRInfiniteResponse } from "swr/infinite";
import { CreateToasterReturn } from "@ark-ui/react";
import { useContext } from "react";

import { ApiUserPageResponse } from "@/app/api/users/[userName]/pages/fetchPages";
import { Text } from "@/components/park-ui";
import { VStack } from "@styled-system/jsx";
import { Button } from "@/components/park-ui/button";
import { PageListItem } from "@/app/[userName]/PageListItem";
import { LocaleContext } from "@/lib/i18n/LocaleProvider";
import { i18n } from "@/lib/i18n/strings";

export const PageList = ({
  data,
  size,
  setSize,
  isRead,
  isMyPage,
  isLoading,
  showLoadMore,
  refresh,
  toaster,
  emptyMessage,
}: Pick<
  SWRInfiniteResponse<ApiUserPageResponse>,
  "data" | "size" | "setSize"
> & {
  isRead: boolean;
  isMyPage: boolean;
  isLoading: boolean;
  showLoadMore: boolean;
  refresh: () => Promise<void>;
  toaster: CreateToasterReturn;
  emptyMessage: string;
}) => {
  const { locale } = useContext(LocaleContext);
  return (
    <VStack alignItems="stretch">
      {data?.map((res) =>
        res.pages.map((page) => (
          <PageListItem
            key={page.id}
            page={page}
            isMyPage={isMyPage}
            isRead={isRead}
            refresh={refresh}
            toaster={toaster}
          />
        ))
      )}
      {showLoadMore || isLoading ? (
        <Button
          variant="outline"
          loading={isLoading}
          onClick={() => setSize(size + 1)}
        >
          {i18n("Load More", locale)}
        </Button>
      ) : data?.[0]?.pages.length === 0 ? (
        <Text paddingTop="6" color="fg.subtle" textAlign="center">
          {emptyMessage}
        </Text>
      ) : null}
    </VStack>
  );
};
