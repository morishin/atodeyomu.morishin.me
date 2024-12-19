import { PlusIcon } from "lucide-react";
import { useActionState, useContext, useEffect, useState } from "react";
import { CreateToasterReturn } from "@ark-ui/react";

import { requestAddPage } from "@/app/[userName]/AddPageFormAction";
import { Button } from "@/components/park-ui/button";
import { Field } from "@/components/park-ui/field";
import { HStack, Box } from "@styled-system/jsx";
import { LocaleContext } from "@/lib/i18n/LocaleProvider";
import { i18n } from "@/lib/i18n/strings";

export function AddPageForm({
  refresh,
  toaster,
}: {
  refresh: () => Promise<void>;
  toaster: CreateToasterReturn;
}) {
  const [{ state, timestamp }, action, isPending] = useActionState(
    requestAddPage,
    {
      state: "idle",
      timestamp: Date.now(),
    } as const
  );

  const { locale } = useContext(LocaleContext);

  useEffect(() => {
    if (state === "success") {
      refresh();
      toaster.create({
        title: i18n("Added to your unread", locale),
        type: "success",
      });
    }
  }, [state, refresh, timestamp, toaster, locale]);

  const [isAddButtonEnabled, setIsAddButtonEnabled] = useState(false);

  return (
    <Box width="100%" paddingInline={{ smDown: "4", base: "0" }}>
      <form action={action}>
        <HStack>
          <Field.Root flex="1">
            <Field.Input
              type="url"
              name="url"
              fontSize={{ smDown: "lg", base: "xl" }}
              placeholder="https://..."
              required={true}
              disabled={isPending}
              onChange={(e) => {
                setIsAddButtonEnabled(e.target.value.length > 0);
              }}
            />
          </Field.Root>
          <Button
            type="submit"
            disabled={!isAddButtonEnabled || isPending}
            loading={isPending}
          >
            <PlusIcon />
            <Box display={{ smDown: "none", base: "inline" }}>
              {i18n("Add to unread", locale)}
            </Box>
            <Box display={{ smDown: "inline", base: "none" }}>Add</Box>
          </Button>
        </HStack>
      </form>
    </Box>
  );
}
