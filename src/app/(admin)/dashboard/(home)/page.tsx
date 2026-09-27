import { BadgeCentIcon, ShoppingBagIcon, ShoppingCartIcon, TrendingUpIcon } from "lucide-react";

import { getDashboardStats } from "@/lib/dal";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardHomePage() {
	const stats = await getDashboardStats();

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Inventory Cost</CardTitle>
					<ShoppingBagIcon className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">PKR {formatPrice(stats.totalInventory)}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
					<BadgeCentIcon className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">PKR {formatPrice(stats.totalRevenue)}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Profit</CardTitle>
					<TrendingUpIcon className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">PKR {formatPrice(stats.totalProfit)}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
					<ShoppingCartIcon className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.ordersCount}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Cancelled Orders</CardTitle>
					<ShoppingCartIcon className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.cancelledOrdersCount}</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Published Products</CardTitle>
					<ShoppingCartIcon className="text-muted-foreground size-4" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{stats.productsCount}</div>
				</CardContent>
			</Card>
		</div>
	);
}
