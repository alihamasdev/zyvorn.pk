"use client";

import { useState } from "react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
} from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";

import { LinkButton } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardCategoriesTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DashboardProductsTable<TData, TValue>({ data, columns }: DashboardCategoriesTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const table = useReactTable({
		data,
		columns,
		state: { columnFilters },
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<>
			<div className="grid gap-4 md:grid-cols-3">
				<h1 className="text-xl/9 font-semibold">Products</h1>
				<div className="flex items-center gap-4 md:col-span-2 md:justify-end">
					<LinkButton href="/dashboard/products/new" prefetch>
						<PlusIcon />
						New Product
					</LinkButton>
				</div>
			</div>
			<Tabs
				defaultValue="ALL"
				onValueChange={(val) => {
					if (val === "ALL") {
						table.getColumn("status")?.setFilterValue(undefined);
					} else {
						table.getColumn("status")?.setFilterValue(val);
					}
				}}
			>
				<TabsList>
					<TabsTrigger value="ALL">All</TabsTrigger>
					<TabsTrigger value="PUBLISHED">Published</TabsTrigger>
					<TabsTrigger value="DRAFT">Draft</TabsTrigger>
					<TabsTrigger value="ARCHIVED">Archived</TabsTrigger>
				</TabsList>
			</Tabs>
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
