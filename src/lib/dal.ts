"use server";

import { unstable_cache as cache } from "next/cache";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import type { Category, Prisma } from "@/lib/prisma/client";
import { productCardSelect, productInclude, type ProductCardPayload, type ProductPayload } from "@/lib/types";

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

export const getProductBySlug = cache(async (slug: string) => {
	const product = (await prisma.product.findUnique({
		where: { slug },
		include: productInclude
	})) satisfies ProductPayload | null;

	if (!product) return notFound();

	return product;
});

export const getProductRating = cache(async (productId: number) => {
	const { _avg, _count } = await prisma.review.aggregate({
		where: { productId },
		_avg: { rating: true },
		_count: true
	});
	return { rating: _avg.rating ?? 0, totalRating: _count };
});
