// A simple token-based authentication mechanism
// This is a "quick and dirty" solution as requested

// This would ideally come from an environment variable
// Using NEXT_PUBLIC_ prefix to make it available on client-side
export const SECRET_TOKEN = process.env.NEXT_PUBLIC_SECRET_TOKEN || "default-token-if-not-set";

/**
 * Checks if the provided token matches the secret token
 */
export function isValidToken(token: string | null): boolean {
  // If SECRET_TOKEN is undefined (during SSR), don't authenticate
  if (!SECRET_TOKEN) return false;
  return token === SECRET_TOKEN;
}
