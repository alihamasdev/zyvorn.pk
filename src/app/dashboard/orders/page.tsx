import { cacheTag } from "next/cache";

import { getOrders } from "@/lib/dal";
import { OrdersTable } from "@/components/pages/dashboard/orders/table";

export default async function OrdersPage() {
	"use cache";
	cacheTag("dashboard-orders");
	const orders = await getOrders();
	return (
		<div className="space-y-4 p-4 md:space-y-6 md:p-6">
			<div className="flex items-center justify-between gap-4">
				<h1 className="text-2xl/9 font-semibold">Orders</h1>
			</div>
			<OrdersTable data={orders} />
		</div>
	);
}
