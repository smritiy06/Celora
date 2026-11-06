import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Create a teacher account" };

export default function TeacherSignupPage() {
  return <SignUp routing="path" path="/teach/signup" signInUrl="/teach/login" forceRedirectUrl="/onboarding?as=teacher" />;
}
