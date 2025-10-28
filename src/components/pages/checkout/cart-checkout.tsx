"use client";

import { LoaderIcon } from "lucide-react";

import { useCartQuery } from "@/hooks/use-cart-query";
import { ProductCartCard } from "@/components/cart/product-cart-card";
import { CheckoutForm } from "@/components/pages/checkout/form";

import { EmptyCheckout } from "./empty-checkout";

export function CartCheckout() {
	const { data, status } = useCartQuery();

	if (status === "pending") {
		return <LoaderIcon className="mx-auto mt-10 animate-spin" />;
	}

	if (status === "error") {
		return null;
	}

	if (!data?.length) {
		return <EmptyCheckout />;
	}

	return (
		<main className="grid gap-x-20 md:grid-cols-2">
			<section>
				<CheckoutForm
					products={data.map(({ variationId, productId }) => ({ variationId, productId }))}
					amount={data.reduce((total, product) => total + product.totalPrice, 0) || 0}
				/>
			</section>
			<section className="mt-5 w-full max-w-md space-y-6">
				{data.map((product) => (
					<ProductCartCard key={product.variationId} data={product} className="p-0" />
				))}
				<div>
					<div className="flex flex-col gap-1">
						<div className="flex items-center justify-between">
							<p>Subtotal</p>
							<p>Rs.{data.reduce((total, product) => total + product.totalPrice, 0)}</p>
						</div>
						<div className="flex items-center justify-between">
							<p>Shipping</p>
							<p>Free</p>
						</div>
						<div className="mt-4 flex items-center justify-between text-xl font-medium">
							<p>Total</p>
							<p>Rs.{data.reduce((total, product) => total + product.totalPrice, 0)}</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
