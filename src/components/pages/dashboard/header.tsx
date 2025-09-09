"use client";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
	const path = usePathname();
	const pathList = path.split("/");
	const currentPath = pathList.pop();
	pathList.shift();
	return (
		<header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator className="mx-2 data-[orientation=vertical]:h-4" orientation="vertical" />
				<Breadcrumb>
					<BreadcrumbList>
						{pathList.map((item) => (
							<Fragment key={item}>
								<BreadcrumbItem>
									<BreadcrumbLink className="capitalize">{item.split("-").join(" ")}</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
							</Fragment>
						))}
						<BreadcrumbItem>
							<BreadcrumbPage className="capitalize">{currentPath?.split("-").join(" ")}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
