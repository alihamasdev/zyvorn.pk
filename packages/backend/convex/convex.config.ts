import { defineApp } from "convex/server";
import { v } from "convex/values";

import auth from "./components/auth/convex.config";

const app = defineApp({
	env: {
		AUTH_SECRET: v.string(),
		SITE_URL: v.optional(v.string()),
		NATIVE_APP_URL: v.optional(v.string()),
	},
});

app.use(auth, { name: "auth" });

export default app;
