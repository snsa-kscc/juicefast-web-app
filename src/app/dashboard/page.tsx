import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./client";
import { HealthTrackerApp } from "./tracker";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div>
      <HealthTrackerApp />
      <p>{!session ? "Not logged in" : session.user.email}</p>
      <SignOutButton />
    </div>
  );
}
