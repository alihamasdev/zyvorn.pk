import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { type ConvexQueryClient } from "@convex-dev/react-query";
import { type QueryClient } from "@tanstack/react-query";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext, useRouteContext } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { authClient } from "@/lib/auth-client";
import { getToken } from "@/lib/auth-server";

import appCss from "../styles.css?url";

const getAuth = createServerFn({ method: "GET" }).handler(async () => {
	return await getToken();
});

export type RouterAppContext = {
	queryClient: QueryClient;
	convexQueryClient: ConvexQueryClient;
};

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		links: [{ rel: "stylesheet", href: appCss }],
		meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { title: "ZYVORN" }],
	}),
	component: RootDocument,
	beforeLoad: async (ctx) => {
		const token = await getAuth();
		if (token) {
			ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
		}
		return { isAuthenticated: !!token, token };
	},
});

function RootDocument() {
	const context = useRouteContext({ from: Route.id });
	return (
		<ConvexBetterAuthProvider client={context.convexQueryClient.convexClient} authClient={authClient} initialToken={context.token}>
			<html lang="en" data-theme="light" data-accent="blue">
				<head>
					<HeadContent />
				</head>
				<body>
					<main className="flex min-h-dvh flex-col">
						<Outlet />
					</main>
					<Scripts />
				</body>
			</html>
		</ConvexBetterAuthProvider>
	);
}
