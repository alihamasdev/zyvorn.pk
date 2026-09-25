import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/server";
import { PROVINCE } from "@/lib/prisma/enums";
import { getCart } from "@/components/cart/actions";
import { CheckoutForm } from "@/components/checkout/form";
import { OrderSummary } from "@/components/checkout/order-summary";

export default async function CheckoutPage({ params }: PageProps<"/checkout/[cartId]">) {
	const { cartId } = await params;
	const [cart, user] = await Promise.all([getCart(cartId), getSession()]);

	if (!cart || cart.items.length === 0) {
		return redirect("/");
	}

	return (
		<div className="grid flex-1 grid-cols-1 md:divide-x lg:grid-cols-2">
			<section className="flex justify-center lg:justify-end">
				<div className="w-full p-4 md:max-w-150 md:p-8">
					<CheckoutForm
						cartId={cartId}
						provinces={Object.keys(PROVINCE)}
						defaultValues={{
							email: user?.user?.email ?? "",
							name: user?.user?.name ?? "",
							phone: "",
							address: "",
							city: "",
							postalCode: "",
							province: "PUNJAB",
							country: "PAKISTAN",
							paymentMethod: "CASH_ON_DELIVERY",
						}}
					>
						<OrderSummary cart={cart} />
					</CheckoutForm>
				</div>
			</section>
			<section className="bg-muted/75 hidden justify-center md:*:max-w-120 lg:flex lg:justify-start">
				<div className="w-full p-4 md:max-w-120 md:p-8">
					<OrderSummary cart={cart} />
				</div>
			</section>
		</div>
	);
}
