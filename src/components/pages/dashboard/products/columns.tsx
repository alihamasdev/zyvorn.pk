"use client";

import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";

import type { DashbboardProducts } from "@/lib/dal";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const columns: ColumnDef<DashbboardProducts>[] = [
	{
		accessorKey: "images",
		header: "Image",
		cell: ({ row }) => <ProductImage src={row.original.images[0]} />
	},
	{ accessorKey: "title", header: "Title" },
	{ accessorKey: "slug", header: "Slug" },
	{ accessorKey: "originalPrice", header: "Original Price" },
	{ accessorKey: "discountedPrice", header: "Discounted Price", cell: ({ row }) => <span>{row.original.discountedPrice || "-"}</span> },
	{ accessorKey: "variations", header: "Variations", cell: ({ row }) => <ColorVariants data={row.original.variations} /> },
	{ accessorKey: "category", header: "Category", cell: ({ row }) => <Badge>{row.original.category.name.toLowerCase()}</Badge> }
];

export function ProductImage({ src }: { src: string }) {
	return (
		<div className="bg-muted aspect-square size-10 overflow-hidden rounded-md object-cover md:size-20">
			<Image src={src} width={80} height={80} alt="product image" />
		</div>
	);
}

function ColorVariants({ data }: { data: DashbboardProducts["variations"] }) {
	return (
		<div className="flex items-center justify-center gap-0.5 md:gap-2">
			{data.map(({ name, color, stock }) => (
				<Tooltip key={name}>
					<TooltipTrigger className="size-5 rounded-full border" style={{ backgroundColor: color }} />
					<TooltipContent>Stock : {stock}</TooltipContent>
				</Tooltip>
			))}
		</div>
	);
}
