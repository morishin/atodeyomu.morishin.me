import { LoginButton } from "@/components/LoginButton";
import { auth } from "@/lib/auth/auth";
import { redirectToWelcomePageIfNeeded } from "@/lib/redirects";

export default async function Home() {
  const session = await auth();
  await redirectToWelcomePageIfNeeded(session);
  return (
    <main>
      {session ? (
        <div>{JSON.stringify(session.user, null, 2)}</div>
      ) : (
        <LoginButton />
      )}
    </main>
  );
}
