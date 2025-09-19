import type { Route } from "next";
import Link from "next/link";

import { isAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/dal";
import { Button } from "@/components//ui/button";
import { Cart } from "@/components/cart";
import { Navbar } from "@/components/navbar";

export async function Header() {
	const [categories, admin] = await Promise.all([getCategories(), isAdmin()]);

	const navLinks = [
		{ name: "Home", link: "/" },
		{ name: "Shop", link: "/collections/all-products" },
		...categories.map(({ name, slug }) => ({ name, link: `/collections/${slug}` }))
	] as { name: string; link: Route }[];

	return (
		<header className="bg-background sticky top-0 z-50 w-full py-3" style={{ boxShadow: "0 1px 3px rgb(0 0 0 / 10%)" }}>
			<div className="container mx-auto flex items-center justify-between px-4">
				<Navbar navLinks={navLinks} isAdmin={admin}>
					<Link href="/" className="text-xl/9 font-semibold">
						ZYVORN
					</Link>
				</Navbar>
				<div className="flex items-center gap-x-2">
					{admin && (
						<Button size="sm" variant="outline" className="hidden text-xs font-normal sm:inline-flex" asChild>
							<Link href="/dashboard">Seller Dashboard</Link>
						</Button>
					)}
					<Cart />
				</div>
			</div>
		</header>
	);
}
