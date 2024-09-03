import { PlusIcon } from "lucide-react";
import { useActionState, useEffect } from "react";
import { SWRInfiniteResponse } from "swr/infinite";

import { requestAddPage } from "@/app/[userName]/AddPageFormAction";
import { ApiUserPageResponse } from "@/app/api/users/[userName]/pages/route";
import { Button } from "@/components/park-ui/button";
import { Field } from "@/components/park-ui/field";
import { HStack } from "@styled-system/jsx";

export function AddPageForm({
  isAvailable,
  mutate,
}: {
  isAvailable: boolean;
  mutate: SWRInfiniteResponse<ApiUserPageResponse>["mutate"];
}) {
  const [{ state, timestamp }, action, isPending] = useActionState(
    requestAddPage,
    {
      state: "idle",
      timestamp: Date.now(),
    } as const
  );

  useEffect(() => {
    if (state === "success") {
      mutate();
    }
  }, [state, timestamp, mutate]);

  return (
    <form action={action}>
      <HStack maxW="100vw" flexWrap="wrap" w="xl">
        <Field.Root flex="1">
          <Field.Input
            type="url"
            name="url"
            fontSize="xl"
            placeholder="https://..."
            required={true}
            disabled={!isAvailable || isPending}
          />
        </Field.Root>
        <Button type="submit" disabled={!isAvailable} loading={isPending}>
          <PlusIcon />
          Add to Unread
        </Button>
      </HStack>
    </form>
  );
}
