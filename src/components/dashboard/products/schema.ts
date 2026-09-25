import { z } from "zod";

export const productSchema = z
	.object({
		title: z.string().min(1, "Title is required"),
		slug: z.string().min(1, "Slug is required"),
		description: z.string(),
		stock: z.number().positive("Must be greater than 0"),
		costPrice: z.number().positive("Must be greater than 0"),
		salePrice: z.number().positive("Must be greater than 0"),
		discountPrice: z.number().optional(),
		images: z.array(z.string()).min(1, "Atleast one image is required").max(4, "Maximum limit is 4"),
		status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
		categoryId: z.string().min(1, "Please select category")
	})
	.refine(({ salePrice, discountPrice }) => (discountPrice ? salePrice > discountPrice : true), {
		message: "Discount Price must be less than Sale Price",
		path: ["discountPrice"]
	});

export type ProductSchema = z.infer<typeof productSchema>;
