// Utility functions for the referral system

/**
 * Generates a unique referral code for a user
 * Format: Combination of user initials (if available) + random alphanumeric characters
 * @param name Optional user name to incorporate into the code
 * @returns A unique referral code
 */
export function generateReferralCode(name?: string): string {
  // Get initials if name is provided
  let prefix = "";
  if (name) {
    const nameParts = name.split(" ");
    prefix = nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  }

  // If no initials, use a random letter
  if (!prefix) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    prefix = letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Generate random alphanumeric string (6 characters)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${prefix}${randomPart}`;
}

/**
 * Creates a shareable referral link with the given referral code
 * @param referralCode The user's referral code
 * @returns A complete referral link that can be shared
 */
export function createReferralLink(referralCode: string): string {
  // Use the environment variable for the base URL
  let baseUrl;

  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // Try to get from env variable first, fallback to window.location.origin
    baseUrl = process.env.NEXT_PUBLIC_BASEURL || window.location.origin;
  } else {
    // Server-side rendering - only use env variable
    baseUrl = process.env.NEXT_PUBLIC_BASEURL || "";
  }

  if (!baseUrl) {
    console.warn("No base URL found for referral link, using default");
  }

  return `${baseUrl}/sign-up?ref=${referralCode}`;
}

/**
 * Extracts a referral code from a URL if present
 * @param url The URL to check for a referral code
 * @returns The referral code if found, otherwise null
 */
export function extractReferralCode(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("ref");
  } catch (e) {
    return null;
  }
}
