"use server";

import { unstable_cache as cache } from "next/cache";

import { prisma } from "@/lib/db";
import type { Category, Prisma } from "@/lib/prisma/client";
import { productCardSelect, type ProductCardPayload } from "@/lib/types";

export const getCategories = cache(async () => {
	return (await prisma.category.findMany({ orderBy: { name: "asc" } })) satisfies Category[];
});

export const getDashboardProducts = cache(async () => {
	return await prisma.product.findMany({
		include: {
			category: { select: { name: true } },
			variations: { select: { name: true, color: true, stock: true } }
		}
	});
});
export type DashbboardProducts = Awaited<ReturnType<typeof getDashboardProducts>>[number];

export const getLimitedProducts = cache(async (limit: number, orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" }) => {
	return (await prisma.product.findMany({
		orderBy,
		take: limit,
		select: productCardSelect
	})) satisfies ProductCardPayload[];
});
