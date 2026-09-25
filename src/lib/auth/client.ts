import { inferAdditionalFields, magicLinkClient } from "better-auth/client/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";

import { auth } from "@/lib/auth";

export const { signOut, signIn, useSession, updateUser, getSession } = createAuthClient({
	plugins: [inferAdditionalFields<typeof auth>(), magicLinkClient(), nextCookies()],
});
