"use client";
import { signIn } from "next-auth/react";

import { Button } from "@/components/park-ui/button";

export const LoginButton = ({ callbackUrl }: { callbackUrl?: string }) => (
  <Button size="md" onClick={() => signIn(undefined, { callbackUrl })}>
    Login
  </Button>
);
