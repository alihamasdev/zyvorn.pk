import { z } from "zod";

export const categoriesSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, "Category name is required").max(50, "Category name can only contain 50 letters"),
	slug: z.string().min(1, "Category slug is required").max(50, "Category slug can only contain 50 letters")
});

export type CategoriesSchema = z.infer<typeof categoriesSchema>;
