import { getCategories, getCollectionProducts } from "@/lib/dal";
import { ProductCard } from "@/components/product/product-card";

export async function generateStaticParams() {
	const categories = await getCategories();
	return [{ slug: "all" }, ...categories.map((c) => ({ slug: c.slug }))];
}

export default async function StoreCollectionsPage({ params }: PageProps<"/collections/[slug]">) {
	const { slug } = await params;
	const products = await getCollectionProducts(slug);

	return products.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />);
}
