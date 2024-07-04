"use client";
import { signIn } from "next-auth/react";

import { Button } from "@/components/park-ui/button";

export const LoginButton = () => (
  <Button size="md" onClick={() => signIn()}>
    Login
  </Button>
);
