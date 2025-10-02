import { ProductForm } from "@/components/pages/dashboard/products/form";

export default function AddProductPage() {
	return (
		<div className="space-y-4 p-4 md:space-y-6 md:p-6">
			<h1 className="text-2xl/9 font-semibold">Add Product</h1>
			<ProductForm
				defaultValues={{
					title: "",
					slug: "",
					originalPrice: 0,
					shortDescription: "",
					longDescription: "",
					images: [],
					variations: [{ name: "", color: "#000000", stock: 0 }]
				}}
			/>
		</div>
	);
}
