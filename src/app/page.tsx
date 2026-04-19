import { redirect } from "next/navigation";

import { LandingContent } from "@/app/LandingContent";
import { auth } from "@/lib/auth/auth";
import { locale } from "@/lib/i18n/locale";
import { redirectToWelcomePageIfNeeded } from "@/lib/redirects";

export default async function Home() {
  const session = await auth();
  if (session?.user?.name) {
    await redirectToWelcomePageIfNeeded(session);
    redirect(`/${session.user.name}`);
  }
  const lang = await locale();
  return <LandingContent lang={lang} />;
}
