"use client";

import { useState } from "react";
import { useTable, type ColumnDef, type ColumnFiltersState } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardTableFeatures, type DashboardTableFeatures } from "@/components/dashboard/table-features";

type DashboardOrdersTableProps<TData extends object> = {
	columns: ColumnDef<DashboardTableFeatures, TData>[];
	data: TData[];
};

export function DashboardOrdersTable<TData extends object>({ data, columns }: DashboardOrdersTableProps<TData>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const table = useTable({
		data,
		columns,
		features: dashboardTableFeatures,
		state: { columnFilters },
		onColumnFiltersChange: setColumnFilters,
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
											{header.isPlaceholder ? null : <table.FlexRender header={header} />}
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
										<TableCell key={cell.id}>
											<table.FlexRender cell={cell} />
										</TableCell>
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
