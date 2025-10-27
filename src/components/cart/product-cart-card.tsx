import Image from "next/image";

import type { CartProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductCartCardProps {
	data: CartProduct;
	className?: string;
	children?: React.ReactNode;
}

export function ProductCartCard({ data, className, children }: ProductCartCardProps) {
	return (
		<div className={cn("flex items-center gap-3 p-3", className)}>
			<div className="relative">
				<div className="bg-muted flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg">
					<Image width={100} height={100} alt={data.title} src={data.image} className="aspect-square size-full object-cover" />
				</div>
				<span className="bg-foreground text-background absolute -top-1.5 -left-1.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] tabular-nums">
					{data.quantity}
				</span>
			</div>
			<div className="flex flex-col">
				<h3 className="line-clamp-2">{data.title}</h3>
				<p className="text-muted-foreground text-sm capitalize">{data.variationName}</p>
				{children}
			</div>
			<div className="ml-auto">
				<p>{`Rs.${data.price}`}</p>
			</div>
		</div>
	);
}
