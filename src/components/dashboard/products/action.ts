"use server";

import { updateTag } from "next/cache";
import { unstable_rethrow as rethrow } from "next/navigation";
import { after } from "next/server";

import { deleteImage, deleteImagesByFileIds } from "@/lib/auth/image-kit";
import { getAdminSession } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { productSchema, type ProductSchema } from "@/components/dashboard/products/schema";

export async function upsertProductAction(data: ProductSchema, productId?: string) {
	try {
		const { error } = productSchema.safeParse(data);
		if (error) return { error: error.message };

		await getAdminSession();

		const { images, deletedImageFileIds, ...productFields } = data;

		if (!productId) {
			await db.product.create({
				data: {
					...productFields,
					description: productFields.description || null,
					discountPrice: productFields.discountPrice || null,
					images: {
						create: images.map((img, idx) => ({
							fileId: img.fileId || null,
							name: img.name,
							filePath: img.filePath || "",
							url: img.url || "",
							thumbnailUrl: img.thumbnailUrl || null,
							listingUrl: img.listingUrl || null,
							width: img.width || null,
							height: img.height || null,
							size: img.size || null,
							order: idx,
						})),
					},
				},
			});
		} else {
			await db.$transaction(async (tx) => {
				const keepImageIds = images.map((img) => img.id).filter(Boolean) as string[];
				await tx.productImage.deleteMany({
					where: {
						productId,
						id: { notIn: keepImageIds },
					},
				});

				for (let i = 0; i < images.length; i++) {
					const img = images[i];
					if (img.id) {
						await tx.productImage.update({
							where: { id: img.id },
							data: { order: i },
						});
					} else {
						await tx.productImage.create({
							data: {
								productId,
								fileId: img.fileId || null,
								name: img.name,
								filePath: img.filePath || "",
								url: img.url || "",
								thumbnailUrl: img.thumbnailUrl || null,
								listingUrl: img.listingUrl || null,
								width: img.width || null,
								height: img.height || null,
								size: img.size || null,
								order: i,
							},
						});
					}
				}

				await tx.product.update({
					where: { id: productId },
					data: {
						...productFields,
						description: productFields.description || null,
						discountPrice: productFields.discountPrice || null,
					},
				});
			});

			if (deletedImageFileIds && deletedImageFileIds.length > 0) {
				after(async () => {
					await deleteImagesByFileIds(deletedImageFileIds);
				});
			}

			updateTag(`dashboard-product-${productId}`);
		}

		updateTag("dashboard-products");

		if (data.status === "PUBLISHED") {
			updateTag("latest-products");
			updateTag("all-collection");
			const category = await db.category.findUnique({ where: { id: data.categoryId } });
			if (category?.slug) {
				updateTag(`${category.slug}-collection`);
			}
		}

		return { error: null };
	} catch (error) {
		rethrow(error);
		console.error("Error upserting product:", error);
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
			const product = await db.product.update({
				where: { id: productId },
				data: { status: "ARCHIVED" },
			});
			categoryId = product.categoryId;
		} else {
			const product = await db.product.findUnique({
				where: { id: productId },
				include: { images: true },
			});

			if (!product) return { error: "Product not found" };

			categoryId = product.categoryId;

			const fileIds = product.images.map((img) => img.fileId).filter(Boolean) as string[];
			const legacyImagesWithoutFileId = product.images.filter((img) => !img.fileId);

			await db.product.delete({ where: { id: productId } });

			after(async () => {
				if (fileIds.length > 0) {
					await deleteImagesByFileIds(fileIds);
				}
				for (const img of legacyImagesWithoutFileId) {
					await deleteImage(img.filePath, null);
				}
			});
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
		console.error("Error deleting product:", error);
		return { error: "Something went wrong" };
	}
}
