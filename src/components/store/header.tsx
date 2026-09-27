import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { getCategories } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import { AccountButton } from "@/components/account/account-button";
import { CartSheet } from "@/components/cart/cart-sheet";
import { ClientBoundary } from "@/components/client-boundry";
import { MobileNav } from "@/components/store/mobile-nav";

export async function StoreHeader() {
	const categories = await getCategories();
	const navLinks = [
		{ label: "Home", href: "/" },
		{ label: "Shop", href: "/collections/all" },
		...categories.map((category) => ({ label: category.name, href: `/collections/${category.slug}` })),
	];

	return (
		<header className="bg-background sticky top-0 z-50 w-full" style={{ boxShadow: "0 1px 3px rgb(0 0 0 / 10%)" }}>
			<div className="container mx-auto flex items-center justify-between px-4 py-3">
				<ClientBoundary
					fallback={
						<Button size="icon" variant="link" className="md:hidden" aria-label="Open menu">
							<MenuIcon />
						</Button>
					}
				>
					<MobileNav navLinks={navLinks} />
				</ClientBoundary>
				<Link href="/" className="text-xl/9 font-semibold">
					ZYVORN
				</Link>
				<nav className="hidden sm:flex sm:items-center sm:gap-4">
					{navLinks.map(({ label, href }) => (
						<Link href={href} key={label} className="decoration-gradient px-1 pb-px text-sm" prefetch>
							{label}
						</Link>
					))}
				</nav>
				<div className="space-x-1">
					<AccountButton />
					<CartSheet />
				</div>
			</div>
		</header>
	);
}
