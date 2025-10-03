import type { Route } from "next";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

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
import { Cart } from "@/components/cart";

export function Header() {
	const navLinks = [
		{ name: "Home", link: "/" },
		{ name: "Shop", link: "/collections/all" },
		{ name: "Clothing", link: "/collections/clothing" },
		{ name: "Jewellery", link: "/collections/jewellery" },
		{ name: "Watches", link: "/collections/watches" }
	] as { name: string; link: Route }[];

	return (
		<header className="bg-background sticky top-0 z-50 w-full py-3" style={{ boxShadow: "0 1px 3px rgb(0 0 0 / 10%)" }}>
			<div className="container mx-auto flex items-center justify-between px-4">
				<Sheet>
					<SheetTrigger className="sm:hidden">
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
					</SheetContent>
				</Sheet>
				<Link href="/" className="text-xl/9 font-semibold">
					ZYVORN
				</Link>
				<nav className="hidden items-center gap-4 sm:flex">
					{navLinks.map(({ name, link }) => (
						<Link href={link} key={name} className="decoration-gradient px-1 pb-px text-sm">
							{name}
						</Link>
					))}
				</nav>
				<Cart />
			</div>
		</header>
	);
}
