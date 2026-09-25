"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { dashboardRoutes } from "./routes";
import { getHeaderRoutes } from "./utils";

export function DashboardHeader() {
	const path = usePathname();
	const currentRoute = dashboardRoutes.find((val) => getHeaderRoutes(val.route, path));

	return (
		<header className="flex shrink-0 items-center gap-2 border-b px-4 py-2">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
			<Breadcrumb>
				<BreadcrumbList>
					{currentRoute?.routeList.map((item) => (
						<Fragment key={item.url}>
							<BreadcrumbLink className="capitalize" asChild>
								<Link href={item.url} prefetch={false}>
									{item.name}
								</Link>
							</BreadcrumbLink>
							<BreadcrumbSeparator />
						</Fragment>
					))}
					<BreadcrumbItem>
						<BreadcrumbPage>{currentRoute?.routeTitle}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</header>
	);
}
