import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Sign in to your account</h1>
      <SignIn fallbackRedirectUrl="/" />
    </main>
  );
}
