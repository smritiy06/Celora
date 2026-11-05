import { SignUp } from "@clerk/nextjs";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return <SignUp routing="path" path="/signup" />;
}
