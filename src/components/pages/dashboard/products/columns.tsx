"use client";

import Image from "next/image";
import type { Product } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface ProductPayload extends Product {
	category: { name: string };
	colorOptions: {
		color: string;
		stock: number;
	}[];
}

export const columns: ColumnDef<ProductPayload>[] = [
	{
		accessorKey: "images",
		header: "Image",
		cell: ({ row }) => <ProductImage src={row.original.images[0]} />
	},
	{ accessorKey: "title", header: "Title" },
	{ accessorKey: "originalPrice", header: "Original Price" },
	{ accessorKey: "discountedPrice", header: "Discounted Price", cell: ({ row }) => <span>{row.original.discountedPrice || "-"}</span> },
	{ accessorKey: "colorOptions", header: "Color Variations", cell: ({ row }) => <ColorVariants colors={row.original.colorOptions} /> },
	{ accessorKey: "category", header: "Category", cell: ({ row }) => <Badge>{row.original.category.name.toLowerCase()}</Badge> }
];

function ProductImage({ src }: { src: string }) {
	return (
		<div className="bg-muted aspect-square size-10 overflow-hidden rounded-md object-cover md:size-20">
			<Image src={src} width={200} height={200} className="" alt="product image" />
		</div>
	);
}

function ColorVariants({ colors }: { colors: { color: string; stock: number }[] }) {
	return (
		<div className="flex items-center justify-center gap-0.5 md:gap-2">
			{colors.map(({ color, stock }) => (
				<Tooltip key={color}>
					<TooltipTrigger className="size-5 rounded-full" style={{ backgroundColor: color }} />
					<TooltipContent>Stock : {stock}</TooltipContent>
				</Tooltip>
			))}
		</div>
	);
}
