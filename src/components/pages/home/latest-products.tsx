import { unstable_cache as cache } from "next/cache";

import { axios } from "@/lib/axios";
import type { ProductCardPayload } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";

const getLatestProduct = cache(async () => {
	return await axios.get<ProductCardPayload[]>("/api/products/latest").then((res) => res.data);
});

export async function LatestProducts() {
	const data = await getLatestProduct();
	return data.map((product, index) => <ProductCard key={product.id} index={index} data={product} />);
}
