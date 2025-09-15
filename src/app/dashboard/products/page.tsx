import { getProducts } from "@/lib/dal";
import { DataTable } from "@/components/pages/dashboard/products/data-table";

export default function ProductsPage() {
	const dataPromise = getProducts();
	return <DataTable dataPromise={dataPromise} />;
}
