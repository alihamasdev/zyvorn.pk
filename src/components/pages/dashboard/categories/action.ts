"use server";

import { revalidatePath } from "next/cache";

import { validateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

import { categoriesSchema, type CategoriesSchema } from "./schema";

export async function categoryUpsertAction({ name, slug, id }: CategoriesSchema) {
	try {
		const { success } = categoriesSchema.safeParse({ name, slug, id });
		if (!success) return { error: "Please provide valid data" };

		const user = await validateUser();
		if (!user) return { error: "User is not authorized to perform the action" };

		if (id) {
			await prisma.category.update({
				where: { id },
				data: { name, slug }
			});
		} else {
			await prisma.category.create({
				data: { name, slug }
			});
		}

		revalidatePath("/dashboard/categories", "page");

		return { error: null };
	} catch (error) {
		console.error(error);
		return { error: "Something went wrong while creating category" };
	}
}

export async function deleteCategoryAction(id: number) {
	try {
		const user = await validateUser();
		if (!user) return { error: "User is not authorized to perform the action" };

		if (!id) {
			return { error: "Provide id to delete category" };
		}

		await prisma.category.delete({ where: { id } });

		revalidatePath("/dashboard/categories", "page");

		return { error: null };
	} catch (error) {
		console.error(error);
		return { error: "Something went wrong while deleting category" };
	}
}
