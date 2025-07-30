import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Create your account</h1>
      <SignUp forceRedirectUrl="/user/onboarding" />
    </main>
  );
}
