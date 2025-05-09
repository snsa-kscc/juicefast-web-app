"use server";

import { validatedAction } from "@/lib/action-helpers";
import { auth } from "@/lib/auth";
import { LoginSchema, SignUpSchema } from "@/types/auth";
import { loadUserProfile, saveUserProfile } from "@/lib/daily-tracking-store";
import { UserProfile } from "@/types/health-metrics";

export const signInEmail = validatedAction(LoginSchema, async (data) => {
  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    return {
      success: true,
      redirectTo: "/onboarding",
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign in",
    };
  }
});

export const signUpEmail = validatedAction(SignUpSchema, async (data) => {
  try {
    // Sign up the user
    const result = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });

    // Handle referral code if provided
    if (data.referralCode) {
      try {
        // In a real app, you would query a database to find the user with this referral code
        // For this demo, we'll use localStorage to simulate this
        // Note: In a real app, this would be a server-side database operation

        // Get all user profiles (in a real app, this would be a database query)
        // This is a simplified approach for demo purposes
        const allProfiles = getAllUserProfiles();

        // Find the referrer profile
        const referrerProfile = allProfiles.find((profile) => profile.referralCode === data.referralCode);

        if (referrerProfile) {
          // Update referrer's stats
          referrerProfile.referralCount = (referrerProfile.referralCount || 0) + 1;
          referrerProfile.referrals = [...(referrerProfile.referrals || []), data.email];

          // Save updated referrer profile
          saveUserProfile(referrerProfile);

          // Create initial profile for the new user with referredBy field
          const newUserProfile: UserProfile = {
            id: result.user?.id, // Use user.id from auth result
            height: 170, // Default value
            referredBy: data.referralCode,
          };

          // Save the new user's profile
          saveUserProfile(newUserProfile);
        }
      } catch (refError) {
        console.error("Error processing referral:", refError);
        // We don't want to fail the signup if referral processing fails
      }
    }

    return {
      success: true,
      redirectTo: "/onboarding",
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sign up",
    };
  }
});

// Helper function to get all user profiles (simplified for demo)
// In a real app, this would be a database query
function getAllUserProfiles(): UserProfile[] {
  try {
    // This is a simplified approach for demo purposes
    // In a real app, you would query a database
    const profile = loadUserProfile();
    return profile ? [profile] : [];
  } catch (error) {
    console.error("Error getting profiles:", error);
    return [];
  }
}
