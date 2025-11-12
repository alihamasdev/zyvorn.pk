"use server";

import { validateUser } from "@/lib/auth";
import { db } from "@/lib/db";

import { categoriesSchema, type CategoriesSchema } from "./schema";

export async function categoryUpsertAction({ id, name, slug }: CategoriesSchema) {
	const { success } = categoriesSchema.safeParse({ name, slug, id });
	if (!success) throw new Error("Please provide valid data");

	await validateUser();

	if (id) {
		return await db.category.update({ where: { id }, data: { name, slug } });
	}

	return await db.category.create({ data: { name, slug } });
}

export async function deleteCategoryAction(id: string) {
	await validateUser();
	if (!id) throw new Error("Please select category to delete");
	await db.category.delete({ where: { id } });
}
