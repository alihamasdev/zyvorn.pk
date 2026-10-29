import { expo } from "@better-auth/expo";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { emailOTP } from "better-auth/plugins";

import { components } from "./_generated/api";
import { type DataModel } from "./_generated/dataModel";
import { env, query } from "./_generated/server";
import authConfig from "./auth.config";
import authSchema from "./components/auth/schema";

const siteUrl = env.SITE_URL || "http://localhost:3000";
const nativeAppUrl = env.NATIVE_APP_URL || "zyvorn://";

export const auth = createClient<DataModel, typeof authSchema>(components.auth, {
	local: {
		schema: authSchema,
	},
});

export function createAuthOptions(ctx: GenericCtx<DataModel>): BetterAuthOptions {
	return {
		baseURL: siteUrl,
		secret: env.AUTH_SECRET,
		trustedOrigins: [siteUrl, nativeAppUrl, "exp://"],
		database: auth.adapter(ctx),
		user: {
			additionalFields: {
				role: {
					type: "string",
					required: false,
					defaultValue: "user",
					input: false,
				},
			},
		},
		emailAndPassword: {
			enabled: false,
		},
		plugins: [
			expo(),
			crossDomain({ siteUrl }),
			convex({ authConfig, jwksRotateOnTokenGenerationError: true }),
			emailOTP({
				sendVerificationOTP: async ({ email, otp, type }) => {
					console.log(`[Zyvorn Auth] OTP for ${email} (${type}): ${otp}`);
				},
			}),
		],
	};
}

export function createAuth(ctx: GenericCtx<DataModel>) {
	return betterAuth(createAuthOptions(ctx));
}

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		return await auth.safeGetAuthUser(ctx);
	},
});
