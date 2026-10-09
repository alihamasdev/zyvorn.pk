import Link from "next/link";

import { type Product, type ProductImage as ProductImageModel } from "@/lib/prisma/client";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "@/components/product/product-image";

export function ProductCard({
	product,
	priority = false,
}: {
	product: Omit<Product, "costPrice"> & { images?: ProductImageModel[] };
	priority?: boolean;
}) {
	return (
		<div className="relative space-y-1">
			<Link href={`/products/${product.slug}`} className="block space-y-1">
				<div className="bg-muted shrink-0 overflow-hidden rounded-md">
					<ProductImage src={product.images?.[0]} alt="" size={220} transformation="listing" priority={priority} />
				</div>
				<p className="line-clamp-2 text-sm font-medium md:text-base">{product.title}</p>
			</Link>
			<div className="flex items-end gap-x-1">
				{product.discountPrice && <p className="text-sm font-medium md:text-base">{`Rs.${product.discountPrice}`}</p>}
				<p className={cn(product.discountPrice ? "text-muted-foreground text-sm font-normal line-through" : "text-xs font-medium")}>
					{`Rs.${product.salePrice}`}
				</p>
			</div>
		</div>
	);
}

export function ProductCardSkeleton({ length = 10 }: { length?: number }) {
	return Array.from({ length }, (_, i) => (
		<div key={i} className="relative space-y-1">
			<Skeleton className="aspect-square w-full" />
			<Skeleton className="h-6" />
			<Skeleton className="h-6 w-1/2" />
		</div>
	));
}
