import { LoginButton } from "@/components/LoginButton";
import { auth } from "@/lib/auth/auth";

export default async function Home() {
  const session = await auth();
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
