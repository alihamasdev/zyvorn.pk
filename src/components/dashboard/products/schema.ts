import { z } from "zod";

export const productImageSchema = z.object({
	id: z.string().optional(),
	fileId: z.string().nullable().optional(),
	file: z.any().optional(),
	previewUrl: z.string().optional(),
	name: z.string(),
	filePath: z.string().optional(),
	url: z.string().optional(),
	thumbnailUrl: z.string().nullable().optional(),
	listingUrl: z.string().nullable().optional(),
	width: z.number().nullable().optional(),
	height: z.number().nullable().optional(),
	size: z.number().nullable().optional(),
	order: z.number().optional(),
});

export type ProductImageSchema = z.infer<typeof productImageSchema>;

export const productSchema = z
	.object({
		title: z.string().min(1, "Title is required"),
		slug: z.string().min(1, "Slug is required"),
		description: z.string(),
		stock: z.number().positive("Must be greater than 0"),
		costPrice: z.number().positive("Must be greater than 0"),
		salePrice: z.number().positive("Must be greater than 0"),
		discountPrice: z.number().optional(),
		images: z.array(productImageSchema).min(1, "Atleast one image is required").max(4, "Maximum limit is 4"),
		status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
		categoryId: z.string().min(1, "Please select category"),
		deletedImageFileIds: z.array(z.string()).optional(),
	})
	.refine(({ salePrice, discountPrice }) => (discountPrice ? salePrice > discountPrice : true), {
		message: "Discount Price must be less than Sale Price",
		path: ["discountPrice"],
	});

export type ProductSchema = z.infer<typeof productSchema>;
