import { auth } from "@/app/lib/auth/auth";
import { LoginButton } from "@/app/components/LoginButton";

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
