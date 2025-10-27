import Link from "next/link";

import { Button } from "@/components/ui/button";

export function EmptyCheckout() {
	return (
		<div className="flex min-h-[80dvh] flex-col items-center justify-center gap-6">
			<p className="text-muted-foreground text-center">Your cart is empty. Please add some products to proceed to checkout.</p>
			<Link href={"/"}>
				<Button>Go to products</Button>
			</Link>
		</div>
	);
}
