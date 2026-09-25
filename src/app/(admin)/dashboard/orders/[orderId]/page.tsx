import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";

import { getOrderById } from "@/lib/dal";
import { ORDER_STATUS } from "@/lib/prisma/enums";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { OrderDetails } from "@/components/dashboard/orders/order-details";
import { PrintOrder } from "@/components/dashboard/orders/print-order";
import { ProductImage } from "@/components/product/product-image";

export default async function DashboardOrderByIdPage({ params }: { params: Promise<{ orderId: string }> }) {
	const { orderId } = await params;
	const order = await getOrderById(orderId);

	if (!order) return notFound();

	const digitsOnly = order.phone.replace(/\D/g, "");
	const sanitizedPhone = digitsOnly.startsWith("0")
		? `92${digitsOnly.slice(1)}`
		: digitsOnly.startsWith("92")
			? digitsOnly
			: `92${digitsOnly}`;
	const whatsappUrl = `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(
		`Hello ${order.name}, regarding your Zyvorn Order #${orderId.toUpperCase()}:`,
	)}`;

	const customerDetails = [
		{
			label: "Name",
			value: order.name,
		},
		{
			label: "Phone",
			value: order.phone,
		},
		{
			label: "Email",
			value: order.email,
		},
	];

	const shippingDetails = [
		{
			label: "Address",
			value: order.address,
		},
		{
			label: "City",
			value: order.city,
		},
		{
			label: "Province",
			value: order.province,
		},
		{
			label: "Country",
			value: order.country,
		},
	];

	return (
		<div className="grid gap-4 text-sm md:grid-cols-2 md:gap-6">
			<div className="flex items-center justify-between md:col-span-2">
				<h1 className="text-xl/9 font-semibold">Order Details</h1>
				<PrintOrder orderId={orderId} order={order} />
			</div>

			<FloatingLabelInput placeholder="Order ID" value={orderId.toUpperCase()} readOnly />
			<OrderDetails orderId={orderId} status={order.status} statusList={Object.keys(ORDER_STATUS)} />

			<Card>
				<CardHeader>
					<CardTitle className="text-base font-semibold">Customer Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{customerDetails.map((detail) => (
						<div key={detail.label} className="flex items-center justify-between gap-x-6">
							<span className="text-muted-foreground">{detail.label}:</span>
							{detail.label === "Phone" ? (
								<div className="flex items-center gap-1.5">
									<span className="text-right">{detail.value}</span>
									<Button
										asChild
										variant="ghost"
										size="icon-sm"
										className="size-6 text-[#25D366] hover:bg-emerald-50 hover:text-[#20ba5a] dark:hover:bg-emerald-950/40"
										title="Chat on WhatsApp"
									>
										<a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
											<MessageCircle className="size-3.5" />
										</a>
									</Button>
								</div>
							) : (
								<span className="text-right">{detail.value}</span>
							)}
						</div>
					))}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base font-semibold">Shipping Details</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{shippingDetails.map((detail) => (
						<div key={detail.label} className="flex justify-between gap-x-6">
							<span className="text-muted-foreground">{detail.label}:</span>
							<span className="text-right">{detail.value}</span>
						</div>
					))}
				</CardContent>
			</Card>

			<Card className="md:col-span-2">
				<CardHeader>
					<CardTitle className="text-base font-semibold">Order Items</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{order.items.map((item) => (
						<Item key={item.id} className="p-0">
							<ItemMedia variant="image" className="size-18">
								<ProductImage src={item.product.images?.[0] ?? ""} alt={item.product.title} size={72} transformation="thumbnail" />
							</ItemMedia>
							<ItemContent>
								<ItemTitle className="line-clamp-2">{item.product.title}</ItemTitle>
								<ItemDescription>Quantity: {item.quantity}</ItemDescription>
							</ItemContent>
							<ItemTitle>Rs.{item.price * item.quantity}</ItemTitle>
						</Item>
					))}
				</CardContent>
				<CardFooter className="flex-col gap-2 font-medium">
					<Separator className="mb-2" />
					<div className="flex w-full items-center justify-between">
						<span>Total</span>
						<span>Rs.{order.total.toLocaleString()}</span>
					</div>
					<div className="flex w-full items-center justify-between">
						<span>Payment Method</span>
						<span className="capitalize">{order.paymentMethod.replace(/_/g, " ").toLowerCase()}</span>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
