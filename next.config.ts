import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	cacheComponents: true,
	images: {
		loader: "custom",
		loaderFile: "./src/lib/supabase/loader.tsx"
	},
	experimental: {
		viewTransition: true,
		authInterrupts: true,
		serverActions: {
			bodySizeLimit: "20mb"
		}
	}
};

export default nextConfig;
