"use client";
import { Home, LogOut, type LucideIcon, ShoppingBag, ShoppingCart, Tag } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
import { cn } from "@/lib/utils";
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
						<h1 className="text-center font-semibold text-3xl uppercase">ZYVORN</h1>
					</Link>
				</SidebarHeader>
				<SidebarContent className="px-2">
					<SidebarMenu>
						{items.map((item, index) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									className={cn(
										"h-10",
										index === 0 &&
											path === item.url &&
											"bg-sidebar-primary font-medium text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
										index !== 0 &&
											path.startsWith(item.url) &&
											"bg-sidebar-primary font-medium text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
									)}
									onClick={() => setOpenMobile(false)}
									size="lg"
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
							className="h-10 cursor-pointer hover:bg-destructive/15 hover:text-destructive"
							onClick={() => {
								setOpenMobile(false);
								setOpen(true);
							}}
							size="lg"
						>
							<LogOut />
							Logout of dashboard
						</SidebarMenuButton>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
			<LogoutDialog onOpenChange={setOpen} open={open} />
		</>
	);
}
