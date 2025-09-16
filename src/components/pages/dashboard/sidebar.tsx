"use client";

import { useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogOut, ShoppingBag, ShoppingCart, Tag, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from "@/components/ui/sidebar";

import { LogoutDialog } from "./logout-dialog";

const items = [
	{ title: "Home", url: "/dashboard", icon: Home },
	{ title: "Orders", url: "/dashboard/orders", icon: ShoppingCart },
	{ title: "Products", url: "/dashboard/products", icon: ShoppingBag },
	{ title: "Categories", url: "/dashboard/categories", icon: Tag }
] satisfies { title: string; url: Route; icon: LucideIcon }[];

export function DashboardSidebar() {
	const path = usePathname();
	const [open, setOpen] = useState(false);
	const { setOpenMobile } = useSidebar();
	return (
		<>
			<Sidebar>
				<SidebarHeader className="py-5">
					<Link href="/">
						<h1 className="text-center text-3xl font-semibold uppercase">ZYVORN</h1>
					</Link>
				</SidebarHeader>
				<SidebarContent className="px-2">
					<SidebarMenu>
						{items.map((item, index) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									size="lg"
									asChild
									onClick={() => setOpenMobile(false)}
									className={cn(
										"h-10",
										index === 0 &&
											path === item.url &&
											"bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground font-medium",
										index !== 0 &&
											path.startsWith(item.url) &&
											"bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground font-medium"
									)}
								>
									<Link href={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarContent>
				<SidebarFooter className="pb-4">
					<SidebarMenu>
						<SidebarMenuButton
							size="lg"
							className="hover:bg-destructive/15 hover:text-destructive h-10 cursor-pointer"
							onClick={() => {
								setOpenMobile(false);
								setOpen(true);
							}}
						>
							<LogOut />
							Logout of dashboard
						</SidebarMenuButton>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
			<LogoutDialog open={open} onOpenChange={setOpen} />
		</>
	);
}
