import Image from "next/image";

import { getProductReviews } from "@/lib/dal";
import { ProductRatingStars } from "@/components/product/product-rating-stars";

export default async function ProductReviews({ productId }: { productId: number }) {
	const reviews = await getProductReviews(productId);
	return (
		<div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4">
			{reviews.map(({ id, rating, comment, name, image }) => (
				<div key={id} className="bg-card text-card-foreground mb-4 break-inside-avoid space-y-1 rounded-md border p-3 shadow-md">
					<ProductRatingStars rating={rating} />
					<p className="line-clamp-1">{name}</p>
					<p className="text-muted-foreground text-sm break-words whitespace-pre-line">{comment}</p>
					{image && (
						<div className="bg-muted relative mt-2 aspect-square overflow-hidden rounded-md border">
							<Image src={image} alt={`${name} review`} width={250} height={250} className="aspect-square size-full object-cover" />
						</div>
					)}
				</div>
			))}
		</div>
	);
}
