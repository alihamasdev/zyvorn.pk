import { Suspense } from "react";
import Link from "next/link";
import { PhoneIcon, QuoteIcon, TruckIcon, Undo2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ImageCarousel } from "@/components/pages/home/image-carousel";
import { LatestProducts } from "@/components/pages/home/latest-products";
import { ProductCardLoader } from "@/components/product/product-card";

const images = [
	{ src: "banner_1.webp", alt: "carousel image", width: 1248, height: 416 },
	{ src: "banner_2.webp", alt: "carousel image", width: 1248, height: 416 },
	{ src: "banner_3.webp", alt: "carousel image", width: 1248, height: 416 }
];

const testimonials = [
	{
		name: "Khizar Ali",
		comment:
			"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aut impedit fugit temporibus! Dolores atque, non laborum, praesentium id aliquam cum ipsum fugiat fugit harum numquam! Obcaecati possimus dignissimos numquam praesentium quibusdam fugit recusandae dolore? Pariatur, voluptatem quam assumenda corporis aliquam aut, praesentium incidunt vitae excepturi ducimus nam quibusdam veniam hic?"
	},
	{
		name: "Zohaib Iftikhar",
		comment:
			"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aut impedit fugit temporibus! Dolores atque, non laborum, praesentium id aliquam cum ipsum fugiat fugit harum numquam! Obcaecati possimus dignissimos numquam praesentium quibusdam fugit recusandae dolore? Pariatur, voluptatem quam assumenda corporis aliquam aut, praesentium incidunt vitae excepturi ducimus nam quibusdam veniam hic?"
	},
	{
		name: "Ahad Ali",
		comment:
			"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aut impedit fugit temporibus! Dolores atque, non laborum, praesentium id aliquam cum ipsum fugiat fugit harum numquam! Obcaecati possimus dignissimos numquam praesentium quibusdam fugit recusandae dolore? Pariatur, voluptatem quam assumenda corporis aliquam aut, praesentium incidunt vitae excepturi ducimus nam quibusdam veniam hic?"
	}
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
			<section className="space-y-6">
				<h1 className="text-left text-xl font-semibold">Our Customers</h1>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{testimonials.map(({ name, comment }) => (
						<article key={name} className="bg-card text-card-foreground flex flex-col gap-2 rounded-lg border p-4 shadow-md">
							<QuoteIcon className="text-muted-foreground size-4" fill="currentColor" />
							<p className="text-muted-foreground text-sm">{comment}</p>
							<p className="mt-auto font-medium">{name}</p>
						</article>
					))}
				</div>
			</section>
			<section className="space-y-4">
				<h1 className="text-left text-xl font-semibold">Why Choose Us?</h1>
				<div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 md:gap-6 lg:grid-cols-3">
					<div className="flex items-center gap-4">
						<div className="bg-muted inline-flex size-12 items-center justify-center rounded-full">
							<TruckIcon className="text-muted-foreground" size={20} />
						</div>
						<div>
							<p className="font-medium uppercase">Free Shipping</p>
							<p className="text-muted-foreground">Free shipping all over the Pakistan</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="bg-muted inline-flex size-12 items-center justify-center rounded-full">
							<PhoneIcon className="text-muted-foreground" size={20} />
						</div>
						<div>
							<p className="font-medium uppercase">Support 24/7</p>
							<p className="text-muted-foreground">Contact us 24 hours a day, 7 days a week</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="bg-muted inline-flex size-12 items-center justify-center rounded-full">
							<Undo2Icon className="text-muted-foreground" size={20} />
						</div>
						<div>
							<p className="font-medium uppercase">7 days return</p>
							<p className="text-muted-foreground">Simply return it within 7 days for an exchange.</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
