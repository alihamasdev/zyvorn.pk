"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCartIcon, Trash2Icon } from "lucide-react";

import { useCartStore } from "@/lib/store/cart-store";
import { useCartQuery } from "@/hooks/use-cart-query";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetCloseButton,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/components/ui/sheet";
import { ProductCartCard } from "@/components/cart/product-cart-card";

export function Cart() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return <div className="size-9">{isClient && <CartSheet />}</div>;
}

function CartSheet() {
	const router = useRouter();
	const { removeFromCart } = useCartStore();
	const { data, totalItems } = useCartQuery();

	return (
		<Sheet>
			<SheetTrigger className="relative inline-flex size-9 cursor-pointer items-center justify-center">
				<ShoppingCartIcon size={18} />
				{data && (
					<span className="bg-foreground text-background absolute top-0 right-0 inline-flex size-4 items-center justify-center rounded-full text-[10px] tabular-nums">
						{totalItems}
					</span>
				)}
			</SheetTrigger>
			<SheetContent className="w-full gap-0">
				<SheetHeader>
					<SheetTitle>Shopping Cart</SheetTitle>
					<SheetCloseButton />
					<SheetDescription hidden />
				</SheetHeader>
				<div className="overflow-y-auto">
					{data?.map((product, index) => (
						<ProductCartCard key={index} data={product}>
							<button
								type="button"
								className="text-destructive mt-1 size-5 cursor-pointer"
								onClick={() => removeFromCart(product.variationId)}
							>
								<Trash2Icon size={18} />
							</button>
						</ProductCartCard>
					))}
				</div>
				<SheetFooter className="gap-4 border-t py-6">
					<div className="flex items-center justify-between text-xl font-semibold">
						<p>Subtotal:</p>
						<p>{`Rs.${data?.reduce((total, product) => total + product.totalPrice, 0) || 0}`}</p>
					</div>
					<SheetClose asChild>
						<Button size="lg" className="h-12 cursor-pointer" onClick={() => router.push("/checkout")}>
							Check out
						</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
