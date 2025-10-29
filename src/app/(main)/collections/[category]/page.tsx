import { getProductsByCategory } from "@/lib/dal";
import { ProductCard } from "@/components/product/product-card";

export default async function CollectionsPage({ params }: PageProps<"/collections/[category]">) {
	"use cache";
	const { category } = await params;
	const products = await getProductsByCategory(category === "all" ? undefined : category);

	return (
		<section className="space-y-6">
			<h1 className="text-xl font-semibold capitalize">{category.split("-").join(" ")} Products</h1>
			<div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{products.map((product, index) => (
					<ProductCard key={product.id} index={index} data={product} />
				))}
			</div>
		</section>
	);
}
