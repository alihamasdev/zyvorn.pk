"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import type { ProductVariation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ProductButtons({ variations }: { variations: ProductVariation[] }) {
	const [count, setCount] = useState(1);
	const [queryColor, setQueryColor] = useQueryState("color", { defaultValue: variations[0].name });

	const variationStock = variations.find((val) => val.name === queryColor)!.stock;

	return (
		<>
			<div className="flex flex-col gap-2">
				<p className="text-sm font-semibold uppercase">Color : {queryColor}</p>
				<div className="flex items-center gap-3">
					{variations.map(({ name, color }) => (
						<Tooltip key={name}>
							<TooltipTrigger
								style={{ backgroundColor: color }}
								onClick={() => setQueryColor(name)}
								className={cn("size-5 cursor-pointer rounded-full border", name === queryColor && "ring-1 ring-black")}
							/>
							<TooltipContent side="bottom" className="font-medium uppercase">
								{name}
							</TooltipContent>
						</Tooltip>
					))}
				</div>
			</div>
			{variationStock ? (
				<>
					<div className="inline-flex items-center justify-between overflow-hidden rounded-full border select-none">
						<button type="button" className="h-12 cursor-pointer px-4" onClick={() => setCount((prev) => (prev > 1 ? prev - 1 : prev))}>
							<MinusIcon size={16} />
						</button>
						<p className="min-w-20 text-center font-medium">{count}</p>
						<button
							type="button"
							className="h-12 cursor-pointer px-4"
							onClick={() => (count < variationStock ? setCount((prev) => prev + 1) : toast.error(`Only ${variationStock} items availabe`))}
						>
							<PlusIcon size={16} />
						</button>
					</div>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						<Button variant="outline" size="lg" className="h-12 font-semibold uppercase">
							Buy now
						</Button>
						<Button size="lg" className="h-12 font-semibold uppercase">
							Add to cart
						</Button>
					</div>
				</>
			) : (
				<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
					<Button size="lg" className="h-12 font-semibold uppercase" disabled>
						Out of stock
					</Button>
				</div>
			)}
		</>
	);
}
