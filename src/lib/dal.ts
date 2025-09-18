"use server";

import { cache } from "react";

import { prisma } from "@/lib/db";
import type { ProductPayload } from "@/lib/types";

export const getCategories = cache(async () => {
	return await prisma.category.findMany({ orderBy: { name: "asc" } });
});

export const getProducts = cache(async (): Promise<ProductPayload[]> => {
	return await prisma.product.findMany({
		include: {
			category: { select: { name: true, slug: true } },
			variations: { select: { name: true, color: true, stock: true } }
		}
	});
});
