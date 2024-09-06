import { useActionState, useEffect } from "react";

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
      <button type="submit" style={{ cursor: "pointer" }}>
        Cencel creating account
      </button>
    </form>
  );
};
