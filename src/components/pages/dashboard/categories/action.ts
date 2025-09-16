"use server";

import { validateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

import { categoriesSchema, type CategoriesSchema } from "./schema";

export async function categoryUpsertAction({ name, slug, id }: CategoriesSchema) {
	const { success } = categoriesSchema.safeParse({ name, slug, id });
	if (!success) return { error: "Please provide valid data", data: null };

	await validateUser();

	if (id) {
		const data = await prisma.category.update({ where: { id }, data: { name, slug } });
		return { error: null, data };
	}

	const data = await prisma.category.create({ data: { name, slug } });
	return { error: null, data };
}

export async function deleteCategoryAction(id: number) {
	await validateUser();

	if (!id) return { error: "Provide id to delete category" };

	await prisma.category.delete({ where: { id } });

	return { error: null };
}
