import { type NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	cacheComponents: true,
	partialPrefetching: true,
	images: {
		remotePatterns: [{ protocol: "https", hostname: "ik.imagekit.io" }],
	},
	logging: {
		serverFunctions: true,
		browserToTerminal: true,
	},
	experimental: {
		authInterrupts: true,
		turbopackFileSystemCacheForBuild: true,
	},
};

export default nextConfig;
