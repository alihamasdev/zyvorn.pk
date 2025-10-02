"use server";

import { validateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

import { categoriesSchema, type CategoriesSchema } from "./schema";

export async function categoryUpsertAction({ id, name, slug }: CategoriesSchema) {
	const { success } = categoriesSchema.safeParse({ name, slug, id });
	if (!success) throw new Error("Please provide valid data");

	await validateUser();

	if (id) {
		return await prisma.category.update({ where: { id }, data: { name, slug } });
	}

	return await prisma.category.create({ data: { name, slug } });
}

export async function deleteCategoryAction(id: number) {
	await validateUser();
	if (!id) throw new Error("Please select category to delete");
	await prisma.category.delete({ where: { id } });
}
