"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";

import type { Order } from "@/lib/dal";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/pages/dashboard/products/columns";

export const columns: ColumnDef<Order>[] = [
	{
		accessorKey: "images",
		header: "Image",
		cell: ({ row }) => (
			<div className="relative w-fit">
				<ProductImage src={row.original.items[0].product.images[0]} />
				<span className="bg-foreground text-background absolute -top-1.5 -right-1.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] tabular-nums">
					{row.original.items.length}
				</span>
			</div>
		)
	},
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "email", header: "Email" },
	{ accessorKey: "phone", header: "Phone", cell: ({ row }) => `0${row.original.phone}` },
	{ accessorKey: "city", header: "City" },
	{ accessorKey: "amount", header: "Amount", cell: ({ row }) => `Rs.${row.original.amount}` },
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge variant={row.original.status === "PROCESSING" ? "secondary" : "default"}>{row.original.status.toLowerCase()}</Badge>
		)
	},
	{
		accessorKey: "",
		header: "Actions",
		cell: ({ row }) => (
			<Link href={`/dashboard/orders/${row.original.id}`} className="inline-flex size-10 items-center justify-center">
				<EyeIcon size={18} />
			</Link>
		)
	}
];
