import AdminOrderAlertEmail from "@emails/admin-order-alert";
import MagicLinkEmail from "@emails/magic-link";
import OrderCancellationEmail, { type OrderCancellationEmailProps } from "@emails/order-cancellation";
import OrderConfirmationEmail, { type OrderConfirmationEmailProps } from "@emails/order-confirmation";
import OrderStatusEmail, { type OrderStatusEmailProps } from "@emails/order-status";
import { render } from "@react-email/components";
import { Resend } from "resend";

import { config } from "@/lib/config";
import { type ORDER_STATUS } from "@/lib/prisma/enums";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailDomain = process.env.EMAIL_DOMAIN || config.domain;

const adminEmail = process.env.ADMIN_EMAIL || `admin@${emailDomain}`;

const getEmailFrom = (isOrder: boolean = true) => {
	return `${config.name} <${isOrder ? "orders" : "auth"}@${emailDomain}>`;
};

/**
 * Send Magic Link Sign-In Email (Authentication)
 */
export async function sendMagicLinkEmail({ to, url }: { to: string; url: string }) {
	const reactElement = MagicLinkEmail({ url, email: to });
	const text = await render(reactElement, { plainText: true });

	return await resend.emails.send({
		from: getEmailFrom(false),
		to: [to],
		subject: "Sign in to Three",
		react: reactElement,
		text,
	});
}

/**
 * Send Order Confirmation Receipt to Customer
 */
export async function sendOrderConfirmationEmail({ order }: OrderConfirmationEmailProps) {
	if (!order) return;

	const orderNumber = order.id.slice(-8).toUpperCase();
	const reactElement = OrderConfirmationEmail({ order });
	const text = await render(reactElement, { plainText: true });

	return await resend.emails.send({
		from: getEmailFrom(true),
		to: [order.email],
		subject: `Order Confirmed #${orderNumber} - Three`,
		react: reactElement,
		text,
	});
}

/**
 * Send Dedicated Order Cancellation Email to Customer
 */
export async function sendOrderCancellationEmail({ order }: OrderCancellationEmailProps) {
	if (!order) return;

	const orderNumber = order.id.slice(-8).toUpperCase();
	const reactElement = OrderCancellationEmail({ order });
	const text = await render(reactElement, { plainText: true });

	return await resend.emails.send({
		from: getEmailFrom(true),
		to: [order.email],
		subject: `Order #${orderNumber} Cancelled - Three`,
		react: reactElement,
		text,
	});
}

/**
 * Send Order Status Update Email to Customer (PROCESSING, SHIPPED, DELIVERED, CANCELLED)
 */
export async function sendOrderStatusUpdateEmail({
	order,
	status,
}: {
	order: OrderStatusEmailProps["order"];
	status: ORDER_STATUS | string;
}) {
	if (!order) return;

	// If cancelled, route directly to dedicated order cancellation email
	if (status === "CANCELLED") {
		return await sendOrderCancellationEmail({ order });
	}

	const orderNumber = order.id.slice(-8).toUpperCase();
	let subject = `Update on Order #${orderNumber} - Three`;

	if (status === "SHIPPED") {
		subject = `Your Three Order #${orderNumber} is on the way`;
	} else if (status === "DELIVERED") {
		subject = `Your Three Order #${orderNumber} has been delivered`;
	}

	const reactElement = OrderStatusEmail({ order, status });
	const text = await render(reactElement, { plainText: true });

	return await resend.emails.send({
		from: getEmailFrom(true),
		to: [order.email],
		subject,
		react: reactElement,
		text,
	});
}

/**
 * Send New Order Notification to Store Admin/Owner
 */
export async function sendAdminOrderAlertEmail({ order }: OrderConfirmationEmailProps) {
	if (!order || !adminEmail) return;

	const orderNumber = order.id.slice(-8).toUpperCase();
	const reactElement = AdminOrderAlertEmail({ order });
	const text = await render(reactElement, { plainText: true });

	return await resend.emails.send({
		from: getEmailFrom(true),
		to: [adminEmail],
		subject: `New Order #${orderNumber} (Rs. ${order.total}) - ${order.name}`,
		react: reactElement,
		text,
	});
}
