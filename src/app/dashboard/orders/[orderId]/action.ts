"use server";

import { prisma } from "@/lib/db";
import type { OrderStatus } from "@/lib/prisma/enums";

export async function changeOrderStatus(status: OrderStatus, orderId: string) {
	await prisma.order.update({
		where: { id: orderId },
		data: { status }
	});
}
