"use client";

import { PrinterIcon } from "lucide-react";

import type { Order, OrderItem } from "@/lib/prisma/browser";
import { Button } from "@/components/ui/button";

interface PrintOrderProps {
	orderId: string;
	order: Order & {
		items: Array<OrderItem & { product: { title: string } }>;
	};
}

export function PrintOrder({ orderId, order }: PrintOrderProps) {
	const handlePrint = () => {
		window.print();
	};

	return (
		<>
			<Button variant="outline" onClick={handlePrint} className="print:hidden">
				<PrinterIcon />
				Print
			</Button>

			<div className="hidden print:fixed print:inset-0 print:z-50 print:block print:bg-white print:p-8">
				<PrintOrderContent orderId={orderId} order={order} />
			</div>
		</>
	);
}

function PrintOrderContent({ orderId, order }: PrintOrderProps) {
	return (
		<div className="w-full bg-white p-8" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
			{/* Header */}
			<div className="mb-8 border-b-2 border-gray-300 pb-6">
				<h1 className="text-3xl font-bold text-gray-900">ORDER RECEIPT</h1>
				<p className="mt-2 text-lg font-semibold text-gray-700">Order ID: {orderId.toUpperCase()}</p>
				<p className="mt-1 text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
			</div>

			<div className="mb-8 grid grid-cols-2 gap-8">
				{/* Customer Details */}
				<div>
					<h2 className="mb-4 text-lg font-bold text-gray-900">Customer Details</h2>
					<div className="space-y-2 text-sm">
						<p>
							<span className="font-semibold text-gray-700">Name:</span> <span className="text-gray-600">{order.name}</span>
						</p>
						<p>
							<span className="font-semibold text-gray-700">Email:</span> <span className="text-gray-600">{order.email}</span>
						</p>
						<p>
							<span className="font-semibold text-gray-700">Phone:</span> <span className="text-gray-600">{order.phone}</span>
						</p>
					</div>
				</div>

				{/* Shipping Details */}
				<div>
					<h2 className="mb-4 text-lg font-bold text-gray-900">Shipping Address</h2>
					<div className="space-y-2 text-sm">
						<p className="text-gray-600">{order.address}</p>
						<p className="text-gray-600">
							{order.city}, {order.province}
						</p>
						<p className="text-gray-600">{order.country}</p>
					</div>
				</div>
			</div>

			{/* Order Items */}
			<div className="mb-8">
				<h2 className="mb-4 text-lg font-bold text-gray-900">Order Items</h2>
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b-2 border-gray-300">
							<th className="px-2 py-2 text-left font-semibold text-gray-700">Product</th>
							<th className="px-2 py-2 text-center font-semibold text-gray-700">Quantity</th>
							<th className="px-2 py-2 text-right font-semibold text-gray-700">Unit Price</th>
							<th className="px-2 py-2 text-right font-semibold text-gray-700">Total</th>
						</tr>
					</thead>
					<tbody>
						{order.items.map((item) => (
							<tr key={item.id} className="border-b border-gray-200">
								<td className="px-2 py-3 text-gray-700">{item.product.title}</td>
								<td className="px-2 py-3 text-center text-gray-700">{item.quantity}</td>
								<td className="px-2 py-3 text-right text-gray-700">Rs.{item.price.toLocaleString()}</td>
								<td className="px-2 py-3 text-right font-semibold text-gray-700">Rs.{(item.price * item.quantity).toLocaleString()}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Order Summary */}
			<div className="mb-8 border-t-2 border-gray-300 pt-4">
				<div className="mb-4 flex justify-end">
					<div className="w-64">
						<div className="flex justify-between rounded bg-gray-100 px-4 py-2">
							<span className="font-semibold text-gray-900">Total Amount:</span>
							<span className="font-bold text-gray-900">Rs.{order.total.toLocaleString()}</span>
						</div>
					</div>
				</div>

				<div className="mt-6 grid grid-cols-2 gap-8">
					<div>
						<p className="text-sm text-gray-600">
							<span className="font-semibold text-gray-700">Payment Method:</span>
						</p>
						<p className="mt-1 font-semibold text-gray-700 capitalize">{order.paymentMethod.replace(/_/g, " ").toLowerCase()}</p>
					</div>
					<div>
						<p className="text-sm text-gray-600">
							<span className="font-semibold text-gray-700">Order Status:</span>
						</p>
						<p className="mt-1 font-semibold text-gray-700 capitalize">{order.status}</p>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="mt-12 border-t border-gray-300 pt-6 text-center text-xs text-gray-500">
				<p>Thank you for your order!</p>
				<p>This is an automated receipt. Please keep it for your records.</p>
			</div>
		</div>
	);
}
