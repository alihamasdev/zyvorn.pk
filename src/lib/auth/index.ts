import { config } from "~/src/lib/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";

import { db } from "@/lib/db";
import { sendMagicLinkEmail } from "@/lib/email";

export const auth = betterAuth({
	name: config.name,
	baseURL: config.baseUrl,
	database: prismaAdapter(db, {
		provider: "postgresql",
	}),
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		},
	},
	plugins: [
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				await sendMagicLinkEmail({ to: email, url });
			},
		}),
	],
	user: {
		additionalFields: {
			role: {
				type: "string",
				input: false,
			},
		},
	},
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
