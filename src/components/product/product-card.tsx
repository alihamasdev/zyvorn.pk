import type { Route } from "next";
import Image from "next/image";

import type { ProductCardPayload } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@/components/link";

export function ProductCard({ data, index }: { data: ProductCardPayload; index: number }) {
	return (
		<div className="relative space-y-1">
			<Link href={`/product/${data.slug}` as Route} className="bg-muted relative flex shrink-0 overflow-hidden rounded-md">
				<Image
					width={200}
					height={200}
					alt={data.title}
					src={data.images[0]}
					priority={index > 5}
					className="aspect-square size-full object-cover"
				/>
			</Link>
			<Link href={`/product/${data.slug}` as Route} className="text-sm font-medium md:text-base">
				{data.title}
			</Link>
			<div className="flex items-end gap-x-1">
				{data.discountedPrice && <span className="font-medium">{`Rs.${data.discountedPrice}`}</span>}
				<span className={cn("block", data.discountedPrice ? "text-muted-foreground text-sm font-normal line-through" : "")}>
					{`Rs.${data.originalPrice}`}
				</span>
			</div>
			<div className="flex items-center gap-x-1">
				{data.variations.map(({ name, color }) => (
					<Tooltip key={name}>
						<TooltipTrigger asChild>
							<div className={cn("border-muted-foreground size-4 rounded-full border")} style={{ backgroundColor: color }} />
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
