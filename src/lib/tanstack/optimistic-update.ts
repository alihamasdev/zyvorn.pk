import type { QueryKey } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/tanstack/get-query-client";

export async function optimisticUpdate<T>(queryKey: QueryKey, updator: (oldData: T | undefined) => T | undefined) {
	const queryClient = getQueryClient();

	await queryClient.cancelQueries({ queryKey });

	const previousData = queryClient.getQueryData<T>(queryKey);

	const updatedData = queryClient.setQueryData<T>(queryKey, updator);

	return [previousData, updatedData];
}
