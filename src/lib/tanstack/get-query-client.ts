import { isServer, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function makeQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: Infinity,
			},
			mutations: {
				onError(error) {
					console.error(error);
					toast.error(error.message ?? "Something went wrong");
				},
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
	if (isServer) {
		return makeQueryClient();
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}
