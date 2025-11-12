"use server";

import z from "zod";

import { db } from "@/lib/db";

import { checkoutSchema } from "./schema";

export async function createOrder(data: z.infer<typeof checkoutSchema>) {
	const { success } = checkoutSchema.safeParse(data);
	if (!success) return { error: "Please provide correct data" };

	await db.order.create({
		data: {
			name: data.name,
			email: data.email,
			phone: data.phone,
			province: data.province,
			city: data.city,
			address: data.address,
			zipCode: Number(data.zipCode),
			amount: data.amount,
			items: {
				createMany: { data: data.products.map(({ productId, variationId }) => ({ productId, variationId })) }
			}
		}
	});

	return { errorr: null };
}
