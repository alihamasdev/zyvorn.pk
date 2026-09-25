"use client";

import { useState } from "react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardOrdersTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DashboardOrdersTable<TData, TValue>({ data, columns }: DashboardOrdersTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const table = useReactTable({
		data,
		columns,
		state: { columnFilters },
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	});

	return (
		<>
			<div className="flex items-center justify-between gap-4">
				<h1 className="text-xl font-semibold">Orders</h1>
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
						<TabsTrigger value="PROCESSING">Processing</TabsTrigger>
						<TabsTrigger value="SHIPPED">Shipped</TabsTrigger>
						<TabsTrigger value="DELIVERED">Delivered</TabsTrigger>
						<TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader className="bg-muted/50">
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
								<TableCell colSpan={columns.length} className="h-24 text-center">
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
