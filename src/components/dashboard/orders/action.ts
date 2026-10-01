"use server";

import { refresh, updateTag } from "next/cache";

import { getAdminSession } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { sendOrderStatusUpdateEmail } from "@/lib/email";
import { type ORDER_STATUS } from "@/lib/prisma/enums";

export async function updateOrderStatusAction(orderId: string, status: ORDER_STATUS) {
	try {
		await getAdminSession();

		const updatedOrder = await db.order.update({
			where: { id: orderId },
			data: { status },
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});

		updateTag("orders");
		updateTag(`order-${orderId}`);
		refresh();

		// Send order status update email to customer (non-blocking)
		if (updatedOrder.email) {
			sendOrderStatusUpdateEmail({ order: updatedOrder, status }).catch((err) => {
				console.error("[Email Error] Failed to send order status update email:", err);
			});
		}

		return { error: null };
	} catch (error) {
		return { error: "Something went wrong, please try again" };
	}
}
