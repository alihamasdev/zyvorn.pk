import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createColumnHelper,
	createFilteredRowModel,
	filterFns,
	rowSelectionFeature,
	tableFeatures,
} from "@tanstack/react-table";

export const dashboardTableFeatures = tableFeatures({
	columnFilteringFeature,
	columnVisibilityFeature,
	rowSelectionFeature,
	filteredRowModel: createFilteredRowModel(),
	filterFns,
});

export type DashboardTableFeatures = typeof dashboardTableFeatures;

export function createDashboardColumnHelper<TData extends object>() {
	return createColumnHelper<DashboardTableFeatures, TData>();
}
