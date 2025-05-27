import { ProfileClient } from "@/components/profile/profile-client";
import { getUserProfile } from "@/app/actions/health-actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Profile Page - Server Component
 * Fetches user profile data from the database and passes it to the client component
 */
export default async function ProfilePage() {
  // Get the authenticated user ID and email
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id ?? "";
  const user = session?.user || null;

  // Fetch user profile data
  const userProfile = await getUserProfile(userId);

  return <ProfileClient userId={userId} user={user} initialProfile={userProfile} />;
}
