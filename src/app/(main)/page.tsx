import { Suspense } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ImageCarousel } from "@/components/pages/home/image-carousel";
import { LatestProducts } from "@/components/pages/home/latest-products";
import { ProductCardLoader } from "@/components/product/product-card";

const images = [
	{ src: "banner_1.webp", alt: "carousel image", width: 1248, height: 416 },
	{ src: "banner_2.webp", alt: "carousel image", width: 1248, height: 416 },
	{ src: "banner_3.webp", alt: "carousel image", width: 1248, height: 416 }
];

export default function HomePage() {
	return (
		<>
			<ImageCarousel images={images} />
			<section className="space-y-6">
				<h1 className="text-left text-xl font-semibold">Latest Products</h1>
				<div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					<Suspense fallback={<ProductCardLoader />}>
						<LatestProducts />
					</Suspense>
				</div>
				<div className="flex justify-center">
					<Button variant="outline" className="cursor-pointer" asChild>
						<Link href="/collections/all">Show More</Link>
					</Button>
				</div>
			</section>
		</>
	);
}
