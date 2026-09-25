"use cache";

import "server-only";

import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";

export const getCategories = cache(async () => {
	cacheLife("days");
	cacheTag("categories");
	return await db.category.findMany();
});

export const getCategoryBySlug = cache(async (slug: string) => {
	cacheLife("days");
	cacheTag(`${slug}-category`);
	return await db.category.findUnique({ where: { slug } });
});

export const getLatestProducts = cache(async () => {
	cacheLife("days");
	cacheTag("latest-products");
	return await db.product.findMany({
		take: 10,
		omit: { costPrice: true },
		where: { status: "PUBLISHED" },
		orderBy: { createdAt: "desc" },
	});
});

export const getCollectionProducts = cache(async (slug: string) => {
	cacheLife("days");
	cacheTag(`${slug}-collection`);

	if (slug === "all") {
		return await db.product.findMany({
			omit: { costPrice: true },
			orderBy: { createdAt: "desc" },
			where: { status: "PUBLISHED" },
		});
	}

	const category = await getCategoryBySlug(slug);
	if (!category) return notFound();

	return await db.product.findMany({
		omit: { costPrice: true },
		orderBy: { createdAt: "desc" },
		where: { status: "PUBLISHED", categoryId: category.id },
	});
});

export const getProductBySlug = cache(async (slug: string) => {
	cacheLife("days");
	cacheTag(`${slug}-product`);
	return await db.product.findUnique({ where: { slug, status: "PUBLISHED" }, omit: { costPrice: true } });
});

export const getCategoryProducts = cache(async (categoryId: string, productId: string) => {
	cacheLife("days");
	cacheTag(`${categoryId}-category-products`);
	return await db.product.findMany({
		take: 4,
		omit: { costPrice: true },
		where: { categoryId, status: "PUBLISHED", id: { not: productId } },
	});
});

export const getOrders = cache(async () => {
	cacheLife("days");
	cacheTag("orders");
	return await db.order.findMany({
		orderBy: { createdAt: "desc" },
		include: { items: { select: { product: { select: { images: true, title: true } } } } },
	});
});

export const getOrderById = cache(async (id: string) => {
	cacheLife("days");
	cacheTag(`order-${id}`);
	return await db.order.findUnique({
		where: { id },
		include: {
			items: { include: { product: true } },
		},
	});
});

export async function getDashboardProducts() {
	return await db.product.findMany({
		orderBy: { createdAt: "desc" },
		include: {
			category: { select: { name: true } },
		},
	});
}
