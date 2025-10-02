import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { LoaderIcon } from "lucide-react";

import { getLimitedProducts, getProductBySlug, getProductRating } from "@/lib/dal";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ProductButtons } from "@/components/product/product-buttons";
import { ProductImages } from "@/components/product/product-images";
import { ProductRatingStars } from "@/components/product/product-rating-stars";

const ProductReviews = dynamic(() => import("@/components/product/product-reviews"));

export async function generateStaticParams() {
	const products = await getLimitedProducts(30);
	return products.map(({ slug }) => ({ slug }));
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
	const { slug } = await params;
	const data = await getProductBySlug(slug);
	return (
		<div className="space-y-6">
			<section className="grid grid-cols-1 gap-y-7 md:grid-cols-2 md:gap-x-15 md:gap-y-0">
				<ProductImages images={data.images} />
				<div className="space-y-4">
					<h1 className="text-3xl font-semibold md:text-4xl">{data.title}</h1>
					<Suspense fallback={<ProductRatingStars rating={0} size="lg" />}>
						<ProductRating productId={data.id} />
					</Suspense>
					<div className="flex items-end gap-3 text-2xl font-semibold md:text-3xl">
						{data.discountedPrice && <p>{`Rs.${data.discountedPrice}`}</p>}
						<p className={cn(data.discountedPrice && "text-muted-foreground text-base font-medium line-through md:text-lg")}>
							{`Rs.${data.originalPrice}`}
						</p>
					</div>
					{data.shortDescription && (
						<div className="">
							<p className="text-muted-foreground line-clamp-8 text-sm break-words whitespace-pre-line md:text-base">
								{data.shortDescription}
							</p>
							<Link href="#description" className="decoration-gradient pb-1 text-sm">
								Read more
							</Link>
						</div>
					)}
					<Separator />
					<Suspense>
						<ProductButtons variations={data.variations} />
					</Suspense>
				</div>
				<div />
			</section>
			<section className="space-y-4">
				<h1 id="description" className="scroll-m-18 text-2xl font-semibold">
					Description
				</h1>
				<div className="text-muted-foreground text-sm break-words whitespace-pre-line md:text-base">{data.longDescription}</div>
			</section>
			<section className="space-y-4">
				<h1 id="reviews" className="scroll-m-18 text-2xl font-semibold">
					Reviews
				</h1>
				<Suspense fallback={<LoaderIcon className="mx-auto animate-spin" />}>
					<ProductReviews productId={data.id} />
				</Suspense>
			</section>
		</div>
	);
}

async function ProductRating({ productId }: { productId: number }) {
	const { rating, totalRating } = await getProductRating(productId);
	return (
		<ProductRatingStars rating={rating} size="lg">
			<p className="text-base/4.5">{rating ? rating.toFixed(1) : rating}</p>
			<p className="text-base/4.5">{`(${totalRating})`}</p>
		</ProductRatingStars>
	);
}
