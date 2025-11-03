import Image from "next/image";
import { notFound } from "next/navigation";

import { getOrderDetails } from "@/lib/dal";
import { Label } from "@/components/ui/label";

import { OrderStatus } from "./order-status";

export default async function OrderIdPage({ params }: PageProps<"/dashboard/orders/[orderId]">) {
	const { orderId } = await params;
	const order = await getOrderDetails(orderId);

	if (!order) {
		return notFound();
	}

	return (
		<div className="space-y-4 p-4 md:space-y-6 md:p-6">
			<div className="flex items-center justify-between gap-4">
				<h1 className="text-2xl/9 font-semibold">Order Details</h1>
			</div>
			<div className="flex flex-col gap-2 rounded-lg">
				{order.items.map(({ product, variation }) => (
					<div key={variation.name} className="flex items-start gap-4">
						<div className="size-20 overflow-hidden rounded-lg">
							<Image src={product.images[0]} alt="product" width={100} height={100} className="aspect-square size-full" />
						</div>
						<div>
							<p>{product.title}</p>
							<p className="text-muted-foreground capitalize">{variation.name}</p>
						</div>
					</div>
				))}
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Label>Name</Label>
					<div className="bg-muted flex h-9 w-full items-center rounded-md border px-4 py-3 text-sm">{order.name}</div>
				</div>
				<div className="space-y-2">
					<Label>Email</Label>
					<div className="bg-muted flex h-9 w-full items-center rounded-md border px-4 py-3 text-sm">{order.email}</div>
				</div>
				<div className="space-y-2">
					<Label>Phone No.</Label>
					<div className="bg-muted flex h-9 w-full items-center rounded-md border px-4 py-3 text-sm">0{order.phone}</div>
				</div>
				<div className="space-y-2">
					<Label>Amount</Label>
					<div className="bg-muted flex h-9 w-full items-center rounded-md border px-4 py-3 text-sm">Rs.{order.amount}</div>
				</div>
				<div className="space-y-2">
					<Label>Province</Label>
					<div className="bg-muted flex h-9 w-full items-center rounded-md border px-4 py-3 text-sm">{order.province}</div>
				</div>
				<div className="space-y-2">
					<Label>City</Label>
					<div className="bg-muted flex h-9 w-full items-center rounded-md border px-4 py-3 text-sm">{order.city}</div>
				</div>
				<div className="space-y-2">
					<Label>Address</Label>
					<div className="bg-muted flex h-9 w-full items-center rounded-md border px-4 py-3 text-sm">{order.address}</div>
				</div>
			</div>
			<OrderStatus status={order.status} orderId={order.id} />
		</div>
	);
}
