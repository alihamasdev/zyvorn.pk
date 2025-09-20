import { ImageCarousel } from "@/components/pages/home/image-carousel";
import { LatestProducts } from "@/components/pages/home/latest-products";

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
				<LatestProducts />
			</section>
		</>
	);
}
