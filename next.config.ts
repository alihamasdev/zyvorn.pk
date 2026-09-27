import { type NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	cacheComponents: true,
	partialPrefetching: true,
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
