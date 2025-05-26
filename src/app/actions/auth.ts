"use server";

import { validatedAction } from "@/lib/action-helpers";
import { auth } from "@/lib/auth";
import { LoginSchema, SignUpSchema } from "@/types/auth";
import { getUserProfile, saveUserProfile } from "@/app/actions/health-actions";
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
        // Create initial profile for the new user with referredBy field
        const newUserProfile: UserProfile = {
          id: result.user?.id || '', // Use user.id from auth result
          height: 170, // Default value
          referredBy: data.referralCode,
        };

        // Save the new user's profile
        await saveUserProfile(newUserProfile);
        
        // In a real implementation, we would also update the referrer's profile
        // This would require a database query to find the referrer and update their stats
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

// Helper function to get all user profiles
async function getAllUserProfiles(): Promise<UserProfile[]> {
  try {
    // In a real implementation, you would query the database for all profiles
    // This is a simplified approach that would need to be replaced with a proper query
    // For now, we'll just return an empty array since we don't have a way to query all profiles
    return [];
  } catch (error) {
    console.error("Error getting profiles:", error);
    return [];
  }
}
