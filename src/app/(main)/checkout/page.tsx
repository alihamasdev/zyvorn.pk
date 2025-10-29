import { getCartProducts } from "@/lib/dal";
import { productIdLoader } from "@/lib/utils";
import { ProductCartCard } from "@/components/cart/product-cart-card";
import { CartCheckout } from "@/components/pages/checkout/cart-checkout";
import { EmptyCheckout } from "@/components/pages/checkout/empty-checkout";
import { CheckoutForm } from "@/components/pages/checkout/form";

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
	const { productId } = await productIdLoader(searchParams);

	if (productId) {
		const product = await getCartProducts([{ variationId: productId, quantity: 1 }]);
		if (!product.length) {
			return <EmptyCheckout />;
		}

		return (
			<main className="flex flex-col-reverse gap-y-10 md:grid md:grid-cols-2 md:gap-x-20">
				<section>
					<CheckoutForm products={[{ productId: product[0].productId, variationId: product[0].variationId }]} amount={product[0].price} />
				</section>
				<section className="mt-5 w-full max-w-md space-y-6">
					<ProductCartCard data={product[0]} className="px-0 py-3" />
					<div>
						<div className="flex flex-col gap-1">
							<div className="flex items-center justify-between">
								<p>Subtotal</p>
								<p>Rs.{product[0].price}</p>
							</div>
							<div className="flex items-center justify-between">
								<p>Shipping</p>
								<p>Free</p>
							</div>
							<div className="mt-4 flex items-center justify-between text-xl font-medium">
								<p>Total</p>
								<p>Rs.{product[0].price}</p>
							</div>
						</div>
					</div>
				</section>
			</main>
		);
	}

	return <CartCheckout />;
}
