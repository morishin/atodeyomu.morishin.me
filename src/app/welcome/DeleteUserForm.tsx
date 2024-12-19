import { useActionState, useContext, useEffect } from "react";

import { Button } from "@/components/park-ui/button";
import { requestDeleteUser } from "@/app/welcome/DeleteUserFormAction";
import { LocaleContext } from "@/lib/i18n/LocaleProvider";
import { i18n } from "@/lib/i18n/strings";

export const DeleteUserForm = () => {
  const [{ state, timestamp }, action] = useActionState(requestDeleteUser, {
    state: "idle",
    timestamp: Date.now(),
  } as const);

  const { locale } = useContext(LocaleContext);

  useEffect(() => {
    if (state === "success") {
      location.href = "/";
    } else if (state === "error") {
      window.alert("Unexpected error occurred");
    }
  }, [state, timestamp]);

  return (
    <form action={action}>
      <Button type="submit" variant="ghost" colorPalette="red">
        {i18n("Cancel creating account", locale)}
      </Button>
    </form>
  );
};
