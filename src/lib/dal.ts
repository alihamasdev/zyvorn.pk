import { cache } from "react";

import { prisma } from "@/lib/db";

export const getCategories = cache(async () => {
	return await prisma.category.findMany({ orderBy: { name: "asc" } });
});
