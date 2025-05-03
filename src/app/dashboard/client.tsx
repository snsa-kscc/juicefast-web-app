"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export function SignOutButton() {
  return (
    <Button
      onClick={async () =>
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              redirect("/");
            },
          },
        })
      }
    >
      Sign out
    </Button>
  );
}
