import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";

import AdminOrderAlertEmail from "@emails/admin-order-alert";
import MagicLinkEmail from "@emails/magic-link";
import OrderCancellationEmail from "@emails/order-cancellation";
import OrderConfirmationEmail from "@emails/order-confirmation";
import OrderStatusEmail from "@emails/order-status";

const mockOrder = {
	id: "cm1234567890abcdef",
	name: "Ali Hamza",
	email: "customer@example.com",
	phone: "03001234567",
	address: "House 42, Street 7, Block B, DHA Phase 5",
	city: "Lahore",
	province: "Punjab",
	country: "Pakistan",
	postalCode: "54000",
	paymentMethod: "CASH_ON_DELIVERY" as const,
	total: 5499,
	createdAt: new Date(),
	items: [
		{
			id: "item_1",
			quantity: 1,
			price: 3499,
			product: {
				id: "prod_1",
				title: "Premium Minimalist Chrono Watch",
				images: [
					"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
				],
				slug: "premium-minimalist-chrono-watch",
			},
		},
		{
			id: "item_2",
			quantity: 2,
			price: 1000,
			product: {
				id: "prod_2",
				title: "Genuine Leather Card Holder",
				images: [
					"https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&q=80",
				],
				slug: "genuine-leather-card-holder",
			},
		},
	],
};

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const template = searchParams.get("template") || "order-confirmation";
	const status = searchParams.get("status") || "DELIVERED";

	let element: React.ReactElement;

	switch (template) {
		case "magic-link":
			element = MagicLinkEmail({
				url: "http://localhost:3000/api/auth/verify?token=example-token-123456",
				email: "customer@example.com",
			});
			break;

		case "order-confirmation":
			element = OrderConfirmationEmail({ order: mockOrder });
			break;

		case "order-status":
			element = OrderStatusEmail({ order: mockOrder, status });
			break;

		case "order-cancellation":
			element = OrderCancellationEmail({ order: mockOrder });
			break;

		case "admin-alert":
			element = AdminOrderAlertEmail({ order: mockOrder });
			break;

		default:
			return new NextResponse(
				`Unknown template "${template}". Available: magic-link, order-confirmation, order-status, order-cancellation, admin-alert`,
				{ status: 400 }
			);
	}

	const html = await render(element);

	return new NextResponse(html, {
		headers: {
			"Content-Type": "text/html; charset=utf-8",
		},
	});
}
