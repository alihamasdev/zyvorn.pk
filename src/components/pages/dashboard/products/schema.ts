import { z } from "zod";

export const productSchema = z
	.object({
		title: z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less").trim(),
		slug: z.string().min(1, "Slug is required").trim(),
		categoryId: z.string("Please select category"),
		originalPrice: z.number().positive("Original price must be a positive integer"),
		discountedPrice: z.number().nonnegative("Discounted price must be a positive integer").optional(),
		shortDescription: z.string().optional(),
		longDescription: z.string().optional(),
		images: z
			.array(z.file().max(5 * 1024 * 1024, "Max 5MB is allowed"))
			.min(1, "Product image is required")
			.max(4, "Maximum 4 images are allowed"),
		variations: z
			.array(
				z.object({
					name: z
						.string()
						.min(1, "Name is required")
						.max(30, "Color can only contain 30 alphabets")
						.transform((val) => val.toLowerCase()),
					color: z.string().min(1, "Color is required").trim(),
					stock: z.number().positive("Stock must be a positive integer")
				})
			)
			.min(1, "Atleast one variation is required")
			.refine(
				(options) => {
					const values = options.map((o) => o.name);
					return new Set(values).size === values.length;
				},
				{ message: "Variation names must be unique", path: ["root"] }
			)
	})
	.refine(({ originalPrice, discountedPrice }) => (discountedPrice ? originalPrice > discountedPrice : true), {
		message: "Discounted Price must be less than Original Price",
		path: ["discountedPrice"]
	});

export type ProductSchema = z.infer<typeof productSchema>;
