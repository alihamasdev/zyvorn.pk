import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	experimental: {
		typedEnv: true,
		viewTransition: true,
		authInterrupts: true,
		devtoolSegmentExplorer: true
	}
};

export default nextConfig;
