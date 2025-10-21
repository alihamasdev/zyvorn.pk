"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCartIcon } from "lucide-react";

import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
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
import { CartProducts } from "@/components/cart/cart-products";

export function Cart() {
	const router = useRouter();

	const { cart, getTotalItems } = useCartStore();

	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<Sheet>
			<SheetTrigger className="relative inline-flex size-9 cursor-pointer items-center justify-center">
				<ShoppingCartIcon size={18} />
				{isClient && (
					<span className="bg-foreground text-background absolute top-0 right-0 inline-flex size-4 items-center justify-center rounded-full text-[10px] tabular-nums">
						{getTotalItems()}
					</span>
				)}
			</SheetTrigger>
			<SheetContent className="w-full gap-0">
				<SheetHeader>
					<SheetTitle>Shopping Cart</SheetTitle>
					<SheetCloseButton />
					<SheetDescription hidden />
				</SheetHeader>
				{cart.length ? (
					<CartProducts />
				) : (
					<div className="text-muted-foreground mt-6 flex flex-col items-center gap-2">
						<p className="text-center text-sm">Your cart is empty</p>
						<SheetClose asChild>
							<Button onClick={() => router.push("/")}>Return to Shop</Button>
						</SheetClose>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
