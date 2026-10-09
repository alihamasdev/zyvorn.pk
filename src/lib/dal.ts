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
		include: { images: { orderBy: { order: "asc" } } },
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
			include: { images: { orderBy: { order: "asc" } } },
		});
	}

	const category = await getCategoryBySlug(slug);
	if (!category) return notFound();

	return await db.product.findMany({
		omit: { costPrice: true },
		orderBy: { createdAt: "desc" },
		where: { status: "PUBLISHED", categoryId: category.id },
		include: { images: { orderBy: { order: "asc" } } },
	});
});

export const getProductBySlug = cache(async (slug: string) => {
	cacheLife("days");
	cacheTag(`${slug}-product`);
	return await db.product.findUnique({
		where: { slug, status: "PUBLISHED" },
		omit: { costPrice: true },
		include: { images: { orderBy: { order: "asc" } } },
	});
});

export const getCategoryProducts = cache(async (categoryId: string, productId: string) => {
	cacheLife("days");
	cacheTag(`${categoryId}-category-products`);
	return await db.product.findMany({
		take: 4,
		omit: { costPrice: true },
		where: { categoryId, status: "PUBLISHED", id: { not: productId } },
		include: { images: { orderBy: { order: "asc" } } },
	});
});

export const getOrders = cache(async () => {
	cacheLife("days");
	cacheTag("orders");
	return await db.order.findMany({
		orderBy: { createdAt: "desc" },
		include: {
			items: {
				select: {
					product: {
						select: {
							images: { orderBy: { order: "asc" } },
							title: true,
						},
					},
				},
			},
		},
	});
});

export const getOrderById = cache(async (id: string) => {
	cacheLife("days");
	cacheTag(`order-${id}`);
	return await db.order.findUnique({
		where: { id },
		include: {
			items: {
				include: {
					product: {
						include: {
							images: { orderBy: { order: "asc" } },
						},
					},
				},
			},
		},
	});
});

export const getDashboardProducts = cache(async () => {
	cacheLife("days");
	cacheTag("dashboard-products");
	return await db.product.findMany({
		orderBy: { createdAt: "desc" },
		include: {
			category: { select: { name: true } },
			images: { orderBy: { order: "asc" } },
		},
	});
});

export const getDashboardStats = cache(async () => {
	cacheLife("hours");
	cacheTag("dashboard-stats");
	const [ordersCount, cancelledOrdersCount, productsCount, totalRevenue, products, totalProfit] = await Promise.all([
		db.order.count(),
		db.order.count({ where: { status: "CANCELLED" } }),
		db.product.count({ where: { status: "PUBLISHED" } }),
		db.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
		db.product.findMany({
			where: { status: "PUBLISHED" },
			select: { costPrice: true, stock: true },
		}),
		db.orderItem.findMany({
			where: { order: { NOT: { status: "CANCELLED" } } },
			select: { price: true, quantity: true, product: { select: { costPrice: true } } },
		}),
	]);

	const totalInventory = products.reduce((acc, p) => acc + p.costPrice * p.stock, 0);

	return {
		ordersCount,
		cancelledOrdersCount,
		productsCount,
		totalRevenue: totalRevenue._sum.total ?? 0,
		totalInventory,
		totalProfit: totalProfit.reduce((acc, item) => acc + item.price * item.quantity - item.product.costPrice * item.quantity, 0) ?? 0,
	};
});
