import { signUpAction, signUpWithGoogle } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex flex-1 justify-center items-center gap-2 p-4 w-full sm:max-w-md h-screen">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col mx-auto min-w-64 max-w-64">
        <h1 className="font-medium text-2xl">Sign up</h1>
        <p className="text-foreground text-sm text">
          Already have an account?{" "}
          <Link className="font-medium text-primary underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <form>
        <SubmitButton pendingText="Signing In..." formAction={signUpWithGoogle}>
          Sign up with google
        </SubmitButton>
      </form>
      <SmtpMessage />
    </>
  );
}
