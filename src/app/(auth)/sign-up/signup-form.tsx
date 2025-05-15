"use client";
import { useEffect, useState, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Users } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { signUpEmail } from "@/app/actions/auth";
import { ActionState } from "@/lib/action-helpers";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { extractReferralCode } from "@/lib/referral-utils";

// Component to handle the referral code from URL parameters
function ReferralCodeHandler({ setReferralCode }: { setReferralCode: (code: string) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferralCode(refCode);
    }
  }, [searchParams, setReferralCode]);

  return null;
}

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState<string>("");
  const [state, formAction, pending] = useActionState<ActionState, FormData>(signUpEmail, {
    error: "",
  });

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    }
    if (state.success && state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state.error, state.success, state.redirectTo, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input name="name" id="name" type="text" placeholder="John Doe" required defaultValue={state.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" id="email" type="email" placeholder="m@example.com" required defaultValue={state.email} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input name="password" id="password" type="password" required defaultValue={state.password} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input name="confirmPassword" id="confirmPassword" type="password" required defaultValue={state.confirmPassword} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="referralCode" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Referral Code</span>
                  <span className="text-xs text-gray-500 ml-1">(optional)</span>
                </Label>
                <Input
                  name="referralCode"
                  id="referralCode"
                  type="text"
                  placeholder="Enter referral code if you have one"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
                {/* Wrap the component that uses useSearchParams in Suspense */}
                <Suspense fallback={null}>
                  <ReferralCodeHandler setReferralCode={setReferralCode} />
                </Suspense>
              </div>
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={async () => {
                  await authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/onboarding",
                  });
                }}
              >
                Sign Up with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="sign-in" className="underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
