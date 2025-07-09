"use client";
import { useEffect, useState, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock, User, Users, Facebook, Apple, Chrome } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { signUpEmail } from "@/app/actions/auth";
import { ActionState } from "@/lib/action-helpers";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { extractReferralCode } from "@/lib/referral-utils";
import Image from "next/image";
import logo from "../../../../public/jf-pictogram.png";

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
    <div className={cn("flex flex-col relative", className)} {...props}>
      {/* Decorative background elements - blobs similar to landing page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-green-300 to-teal-300 opacity-10 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-purple-200 to-indigo-200 opacity-10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-pink-200 to-orange-200 opacity-10 blur-3xl" />
      </div>
      <div className="flex flex-col items-center mb-6 relative z-10">
        <div className="w-20 h-20 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-6">
          <Image src={logo} alt="juicefast" width={64} height={64} />
        </div>
        <h1 className="text-2xl font-semibold mb-1">Welcome to Juicefast</h1>
      </div>

      <form action={formAction} className="flex flex-col gap-4 relative z-10">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input name="name" id="name" type="text" placeholder="Full Name" required defaultValue={state.name} className="pl-10 h-12 rounded-xl bg-gray-50" />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input name="email" id="email" type="email" placeholder="Email" required defaultValue={state.email} className="pl-10 h-12 rounded-xl bg-gray-50" />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            name="password"
            id="password"
            type="password"
            placeholder="Create a password"
            required
            defaultValue={state.password}
            className="pl-10 h-12 rounded-xl bg-gray-50"
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
            defaultValue={state.confirmPassword}
            className="pl-10 h-12 rounded-xl bg-gray-50"
          />
        </div>

        <div className="relative">
          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            name="referralCode"
            id="referralCode"
            type="text"
            placeholder="Referral Code (optional)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-gray-50"
          />
          {/* Wrap the component that uses useSearchParams in Suspense */}
          <Suspense fallback={null}>
            <ReferralCodeHandler setReferralCode={setReferralCode} />
          </Suspense>
        </div>

        <div className="flex justify-end items-center mb-2">
          <Button type="submit" className="h-12 rounded-full bg-[#1A1A1A] text-white hover:bg-gray-800 w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </div>

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
          className="h-12 rounded-xl flex items-center justify-center gap-2 border border-gray-200 bg-[#1A1A1A] text-white"
          onClick={async () => {
            await authClient.signIn.social({
              provider: "facebook",
              callbackURL: "/onboarding",
            });
          }}
        >
          <Facebook className="h-5 w-5" />
          <span>Sign up with Facebook</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-xl flex items-center justify-center gap-2 border border-gray-200 bg-[#1A1A1A] text-white"
          onClick={async () => {
            await authClient.signIn.social({
              provider: "apple",
              callbackURL: "/onboarding",
            });
          }}
        >
          <Apple className="h-5 w-5" />
          <span>Sign up with Apple</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-xl flex items-center justify-center gap-2 border border-gray-200 bg-[#1A1A1A] text-white"
          onClick={async () => {
            await authClient.signIn.social({
              provider: "google",
              callbackURL: "/onboarding",
            });
          }}
        >
          <Chrome className="h-5 w-5" />
          <span>Sign up with Google</span>
        </Button>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="sign-in" className="font-medium underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
