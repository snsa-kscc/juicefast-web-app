"use server";

import { db } from "@/db";
import { userProfile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { generateReferralCode } from "@/lib/referral-utils";

/**
 * Get referral data for a user
 * This function separates referral data from the full user profile
 */
export async function getUserReferralData(userId: string) {
  try {
    if (!userId) return null;
    
    const profiles = await db
      .select({
        referralCode: userProfile.referralCode,
        referredBy: userProfile.referredBy,
        referralCount: userProfile.referralCount,
        referrals: userProfile.referrals,
      })
      .from(userProfile)
      .where(eq(userProfile.userId, userId));
    
    if (profiles.length === 0) return null;
    
    return {
      referralCode: profiles[0].referralCode || "",
      referredBy: profiles[0].referredBy || undefined,
      referralCount: profiles[0].referralCount || 0,
      referrals: profiles[0].referrals || [],
    };
  } catch (error) {
    console.error("Failed to get user referral data:", error);
    return null;
  }
}

/**
 * Save referral data for a user
 * This function updates only the referral-related fields in the user profile
 */
export async function saveReferralData(
  userId: string, 
  data: {
    referralCode: string;
    referralCount: number;
    referrals: string[];
    referredBy?: string;
  }
) {
  try {
    if (!userId) return false;
    
    // Check if user profile exists
    const profiles = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId));
    
    const now = new Date();
    
    if (profiles.length > 0) {
      // Update existing profile's referral data
      await db
        .update(userProfile)
        .set({
          referralCode: data.referralCode,
          referredBy: data.referredBy || null,
          referralCount: data.referralCount,
          referrals: data.referrals,
          updatedAt: now,
        })
        .where(eq(userProfile.userId, userId));
    } else {
      // Create a minimal profile with just referral data
      // This allows referrals to work even if the user hasn't completed their profile
      const id = uuidv4();
      await db.insert(userProfile).values({
        id,
        userId,
        height: 0, // Default value (required field)
        referralCode: data.referralCode,
        referredBy: data.referredBy || null,
        referralCount: data.referralCount,
        referrals: data.referrals,
        createdAt: now,
        updatedAt: now,
      });
    }
    
    return true;
  } catch (error) {
    console.error("Failed to save referral data:", error);
    return false;
  }
}

/**
 * Generate a referral code for a user
 * This is a standalone function that doesn't require a complete profile
 */
export async function generateUserReferralCode(userId: string, name?: string): Promise<string | null> {
  try {
    if (!userId) return null;
    
    // Check if user already has a referral code
    const referralData = await getUserReferralData(userId);
    if (referralData?.referralCode) {
      return referralData.referralCode;
    }
    
    // Generate a new referral code
    const code = generateReferralCode(name);
    
    // Save the referral code
    await saveReferralData(userId, {
      referralCode: code,
      referralCount: 0,
      referrals: [],
    });
    
    return code;
  } catch (error) {
    console.error("Failed to generate referral code:", error);
    return null;
  }
}
