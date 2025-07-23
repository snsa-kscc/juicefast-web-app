"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock, User, Facebook, Apple, Chrome } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useActionState } from "react";
import { signInEmail, signUpEmail } from "@/app/actions/auth";
import { ActionState } from "@/lib/action-helpers";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import logo from "../../public/jf-pictogram.png";

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

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showSignUp, setShowSignUp] = useState(true); // Default to sign up view
  const [referralCode, setReferralCode] = useState<string>("");

  // Login form state
  const [loginState, loginFormAction, loginPending] = useActionState<ActionState, FormData>(signInEmail, {
    error: "",
  });

  // Signup form state
  const [signupState, signupFormAction, signupPending] = useActionState<ActionState, FormData>(signUpEmail, {
    error: "",
  });

  useEffect(() => {
    setMounted(true);

    // Handle login form state
    if (loginState.error) {
      toast.error(loginState.error);
    }
    if (loginState.success && loginState.redirectTo) {
      router.push(loginState.redirectTo);
    }

    // Handle signup form state
    if (signupState.error) {
      toast.error(signupState.error);
    }
    if (signupState.success && signupState.redirectTo) {
      router.push(signupState.redirectTo);
    }
  }, [loginState, signupState, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-6">
            <Image src={logo} alt="Juicefast" width={64} height={64} />
          </div>

          {/* Tagline */}
          <h1 className="text-3xl font-semibold text-center mb-8">
            Become the best
            <br />
            version of yourself
          </h1>
        </div>

        {showSignUp ? (
          /* Sign Up Form */
          <div className="space-y-4">
            <Link href="/sign-up" className="block w-full text-center py-3 px-4 border border-gray-300 rounded-full font-medium">
              Sign up with email
            </Link>
            <Link href="/sign-in" className="block w-full text-center py-3 px-4 border border-gray-300 rounded-full font-medium">
              Sign in with email
            </Link>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-md flex items-center justify-center gap-2 border border-gray-300 bg-[#1A1A1A] text-white hover:bg-gray-50"
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "apple",
                  callbackURL: "/onboarding",
                });
              }}
            >
              <Apple className="h-5 w-5" />
              <span>Continue with Apple</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-md flex items-center justify-center gap-2 border border-gray-300 bg-[#1A1A1A] text-white hover:bg-gray-50"
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/onboarding",
                });
              }}
            >
              <Chrome className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-md flex items-center justify-center gap-2 border border-gray-300 bg-[#1A1A1A] text-white hover:bg-gray-50"
              onClick={async () => {
                await authClient.signIn.social({
                  provider: "facebook",
                  callbackURL: "/onboarding",
                });
              }}
            >
              <Facebook className="h-5 w-5" />
              <span>Continue with Facebook</span>
            </Button>

            <div className="text-center text-xs text-gray-500 mt-8">
              By joining, you're cool with our{" "}
              <Link href="/terms" className="underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .<br />
              Respect, privacy, and good vibes only.
            </div>

            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium text-[#1A1A1A] underline underline-offset-4">
                Log in
              </Link>
            </div>
          </div>
        ) : (
          /* Email Sign Up Form */
          <div className="space-y-4">
            <form action={signupFormAction} className="flex flex-col gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  name="name"
                  id="name"
                  type="text"
                  placeholder="Full Name"
                  required
                  defaultValue={signupState.name}
                  className="pl-10 h-12 rounded-xl bg-white border-gray-300"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  defaultValue={signupState.email}
                  className="pl-10 h-12 rounded-xl bg-white border-gray-300"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  name="password"
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  required
                  defaultValue={signupState.password}
                  className="pl-10 h-12 rounded-xl bg-white border-gray-300"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  required
                  defaultValue={signupState.confirmPassword}
                  className="pl-10 h-12 rounded-xl bg-white border-gray-300"
                />
              </div>

              <div className="relative">
                <Suspense fallback={null}>
                  <ReferralCodeHandler setReferralCode={setReferralCode} />
                </Suspense>
                <Input
                  name="referralCode"
                  id="referralCode"
                  type="text"
                  placeholder="Referral Code (optional)"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="h-12 rounded-xl bg-white border-gray-300"
                />
              </div>

              <Button type="submit" className="h-12 rounded-full bg-[#1A1A1A] text-white hover:bg-gray-800 w-full mt-2" disabled={signupPending}>
                {signupPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Create account"
                )}
              </Button>

              <Button type="button" variant="ghost" className="mt-2 text-gray-500" onClick={() => setShowSignUp(true)}>
                Back
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
