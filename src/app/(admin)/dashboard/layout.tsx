import { Suspense } from "react";

import { getAdminSession } from "@/lib/auth/server";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function AdminLayout({ children }: LayoutProps<"/dashboard">) {
	await getAdminSession();

	return (
		<Suspense>
			<SidebarProvider>
				<DashboardSidebar />
				<SidebarInset>
					<DashboardHeader />
					<div className="flex flex-1 flex-col gap-4 p-4 pb-20">
						<Suspense fallback={<Spinner className="mx-auto mt-5 md:size-5.5" />}>{children}</Suspense>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</Suspense>
	);
}
