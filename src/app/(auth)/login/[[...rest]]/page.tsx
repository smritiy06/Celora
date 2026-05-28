import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-start">
      <h1 className="mb-2 text-2xl font-bold text-text-primary">Welcome back</h1>
      <p className="mb-8 text-sm text-text-muted">Sign in to continue your learning journey</p>
      <SignIn
        routing="path"
        path="/login"
        appearance={{
          variables: {
            colorPrimary: "hsl(258 90% 66%)",
            fontFamily: "var(--font-inter), sans-serif",
          },
        }}
      />
    </div>
  );
}
