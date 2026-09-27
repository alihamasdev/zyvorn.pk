import { getLatestProducts } from "@/lib/dal";
import { LinkButton } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";

import { ImageCarousel } from "./image-carousel";

async function LatestProducts() {
	const products = await getLatestProducts();
	return products.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />);
}

export default function StoreHomePage() {
	return (
		<div className="container mx-auto flex flex-col gap-4 px-4">
			<ImageCarousel className="space-y-4" />
			<section className="space-y-6">
				<h1 className="text-left text-2xl font-semibold">Latest Products</h1>
				<div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
					<LatestProducts />
				</div>
				<div className="flex justify-center">
					<LinkButton href="/collections/all" variant="outline" className="rounded-full">
						Show More
					</LinkButton>
				</div>
			</section>
		</div>
	);
}
