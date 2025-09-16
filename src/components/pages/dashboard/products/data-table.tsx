"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { PlusIcon, Settings2Icon } from "lucide-react";

import { getProducts } from "@/lib/dal";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { columns, type ProductPayload } from "./columns";
import { ProductDeleteDialog } from "./delete-dialog";

export function DataTable({ dataPromise }: { dataPromise: Promise<ProductPayload[]> }) {
	const { data } = useQuery({
		queryKey: ["products", "dashboard"],
		queryFn: getProducts,
		initialData: use(dataPromise)
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	});

	return (
		<div className="space-y-4 p-4 md:space-y-6 md:p-6">
			<div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
				<h1 className="w-full text-left text-2xl/9 font-semibold">Products</h1>
				<div className="flex w-full flex-col gap-4 md:w-auto md:flex-row">
					<Input
						className="max-w-sm md:min-w-sm"
						placeholder="Search products..."
						value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
						onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
					/>
					<div className="grid w-full grid-cols-2 gap-4 md:flex">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									<Settings2Icon />
									Columns
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) => column.toggleVisibility(!!value)}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
						<Link href="/dashboard/products/add-product" className={cn(buttonVariants())}>
							<PlusIcon />
							Add Product
						</Link>
					</div>
				</div>
			</div>
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="bg-secondary hover:bg-secondary text-xs md:text-sm">
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="text-center first:text-left">
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
								<TableHead>Actions</TableHead>
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="text-center text-xs md:text-sm">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
									<TableCell>
										<ProductDeleteDialog slug={row.original.slug} />
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length + 1} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
