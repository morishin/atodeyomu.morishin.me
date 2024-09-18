import { useActionState, useEffect } from "react";

import { Button } from "@/components/park-ui/button";
import { requestDeleteUser } from "@/app/welcome/DeleteUserFormAction";

export const DeleteUserForm = () => {
  const [{ state, timestamp }, action] = useActionState(requestDeleteUser, {
    state: "idle",
    timestamp: Date.now(),
  } as const);

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
        Cancel creating account
      </Button>
    </form>
  );
};
