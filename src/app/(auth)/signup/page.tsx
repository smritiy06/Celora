import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-start">
      <h1 className="mb-2 text-2xl font-bold text-text-primary">Create your account</h1>
      <p className="mb-8 text-sm text-text-muted">Start your learning journey with Celora</p>
      <SignUp
        routing="hash"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-transparent shadow-none p-0 w-full",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton:
              "bg-white/[0.04] border border-white/[0.08] text-text-secondary hover:bg-white/[0.08] transition-colors rounded-lg",
            socialButtonsBlockButtonText: "text-text-secondary font-medium",
            dividerLine: "bg-white/[0.06]",
            dividerText: "text-text-muted text-xs",
            formFieldLabel: "text-sm font-medium text-text-secondary",
            formFieldInput:
              "h-10 w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-4 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-colors",
            formButtonPrimary:
              "w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25",
            footerActionLink: "text-primary-light hover:underline font-medium",
            footerActionText: "text-text-muted text-sm",
            identityPreviewText: "text-text-primary",
            identityPreviewEditButton: "text-primary-light",
            formResendCodeLink: "text-primary-light",
            otpCodeFieldInput:
              "border border-white/[0.08] bg-white/[0.04] text-text-primary rounded-lg",
            alertText: "text-text-secondary text-sm",
            formFieldErrorText: "text-accent-rose text-xs",
            footer: "bg-transparent",
          },
          variables: {
            colorPrimary: "hsl(258 90% 66%)",
            colorBackground: "transparent",
            colorInputBackground: "rgba(255,255,255,0.04)",
            colorInputText: "hsl(0 0% 95%)",
            colorText: "hsl(0 0% 85%)",
            colorTextSecondary: "hsl(0 0% 60%)",
            borderRadius: "0.5rem",
            fontFamily: "var(--font-inter), sans-serif",
          },
        }}
      />
    </div>
  );
}
