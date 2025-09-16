"use client";

import { createContext, use } from "react";
import type { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/lib/dal";

const CategoriesContext = createContext<Category[] | null>(null);

export function CategoriesProvider({ dataPromise, children }: { children: React.ReactNode; dataPromise: Promise<Category[]> }) {
	const { data } = useQuery({
		queryKey: ["categories", "dashboard"],
		initialData: use(dataPromise),
		queryFn: getCategories,
		staleTime: Infinity
	});

	return <CategoriesContext value={data}>{children}</CategoriesContext>;
}

export function useCategories() {
	const categories = use(CategoriesContext);
	if (!categories) throw new Error("useCategories must be used within `CategoriesProvider`");
	return categories;
}
