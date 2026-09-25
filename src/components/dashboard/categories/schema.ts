import { z } from "zod";

export const categorySchema = z.object({
	name: z.string().min(1, "Name is required").trim(),
	slug: z.string().min(1, "Slug is required").trim(),
});

export type CategorySchema = z.infer<typeof categorySchema>;
