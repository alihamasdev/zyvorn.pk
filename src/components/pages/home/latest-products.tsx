"use cache";

import { getLimitedProducts } from "@/lib/dal";
import { ProductCard } from "@/components/product/product-card";

export async function LatestProducts() {
	const data = await getLimitedProducts(10);
	return data.map((product, index) => <ProductCard key={product.id} index={index} data={product} />);
}
