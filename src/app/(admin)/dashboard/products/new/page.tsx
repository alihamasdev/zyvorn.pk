import { getCategories } from "@/lib/dal";
import { ProductForm } from "@/components/dashboard/products/form";

export default async function NewDashboardProductPage() {
	const categories = await getCategories();
	return (
		<ProductForm
			categories={categories}
			defaultValues={{
				title: "",
				slug: "",
				description: "",
				costPrice: 0,
				salePrice: 0,
				stock: 0,
				status: "PUBLISHED",
				categoryId: "",
				images: [],
			}}
		/>
	);
}
