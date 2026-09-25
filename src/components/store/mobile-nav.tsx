"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetCloseButton,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav({ navLinks }: { navLinks: { label: string; href: string }[] }) {
	const isMobile = useIsMobile();

	if (!isMobile) return null;

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size="icon" variant="link">
					<MenuIcon />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="gap-0">
				<SheetHeader className="flex-row justify-between border-b px-5 py-3">
					<SheetTitle>Menu</SheetTitle>
					<SheetCloseButton />
					<SheetDescription hidden />
				</SheetHeader>
				<div className="grid">
					{navLinks.map(({ label, href }) => (
						<SheetClose key={label} asChild>
							<Link href={href} className="border-b px-5 py-3 text-sm">
								{label}
							</Link>
						</SheetClose>
					))}
				</div>
			</SheetContent>
		</Sheet>
	);
}
