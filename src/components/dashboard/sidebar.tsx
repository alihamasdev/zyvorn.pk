"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon } from "lucide-react";

import { signOut, useSession } from "@/lib/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from "@/components/ui/sidebar";

import { sidebarRoutes } from "./routes";
import { getSidebarActiveItem } from "./utils";

export function DashboardSidebar() {
	const { data } = useSession();
	const { setOpenMobile } = useSidebar();

	const pathname = usePathname();
	const activeUrl = getSidebarActiveItem(pathname);

	return (
		<Sidebar>
			<SidebarHeader>
				<h1 className="text-center text-2xl font-semibold uppercase">Admin Panel</h1>
			</SidebarHeader>
			<SidebarContent>
				{sidebarRoutes.map(({ label, menu }) => (
					<SidebarGroup key={label}>
						<SidebarGroupLabel>{label}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{menu.map(({ title, url, icon: Icon }) => (
									<SidebarMenuItem key={title}>
										<SidebarMenuButton
											className="data-[active=true]:text-primary-foreground data-[active=true]:bg-primary"
											isActive={activeUrl === url}
											asChild
										>
											<Link href={url} onClick={() => setOpenMobile(false)}>
												<Icon />
												<span>{title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarFooter>
				{data?.user && (
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg">
								<Avatar className="size-8">
									<AvatarImage src={data.user.image ?? undefined} alt={data.user.name} />
									<AvatarFallback>{`${data.user.name[0]}`}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{data.user.name}</span>
									<span className="text-muted-foreground truncate text-xs">{data.user.email}</span>
								</div>
							</SidebarMenuButton>
							<SidebarMenuAction
								title="Sign out"
								onClick={async () => {
									await signOut({
										fetchOptions: {
											onSuccess: () => {
												window.location.href = "/login";
											}
										}
									});
								}}
							>
								<LogOutIcon />
								<span className="sr-only">Sign out</span>
							</SidebarMenuAction>
						</SidebarMenuItem>
					</SidebarMenu>
				)}
			</SidebarFooter>
		</Sidebar>
	);
}

export function SignOutButton({ className, ...props }: React.ComponentProps<typeof Button>) {
	return (
		<Button
			variant="outline"
			onClick={async () => {
				await signOut({
					fetchOptions: {
						onSuccess: () => {
							window.location.href = "/login";
						}
					}
				});
			}}
			className={className}
			{...props}
		>
			<LogOutIcon className="mr-2 size-4" />
			<span>Sign out</span>
		</Button>
	);
}
