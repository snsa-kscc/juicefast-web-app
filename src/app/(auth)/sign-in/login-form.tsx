"use client";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock, Facebook, Apple, Chrome } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { signInEmail } from "@/app/actions/auth";
import { ActionState } from "@/lib/action-helpers";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";
import logo from "../../../../public/jf-pictogram.png";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(signInEmail, {
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
        <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
      </div>

      <form action={formAction} className="flex flex-col gap-4 relative z-10">
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
            placeholder="Password"
            required
            defaultValue={state.password}
            className="pl-10 h-12 rounded-xl bg-gray-50"
          />
        </div>

        <div className="flex justify-between items-center mb-2">
          <Link href="#" className="text-sm text-gray-500 hover:underline">
            Forgot password?
          </Link>

          <Button type="submit" className="h-12 rounded-full bg-[#1A1A1A] text-white hover:bg-gray-800 basis-1/2" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Log in"
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
          <span>Facebook</span>
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
          <span>Apple</span>
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
          <span>Google</span>
        </Button>

        <div className="mt-6 text-center text-sm text-gray-500">
          Not a member yet?{" "}
          <Link href="sign-up" className="font-medium underline underline-offset-4">
            Start your journey
          </Link>
        </div>
      </form>
    </div>
  );
}
