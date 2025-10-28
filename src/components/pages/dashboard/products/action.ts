"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { unstable_rethrow as rethrow } from "next/navigation";
import sharp from "sharp";

import { validateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

import { type ProductSchema } from "./schema";

export async function deleteProductAction(slug: string) {
	try {
		await validateUser();
		if (!slug) throw new Error("No product selected");
		await prisma.product.delete({ where: { slug } });
		revalidateTag("dashboard-products", "max");
		revalidatePath("/dashboard/products");
		return { error: null };
	} catch (error) {
		rethrow(error);
		console.error(error);
		return { error: "Something went wrong" };
	}
}

export async function addProductAction(data: ProductSchema) {
	try {
		await validateUser();

		const supabase = await createClient();

		const images = await Promise.all(
			data.images.map(async (file, index) => {
				const buffer = Buffer.from(await file.arrayBuffer());

				const webpBuffer = await sharp(buffer)
					.resize({ width: 1080, height: 1080, fit: "cover", position: "center" })
					.webp({ quality: 100 })
					.toBuffer();

				const webpArray = new Uint8Array(webpBuffer);
				const webpFileName = `${data.slug}/image-${index + 1}.webp`;
				const webpFile = new File([webpArray], webpFileName, { type: "image/webp" });

				const { error, data: uploadImage } = await supabase.storage.from("products").upload(webpFileName, webpFile, {
					contentType: "image/webp",
					upsert: true
				});

				if (error) throw new Error(error.message);

				return uploadImage.fullPath;
			})
		);

		await prisma.product.create({
			data: {
				images,
				slug: data.slug,
				title: data.title,
				categoryId: data.categoryId,
				originalPrice: data.originalPrice,
				discountedPrice: data.discountedPrice,
				longDescription: data.longDescription,
				shortDescription: data.shortDescription,
				variations: { createMany: { data: data.variations } }
			}
		});

		revalidateTag("dashboard-products", "max");
		revalidatePath("/dashboard/products");

		return { error: null };
	} catch (error) {
		rethrow(error);
		console.error(error);
		return { error: "Something went wrong" };
	}
}
