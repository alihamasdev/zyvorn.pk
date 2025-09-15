"use server";

import { validateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function deleteProductAction(id: number) {
	await validateUser();

	if (!id) return { error: "No product selected" };

	await prisma.product.delete({ where: { id } });

	return { error: null };
}
