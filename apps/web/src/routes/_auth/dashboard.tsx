import { createFileRoute } from "@tanstack/react-router";
import { api } from "@zyvorn/backend/convex/_generated/api";
import { useQuery } from "convex/react";

export const Route = createFileRoute("/_auth/dashboard")({
	component: DashboardContent,
});

function DashboardContent() {
	const privateData = useQuery(api.privateData.get);

	return (
		<div>
			<h1>Dashboard</h1>
			<p>privateData: {privateData?.message}</p>
		</div>
	);
}
