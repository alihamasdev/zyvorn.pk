import { environmentManager, QueryClient } from "@tanstack/react-query";
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
	if (environmentManager.isServer()) {
		return makeQueryClient();
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}
