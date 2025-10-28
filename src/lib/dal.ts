"use server";

import { cache } from "react";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import type { Category, Prisma } from "@/lib/prisma/client";
import { productCardSelect, productInclude, type CartProduct, type ProductCardPayload, type ProductPayload } from "@/lib/types";

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

export const getProductRating = cache(async (productId: string) => {
	const { _avg, _count } = await prisma.review.aggregate({
		where: { productId },
		_avg: { rating: true },
		_count: true
	});
	return { rating: _avg.rating ?? 0, totalRating: _count };
});

export const getProductReviews = cache(async (productId: string) => {
	return await prisma.review.findMany({
		take: 15,
		where: { productId },
		orderBy: { createdAt: "desc" }
	});
});

export const getProductsByCategory = cache(async (category?: string) => {
	return await prisma.product.findMany({
		select: productCardSelect,
		orderBy: { createdAt: "desc" },
		where: category ? { category: { slug: category } } : undefined
	});
});

export const getCartProducts = cache(async (variations: { variationId: string; quantity: number }[]): Promise<CartProduct[]> => {
	const products = await Promise.all(
		variations.map(({ variationId }) =>
			prisma.variation.findUnique({
				where: { id: variationId },
				select: {
					id: true,
					name: true,
					product: { select: { id: true, images: true, discountedPrice: true, originalPrice: true, title: true } }
				}
			})
		)
	);

	return products
		.filter((item) => item !== null)
		.map((product, index) => ({
			productId: product.product.id,
			title: product.product.title,
			image: product.product.images[0],
			quantity: variations[index].quantity,
			price: product.product.discountedPrice ?? product.product.originalPrice,
			totalPrice: (product.product.discountedPrice ?? product.product.originalPrice) * variations[index].quantity,
			variationId: product.id,
			variationName: product.name
		}));
});

export const getOrders = cache(async () => {
	return await prisma.order.findMany({
		orderBy: { status: "asc" },
		include: {
			items: { select: { product: { select: { images: true, title: true } }, variation: { select: { name: true, color: true } } } }
		}
	});
});
export type Order = Awaited<ReturnType<typeof getOrders>>[number];

export const getOrderDetails = cache(async (orderId: string) => {
	return await prisma.order.findUnique({
		where: { id: orderId },
		include: {
			items: { select: { product: { select: { images: true, title: true } }, variation: { select: { name: true, color: true } } } }
		}
	});
});
