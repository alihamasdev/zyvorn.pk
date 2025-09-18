"use server";

import sharp from "sharp";

import { validateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

import { productSchema, type ProductSchema } from "./schema";

export async function deleteProductAction(slug: string) {
	await validateUser();
	if (!slug) throw new Error("No product selected");
	await prisma.product.delete({ where: { slug } });
}

export async function addProductAction(values: ProductSchema) {
	const { success, data } = productSchema.safeParse(values);
	if (!success) throw new Error("Please provide valid data");

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

	const payload = { ...data, images, variations: { createMany: { data: data.variations } } };

	const newProduct = await prisma.product.create({ data: payload });

	return await prisma.product.findUniqueOrThrow({
		where: { id: newProduct.id },
		include: {
			category: { select: { name: true, slug: true } },
			variations: { select: { name: true, color: true, stock: true } }
		}
	});
}
