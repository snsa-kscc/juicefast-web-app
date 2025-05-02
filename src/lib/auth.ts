import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: true,
    maxPasswordLength: 100,
    minPasswordLength: 8,
    sendResetPassword: async (data, request) => {
      console.log("Reset password email sent to:", data.user.email);
    },
    resetPasswordTokenExpiresIn: 3600,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
