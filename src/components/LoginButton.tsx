"use client";
import { signIn } from "next-auth/react";

export const LoginButton = () => (
  <button onClick={() => signIn()}>Login</button>
);
