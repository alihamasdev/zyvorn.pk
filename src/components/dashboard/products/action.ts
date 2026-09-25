"use server";

import { updateTag } from "next/cache";
import { unstable_rethrow as rethrow } from "next/navigation";

import { getAdminSession } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { productSchema, type ProductSchema } from "@/components/dashboard/products/schema";

export async function upsertProductAction(data: ProductSchema, productId?: string) {
	try {
		const { error } = productSchema.safeParse(data);
		if (error) return { error: error.message };

		await getAdminSession();

		if (!productId) {
			await db.product.create({
				data: { ...data, description: data.description || null, discountPrice: data.discountPrice || null },
			});
		} else {
			await db.product.update({
				where: { id: productId },
				data: { ...data, description: data.description || null, discountPrice: data.discountPrice || null },
			});
			updateTag(`dashboard-product-${productId}`);
		}

		updateTag("dashboard-products");

		if (data.status === "PUBLISHED") {
			updateTag("latest-products");
			updateTag("all-collection");
			const category = await db.category.findUnique({ where: { id: data.categoryId } });
			updateTag(`${category?.slug}-collection`);
		}

		return { error: null };
	} catch (error) {
		rethrow(error);
		console.error(error);
		return { error: "Something went wrong" };
	}
}

export const upserProductAction = upsertProductAction;

export async function deleteProductAction(productId: string) {
	try {
		await getAdminSession();

		const orderItemsCount = await db.orderItem.count({ where: { productId } });
		let categoryId: string;
		if (orderItemsCount > 0) {
			// Cannot hard delete an ordered product; archive it instead to preserve sales history
			const product = await db.product.update({
				where: { id: productId },
				data: { status: "ARCHIVED" },
			});
			categoryId = product.categoryId;
		} else {
			const product = await db.product.delete({ where: { id: productId } });
			categoryId = product.categoryId;
		}

		updateTag("dashboard-products");
		updateTag("latest-products");
		updateTag("all-collection");
		const category = await db.category.findUnique({ where: { id: categoryId } });
		if (category?.slug) {
			updateTag(`${category.slug}-collection`);
		}

		return { error: null };
	} catch (error) {
		rethrow(error);
		console.error(error);
		return { error: "Something went wrong" };
	}
}
