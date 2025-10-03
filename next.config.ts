import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	images: {
		loader: "custom",
		loaderFile: "./src/lib/supabase/loader.tsx"
	},
	experimental: {
		typedEnv: true,
		viewTransition: true,
		authInterrupts: true,
		devtoolSegmentExplorer: true,
		serverActions: {
			bodySizeLimit: "20mb"
		}
	}
};

export default nextConfig;
