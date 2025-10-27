import { cacheTag } from "next/cache";

import { getDashboardProducts } from "@/lib/dal";
import { DataTable } from "@/components/pages/dashboard/products/data-table";

export default async function ProductsPage() {
	"use cache";
	cacheTag("dashboard-products");
	const products = await getDashboardProducts();
	return <DataTable data={products} />;
}
