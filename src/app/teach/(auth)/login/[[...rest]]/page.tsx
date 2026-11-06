import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Teacher log in" };

export default function TeacherLoginPage() {
  return <SignIn routing="path" path="/teach/login" signUpUrl="/teach/signup" forceRedirectUrl="/teacher" />;
}
