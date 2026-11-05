import { SignIn } from "@clerk/nextjs";

export const metadata = { title: "Log in" };

export default function LoginPage() {
  return <SignIn routing="path" path="/login" />;
}
