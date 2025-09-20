"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import type { ProductData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StarRating } from "@/components/product/product-rating";

export function ProductCard({ productData }: { productData: ProductData }) {
	const [prefetch, setPrefetch] = useState(false);

	const { data } = useQuery({
		queryKey: ["product", productData.id],
		queryFn: () => Promise.resolve(productData),
		initialData: productData
	});

	return (
		<div className="space-y-1">
			<Link
				prefetch={prefetch}
				href={`/product/${data.slug}`}
				onMouseEnter={() => setPrefetch(true)}
				className="relative flex shrink-0 overflow-hidden rounded-md"
			>
				<Image src={data.images[0]} width={200} height={200} alt={data.title} className="aspect-square size-full object-cover" />
			</Link>
			<Link
				prefetch={prefetch}
				onMouseEnter={() => setPrefetch(true)}
				href={`/product/${data.slug}`}
				className="pt-1 text-sm font-medium md:text-base"
			>
				{data.title}
			</Link>
			<StarRating rating={data.rating} />
			<div className="mt-1 flex items-end gap-x-1">
				{data.discountedPrice && <span className="text-base font-medium">{`Rs.${data.discountedPrice}`}</span>}
				<span
					className={cn(
						"block",
						data.discountedPrice ? "text-muted-foreground text-xs font-normal line-through md:text-sm" : "text-sm font-medium md:text-base"
					)}
				>
					{`Rs.${data.originalPrice}`}
				</span>
			</div>
			<div className="mt-1 flex items-center gap-x-1">
				{data.variations.map(({ name, color }) => (
					<Tooltip key={name}>
						<TooltipTrigger asChild>
							<div className={cn("border-muted-foreground size-3 rounded-full border md:size-4")} style={{ backgroundColor: color }} />
						</TooltipTrigger>
						<TooltipContent className="font-medium capitalize">{name}</TooltipContent>
					</Tooltip>
				))}
			</div>
		</div>
	);
}

export function ProductCardLoader({ length = 10 }: { length?: number }) {
	return Array.from({ length }).map((_, index) => (
		<div key={index} className="flex flex-col gap-y-2">
			<Skeleton className="flex aspect-square shrink-0 overflow-hidden rounded-md" />
			<Skeleton className="h-5" />
		</div>
	));
}
