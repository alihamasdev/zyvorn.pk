import { getDashboardProducts } from "@/lib/dal";
import { dashboardProductsColumn as columns } from "@/components/dashboard/products/columns";
import { DashboardProductsTable } from "@/components/dashboard/products/table";

export default async function DashboardProductsPage() {
	const data = await getDashboardProducts();
	return <DashboardProductsTable columns={columns} data={data} />;
}
