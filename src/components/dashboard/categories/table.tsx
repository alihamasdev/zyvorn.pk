"use client";

import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";

import { LinkButton } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DashboardCategoriesTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DashboardCategoriesTable<TData, TValue>({ data, columns }: DashboardCategoriesTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<>
			<div className="grid gap-4 md:grid-cols-3">
				<h1 className="text-xl/9 font-semibold">Categories</h1>
				<div className="flex items-center gap-4 md:col-span-2 md:justify-end">
					<LinkButton href="/dashboard/categories/new" prefetch>
						<PlusIcon />
						New Category
					</LinkButton>
				</div>
			</div>
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader className="bg-muted/70">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} className="font-semibold">
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
