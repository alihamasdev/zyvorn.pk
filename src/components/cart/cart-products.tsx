"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

import { getCartProducts } from "@/lib/dal";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { ProductCartCard } from "@/components/cart/product-cart-card";

export function CartProducts() {
	const router = useRouter();

	const { cart, clearCart } = useCartStore();

	const { data, status } = useQuery({
		queryKey: ["cart-products"],
		queryFn: () => getCartProducts(cart),
		retry: 3
	});

	if (status === "pending") {
		return <LoaderIcon className="mx-auto mt-6 animate-spin" />;
	}

	if (status === "error") {
		clearCart();
		return null;
	}

	const totalAmount = data?.reduce((total, product) => total + product.totalPrice, 0) || 0;

	return (
		<>
			<div className="overflow-y-auto">
				{data.map((product, index) => (
					<ProductCartCard key={index} data={product} showDelete />
				))}
			</div>
			<SheetFooter className="gap-4 border-t py-6">
				<div className="flex items-center justify-between text-xl font-semibold">
					<p>Subtotal:</p>
					<p>{`Rs.${totalAmount}`}</p>
				</div>
				<SheetClose asChild>
					<Button size="lg" className="h-12 cursor-pointer" onClick={() => router.push("/checkout")}>
						Check out
					</Button>
				</SheetClose>
			</SheetFooter>
		</>
	);
}
