"use server";

import { db } from "@/lib/db";
import type { OrderStatus } from "@/lib/prisma/enums";

export async function changeOrderStatus(status: OrderStatus, orderId: string) {
	await db.order.update({
		where: { id: orderId },
		data: { status }
	});
}
