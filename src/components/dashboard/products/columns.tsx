"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { EditIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { type getDashboardProducts } from "@/lib/dal";
import { type PRODUCT_STATUS } from "@/lib/prisma/enums";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { type DashboardTableFeatures } from "@/components/dashboard/table-features";
import { DeleteDialog } from "@/components/delete-dialog";
import { ProductImage } from "@/components/product/product-image";

import { deleteProductAction } from "./action";

type DashboardProduct = Awaited<ReturnType<typeof getDashboardProducts>>[number];

const productStatusVariantMap: Record<PRODUCT_STATUS, "success" | "warning" | "destructive"> = {
	PUBLISHED: "success",
	DRAFT: "warning",
	ARCHIVED: "destructive",
};

export const dashboardProductsColumn: ColumnDef<DashboardTableFeatures, DashboardProduct>[] = [
	{
		id: "product",
		header: "Product",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<div className="bg-muted size-15 shrink-0 overflow-hidden rounded-md">
					<ProductImage src={row.original.images?.[0] ?? ""} alt={row.original.title} size={60} transformation="thumbnail" />
				</div>
				<p className="line-clamp-2 max-w-60 font-medium text-pretty">{row.original.title}</p>
			</div>
		),
	},
	{ id: "price", header: "Price", cell: ({ row }) => `Rs.${row.original.discountPrice ?? row.original.salePrice}` },
	{ accessorKey: "stock", header: "Stock" },
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.original.status as PRODUCT_STATUS;
			return <Badge variant={productStatusVariantMap[status] ?? "default"}>{status}</Badge>;
		},
	},
	{ id: "createdAt", header: "Date", cell: ({ row }) => formatDate(row.original.createdAt) },
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			return (
				<div className="inline-flex items-center">
					<LinkButton
						href={`/dashboard/products/${row.original.id}`}
						variant="ghost"
						size="icon-sm"
						aria-label={`Edit ${row.original.title}`}
					>
						<EditIcon className="text-muted-foreground" />
					</LinkButton>
					<DeleteDialog
						title={`Delete Product?`}
						description={`Are you sure you want to delete. This action will permanently remove the ${row.original.title.toLowerCase()} and this action cannot be undone.`}
						onDelete={async () => {
							const { error } = await deleteProductAction(row.original.id);
							error ? toast.error(error) : toast.success("Product deleted successfuly");
						}}
					>
						<Button variant="ghost" size="icon-sm" aria-label={`Delete ${row.original.title}`}>
							<Trash2Icon className="text-destructive" />
						</Button>
					</DeleteDialog>
				</div>
			);
		},
	},
];
