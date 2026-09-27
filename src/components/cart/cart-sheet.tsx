"use client";
"use no memo";

import { ShoppingCartIcon } from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { useCartContext } from "@/context/cart-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetCloseButton, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CartSheetContent } from "@/components/cart/cart-sheet-content";

export function CartSheet() {
	const { count, status } = useCart();
	const { isOpen, toggleCart } = useCartContext();

	return (
		<Sheet open={isOpen} onOpenChange={toggleCart}>
			<SheetTrigger asChild>
				<Button
					variant="secondary"
					size="icon"
					className="relative"
					aria-label={status === "success" && count > 0 ? `Shopping cart with ${count} items` : "Shopping cart"}
				>
					<ShoppingCartIcon />
					{status === "success" && <Badge variant="right">{count}</Badge>}
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="gap-0">
				<SheetHeader>
					<SheetTitle>Shopping Cart</SheetTitle>
					<SheetCloseButton />
					<SheetDescription hidden />
				</SheetHeader>
				<CartSheetContent />
			</SheetContent>
		</Sheet>
	);
}
