"use server";

import { cache } from "react";

import { prisma } from "@/lib/db";

export const getCategories = cache(async () => {
	return await prisma.category.findMany({ orderBy: { name: "asc" } });
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
