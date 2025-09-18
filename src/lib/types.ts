import type { Product } from "@/lib/prisma/client";

export interface ProductPayload extends Product {
	category: { name: string; slug: string };
	variations: { name: string; color: string; stock: number }[];
}
