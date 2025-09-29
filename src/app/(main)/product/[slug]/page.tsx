import { Suspense } from "react";
import Link from "next/link";

import { getLimitedProducts, getProductBySlug, getProductRating } from "@/lib/dal";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ProductButtons } from "@/components/product/product-buttons";
import { ProductImages } from "@/components/product/product-images";
import { ProductRatingStars } from "@/components/product/product-rating-stars";

export async function generateStaticParams() {
	const products = await getLimitedProducts(10);
	return products.map(({ slug }) => ({ slug }));
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
	const { slug } = await params;
	const data = await getProductBySlug(slug);
	return (
		<div className="grid grid-cols-1 gap-y-7 md:grid-cols-2 md:gap-x-15 md:px-6">
			<ProductImages images={data.images} />
			<div className="space-y-4">
				<h1 className="text-3xl font-semibold md:text-4xl">{data.title}</h1>
				<Suspense fallback={<ProductRatingStars rating={0} />}>
					<ProductRating productId={data.id} />
				</Suspense>
				<div className="flex items-end gap-3 text-2xl font-semibold md:text-3xl">
					{data.discountedPrice && <p>{`Rs.${data.discountedPrice}`}</p>}
					<p className={cn(data.discountedPrice && "text-muted-foreground text-base font-medium line-through md:text-lg")}>
						{`Rs.${data.originalPrice}`}
					</p>
				</div>
				<div>
					<p className="text-muted-foreground line-clamp-8">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad corrupti dicta mollitia maiores voluptates hic itaque consequuntur
						voluptas deleniti architecto soluta modi aliquam, magni animi at neque non officia vitae suscipit nam. Soluta eos quibusdam quis
						neque. Fugiat delectus neque et repellendus dicta. Quibusdam suscipit tempore mollitia! Incidunt repudiandae vitae sequi minima
						ratione eum modi fuga saepe nemo fugit sit rerum, libero dolorem maxime aut asperiores quia voluptatem quae porro enim
						reiciendis voluptas ad recusandae. Laboriosam quae corporis praesentium, repudiandae suscipit cum provident laudantium nemo enim
						pariatur eos atque neque beatae error amet hic obcaecati soluta tempore quibusdam et animi!
					</p>
					<Link href="#" className="decoration-gradient pb-1 text-sm">
						Read more
					</Link>
				</div>
				<Separator />
				<Suspense>
					<ProductButtons variations={data.variations} />
				</Suspense>
			</div>
			<div />
		</div>
	);
}

async function ProductRating({ productId }: { productId: number }) {
	const { rating, totalRating } = await getProductRating(productId);
	return (
		<ProductRatingStars rating={rating}>
			<p className="text-base/4.5">{rating ? rating.toFixed(1) : rating}</p>
			<p>{`(${totalRating})`}</p>
		</ProductRatingStars>
	);
}
