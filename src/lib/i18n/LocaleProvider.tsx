"use client";

import { createContext } from "react";

import { Locale } from "@/lib/i18n/locale";

export const LocaleContext = createContext<{ locale: Locale }>({
  locale: "default",
});

export default function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
}
