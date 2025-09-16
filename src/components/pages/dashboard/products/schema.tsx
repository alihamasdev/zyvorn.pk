import { z } from "zod";

export const productSchema = z
	.object({
		title: z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less").trim(),
		slug: z.string().min(1, "Slug is required").trim(),
		category: z.number().min(1, "Category is required").max(100, "Category must be 100 characters or less"),
		originalPrice: z.number().positive("Original price must be a positive integer"),
		discountedPrice: z.number().nonnegative("Discounted price must be a positive integer").optional(),
		shortDescription: z.string().optional(),
		longDescription: z.string().optional(),
		images: z
			.array(z.file().max(5 * 1024 * 1024, "Max 5MB is allowed"))
			.min(1, "Product image is required")
			.max(4, "Maximum 4 images are required"),
		colorVariation: z
			.array(
				z.object({
					color: z.string().min(1, "Color is required").max(30, "Color can only contain 30 alphabets").trim(),
					stock: z.number().positive("Stock must be a positive integer")
				})
			)
			.refine(
				(options) => {
					const values = options.map((o) => o.color);
					return new Set(values).size === values.length;
				},
				{ message: "Variation option values must be unique", path: ["colorVariation"] }
			)
	})
	.refine(({ originalPrice, discountedPrice }) => (discountedPrice ? originalPrice > discountedPrice : true), {
		message: "Discounted Price must be less than Original Price",
		path: ["discountedPrice"]
	});

export type ProductSchema = z.infer<typeof productSchema>;
