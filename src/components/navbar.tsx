"use client";

import type { Route } from "next";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import {
	Sheet,
	SheetClose,
	SheetCloseButton,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet";

interface NavbarProps extends React.PropsWithChildren {
	isAdmin: boolean;
	navLinks: { name: string; link: Route }[];
}

export function Navbar({ navLinks, isAdmin, children }: NavbarProps) {
	const isMobile = useIsMobile();

	if (!isMobile) {
		return (
			<>
				<MenuIcon className="size-5 sm:hidden" />
				{children}
				<nav className="hidden items-center gap-4 sm:flex">
					{navLinks.map(({ name, link }) => (
						<Link href={link} key={name} className="decoration-gradient px-1 pb-px text-sm">
							{name}
						</Link>
					))}
				</nav>
			</>
		);
	}

	return (
		<>
			<Sheet>
				<SheetTrigger>
					<MenuIcon className="size-5" />
				</SheetTrigger>
				<SheetContent side="left" className="gap-0">
					<SheetHeader className="flex-row justify-between border-b px-5 py-3">
						<SheetTitle>Menu</SheetTitle>
						<SheetCloseButton />
						<SheetDescription hidden />
					</SheetHeader>
					<div className="grid">
						{navLinks.map(({ name, link }) => (
							<SheetClose key={name} asChild>
								<Link href={link} className="border-b px-5 py-3 text-sm">
									{name}
								</Link>
							</SheetClose>
						))}
					</div>
					{isAdmin && (
						<SheetClose asChild>
							<Link href="/dashboard" className="bg-accent text-accent-foreground border-b px-5 py-3 text-sm font-medium">
								Seller Dashboard
							</Link>
						</SheetClose>
					)}
				</SheetContent>
			</Sheet>
			{children}
		</>
	);
}
