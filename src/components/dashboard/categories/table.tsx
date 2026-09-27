"use client";

import { useTable, type ColumnDef } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";

import { LinkButton } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dashboardTableFeatures, type DashboardTableFeatures } from "@/components/dashboard/table-features";

type DashboardCategoriesTableProps<TData extends object> = {
	columns: ColumnDef<DashboardTableFeatures, TData>[];
	data: TData[];
};

export function DashboardCategoriesTable<TData extends object>({ data, columns }: DashboardCategoriesTableProps<TData>) {
	const table = useTable({
		data,
		columns,
		features: dashboardTableFeatures,
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
