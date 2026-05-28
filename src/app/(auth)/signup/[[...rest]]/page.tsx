import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-start">
      <h1 className="mb-2 text-2xl font-bold text-text-primary">Create your account</h1>
      <p className="mb-8 text-sm text-text-muted">Start your learning journey with Celora</p>
      <SignUp
        routing="path"
        path="/signup"
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
