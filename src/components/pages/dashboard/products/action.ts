"use server";

import sharp from "sharp";

import { validateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

import { productSchema, type ProductSchema } from "./schema";

export async function deleteProductAction(slug: string) {
	await validateUser();

	if (!slug) return { error: "No product selected" };

	const supabase = await createClient();
	await Promise.all([prisma.product.delete({ where: { slug } }), supabase.storage.from("products").remove([slug])]);

	return { error: null };
}

export async function addProductAction(values: ProductSchema) {
	const { success, data } = productSchema.safeParse(values);
	if (!success) return { error: "Please provide correct data" };

	await validateUser();

	const supabase = await createClient();
	try {
		const images = await Promise.all(
			data.images.map(async (file, index) => {
				const buffer = Buffer.from(await file.arrayBuffer());

				const webpBuffer = await sharp(buffer)
					.resize({ width: 1080, height: 1080, fit: "cover", position: "center" })
					.webp({ quality: 100 })
					.toBuffer();

				const webpArray = new Uint8Array(webpBuffer);
				const webpFileName = `${data.slug}/image-${index}.webp`;
				const webpFile = new File([webpArray], webpFileName, { type: "image/webp" });

				const { error, data: uploadImage } = await supabase.storage.from("products").upload(webpFileName, webpFile, {
					contentType: "image/webp",
					upsert: true
				});

				if (error) {
					console.log(error);
					throw new Error(error.message);
				}

				return uploadImage.fullPath;
			})
		);

		const { title, slug, originalPrice, discountedPrice, category, colorVariation } = data;

		const newProduct = await prisma.product.create({
			data: {
				title,
				slug,
				originalPrice,
				discountedPrice,
				images,
				categoryId: category,
				colorOptions: { createMany: { data: colorVariation } }
			}
		});

		return { error: null, data: newProduct };
	} catch (error) {
		console.error(error);
		return { error: "Something went wrong, please try again" };
	}
}
