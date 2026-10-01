"use server";

import "server-only";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect, unstable_rethrow as rethrow } from "next/navigation";

import { getSession } from "@/lib/auth/server";
import { db } from "@/lib/db";
import { sendAdminOrderAlertEmail, sendOrderConfirmationEmail } from "@/lib/email";
import { getCart } from "@/components/cart/actions";
import { checkoutSchema, type CheckoutSchema } from "@/components/checkout/schema";

export async function checkoutAction(data: CheckoutSchema, cartId: string) {
	try {
		const { success } = checkoutSchema.safeParse(data);
		if (!success) return { error: "Please provide valid data" };

		const cart = await getCart(cartId);
		if (!cart || cart.items.length === 0) {
			return redirect("/");
		}

		const user = await getSession();

		const totalAmount = cart.items.reduce((acc, item) => acc + (item.product.discountPrice ?? item.product.salePrice) * item.quantity, 0);

		const order = await db.$transaction(async (tx) => {
			// 1. Verify stock for each cart item
			for (const item of cart.items) {
				const product = await tx.product.findUnique({
					where: { id: item.product.id },
					select: { stock: true, title: true, status: true },
				});

				if (!product || product.status !== "PUBLISHED") {
					throw new Error(`Product "${item.product.title}" is no longer available.`);
				}

				if (product.stock < item.quantity) {
					throw new Error(`Insufficient stock for "${item.product.title}". Only ${product.stock} left.`);
				}
			}

			// 2. Decrement stock for each item
			for (const item of cart.items) {
				await tx.product.update({
					where: { id: item.product.id },
					data: { stock: { decrement: item.quantity } },
				});
			}

			// 3. Create the order
			const createdOrder = await tx.order.create({
				data: {
					name: data.name,
					email: data.email,
					phone: data.phone.replace(/[\s-]/g, ""),
					address: data.address,
					city: data.city,
					postalCode: data.postalCode || null,
					province: data.province,
					country: data.country,
					paymentMethod: data.paymentMethod,
					total: totalAmount,
					userId: user?.user.id ?? null,
					items: {
						create: cart.items.map((item) => ({
							quantity: item.quantity,
							productId: item.product.id,
							price: item.product.discountPrice ?? item.product.salePrice,
						})),
					},
				},
				include: {
					items: {
						include: {
							product: true,
						},
					},
				},
			});

			// 4. Delete the cart
			await tx.cart.delete({
				where: { id: cartId },
			});

			return createdOrder;
		});

		const cookieStore = await cookies();
		cookieStore.delete("cartId");

		updateTag("orders");

		// Send Order Confirmation Email & Admin Alert (non-blocking)
		sendOrderConfirmationEmail({ order }).catch((err) => {
			console.error("[Email Error] Failed to send order confirmation email:", err);
		});

		sendAdminOrderAlertEmail({ order }).catch((err) => {
			console.error("[Email Error] Failed to send admin order alert email:", err);
		});

		return { error: null, orderId: order.id };
	} catch (error) {
		rethrow(error);
		console.error(error);
		return { error: error instanceof Error ? error.message : "Something went wrong" };
	}
}
