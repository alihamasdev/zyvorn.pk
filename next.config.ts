import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	images: {
		loader: "custom",
		loaderFile: "./src/lib/supabase/loader.tsx"
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "20mb"
		}
	}
};

export default nextConfig;
