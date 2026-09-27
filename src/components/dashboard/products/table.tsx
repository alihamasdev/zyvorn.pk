"use client";

import { useState } from "react";
import { useTable, type ColumnDef, type ColumnFiltersState } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";

import { LinkButton } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardTableFeatures, type DashboardTableFeatures } from "@/components/dashboard/table-features";

type DashboardProductsTableProps<TData extends object> = {
	columns: ColumnDef<DashboardTableFeatures, TData>[];
	data: TData[];
};

export function DashboardProductsTable<TData extends object>({ data, columns }: DashboardProductsTableProps<TData>) {
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
