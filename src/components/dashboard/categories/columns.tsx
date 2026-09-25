"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { EditIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import type { Category } from "@/lib/prisma/client";
import { formatDate } from "@/lib/utils";
import { Button, LinkButton } from "@/components/ui/button";
import { DeleteDialog } from "@/components/delete-dialog";

import { deleteCategoryAction } from "./action";

export const dashboardCategoriesColumn: ColumnDef<Category>[] = [
	{ accessorKey: "name", header: "Name" },
	{
		accessorKey: "slug",
		header: "Link",
		cell: ({ row }) => (
			<a href={`/collections/${row.original.slug}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
				{`/collections/${row.original.slug}`}
			</a>
		),
	},
	{ accessorKey: "createdAt", header: "Date", cell: ({ row }) => formatDate(row.original.createdAt) },
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			return (
				<div className="inline-flex items-center">
					<LinkButton href={`/dashboard/categories/${row.original.id}`} variant="ghost" size="icon-sm">
						<EditIcon className="text-muted-foreground" />
					</LinkButton>
					<DeleteDialog
						title={`Delete ${row.original.name} Category?`}
						description={`Are you sure you want to delete. This action will permanently remove the ${row.original.name.toLowerCase()} category and all products within it. This action cannot be undone.`}
						onDelete={async () => {
							const { error } = await deleteCategoryAction(row.original.id);
							error ? toast.error(error) : toast.success("Category deleted successfuly");
						}}
					>
						<Button variant="ghost" size="icon-sm">
							<Trash2Icon className="text-destructive" />
						</Button>
					</DeleteDialog>
				</div>
			);
		},
	},
];
